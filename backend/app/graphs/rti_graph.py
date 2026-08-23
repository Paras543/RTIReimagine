"""
LangGraph workflows for RTI Copilot.

The LLM-powered orchestration lives here instead of being manually chained
inside individual service functions. Each workflow is a StateGraph with
explicit typed state and nodes.
"""
import json
from pathlib import Path
from typing import TypedDict, Optional, Any

from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI

from app.config import settings
from app.models.schemas import (
    IntentRequest, IntentResult, Authority, AuthorityResult,
    DraftRequest, RTIDraft, QualityCheck, ResponseAnalyzeRequest,
    ResponseAnalysis, QuestionAnalysis, AppealRequest, AppealDraft,
)
from app.services.prompts import (
    INTENT_SYSTEM_PROMPT, AUTHORITY_SYSTEM_PROMPT, DRAFT_SYSTEM_PROMPT,
    QUALITY_SYSTEM_PROMPT, RESPONSE_ANALYSIS_SYSTEM_PROMPT, APPEAL_SYSTEM_PROMPT,
)

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "authorities.json"


def get_llm():
    """Create the configured OpenAI-compatible chat model for LangChain."""
    if not settings.llm_api_key:
        raise RuntimeError(
            "LLM_API_KEY is not set. Copy backend/.env.example to backend/.env "
            "and add your Groq (or Gemini/OpenAI) API key."
        )
    return ChatOpenAI(
        api_key=settings.llm_api_key,
        base_url=settings.llm_base_url,
        model=settings.llm_model,
        temperature=0.2,
    )


def _structured(model_cls):
    # json_mode keeps this compatible with Groq/Gemini/OpenAI-compatible endpoints.
    return get_llm().with_structured_output(model_cls, method="json_mode")


def _load_authorities() -> list[dict]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Main RTI preparation graph: intent -> authority -> draft -> quality
# ---------------------------------------------------------------------------

class RTIState(TypedDict, total=False):
    request: IntentRequest
    intent: IntentResult
    authority_result: AuthorityResult
    draft: RTIDraft
    quality: QualityCheck


def intent_node(state: RTIState) -> dict:
    request = state["request"]
    user_prompt = f"Citizen's message: {request.text}"
    if request.previous_answers:
        user_prompt += (
            "\n\nAnswers to earlier follow-up questions: "
            + json.dumps(request.previous_answers)
        )
    result = _structured(IntentResult).invoke([
        ("system", INTENT_SYSTEM_PROMPT),
        ("human", user_prompt),
    ])
    return {"intent": result}


def authority_node(state: RTIState) -> dict:
    intent = state["intent"]
    authorities = _load_authorities()
    user_prompt = (
        f"Citizen's intent: {intent.model_dump_json()}\n\n"
        "Candidate public authorities (choose from these where possible, "
        "a close match is fine if nothing is exact):\n"
        + json.dumps(authorities, indent=2)
    )
    result = _structured(AuthorityResult).invoke([
        ("system", AUTHORITY_SYSTEM_PROMPT),
        ("human", user_prompt),
    ])
    return {"authority_result": result}


def draft_node(state: RTIState) -> dict:
    intent = state["intent"]
    authority = state["authority_result"].recommended
    user_prompt = (
        f"Citizen's intent: {intent.model_dump_json()}\n\n"
        f"Recommended authority: {authority.model_dump_json()}"
    )
    result = _structured(RTIDraft).invoke([
        ("system", DRAFT_SYSTEM_PROMPT),
        ("human", user_prompt),
    ])
    # Do not trust model-generated metadata.
    result.char_count = len(result.full_text)
    return {"draft": result}


def quality_node(state: RTIState) -> dict:
    draft = state["draft"]
    result = _structured(QualityCheck).invoke([
        ("system", QUALITY_SYSTEM_PROMPT),
        ("human", f"RTI application text:\n\n{draft.full_text}"),
    ])
    # Deterministic fields belong to application code, not the LLM.
    result.char_count = len(draft.full_text)
    result.char_limit = 3000
    result.within_limit = result.char_count <= 3000
    return {"quality": result}


def build_rti_graph():
    graph = StateGraph(RTIState)
    graph.add_node("extract_intent", intent_node)
    graph.add_node("find_authority", authority_node)
    graph.add_node("generate_draft", draft_node)
    graph.add_node("quality_check", quality_node)
    graph.add_edge(START, "extract_intent")
    graph.add_edge("extract_intent", "find_authority")
    graph.add_edge("find_authority", "generate_draft")
    graph.add_edge("generate_draft", "quality_check")
    graph.add_edge("quality_check", END)
    return graph.compile()


# ---------------------------------------------------------------------------
# Response-analysis graph
# ---------------------------------------------------------------------------

class ResponseState(TypedDict, total=False):
    request: ResponseAnalyzeRequest
    analysis: ResponseAnalysis


def response_analysis_node(state: ResponseState) -> dict:
    request = state["request"]
    user_prompt = (
        "Original questions:\n"
        + "\n".join(f"{i+1}. {q}" for i, q in enumerate(request.original_questions))
        + f"\n\nGovernment response text:\n{request.response_text}"
    )
    result = _structured(_ResponseAnalysisLLM).invoke([
        ("system", RESPONSE_ANALYSIS_SYSTEM_PROMPT),
        ("human", user_prompt),
    ])
    items = [QuestionAnalysis(**item.model_dump()) for item in result.items]
    answered = sum(i.status == "answered" for i in items)
    partial = sum(i.status == "partial" for i in items)
    unanswered = sum(i.status == "unanswered" for i in items)
    analysis = ResponseAnalysis(
        items=items,
        answered_count=answered,
        partial_count=partial,
        unanswered_count=unanswered,
        summary=result.summary,
    )
    return {"analysis": analysis}


# Internal model avoids relying on the response-count fields during generation.
class _ResponseItemLLM(__import__("pydantic").BaseModel):
    question: str
    status: str
    explanation: str


class _ResponseAnalysisLLM(__import__("pydantic").BaseModel):
    items: list[_ResponseItemLLM]
    summary: str


def build_response_graph():
    graph = StateGraph(ResponseState)
    graph.add_node("analyze_response", response_analysis_node)
    graph.add_edge(START, "analyze_response")
    graph.add_edge("analyze_response", END)
    return graph.compile()


# ---------------------------------------------------------------------------
# First-appeal graph
# ---------------------------------------------------------------------------

class AppealState(TypedDict, total=False):
    request: AppealRequest
    appeal: AppealDraft


def appeal_node(state: AppealState) -> dict:
    request = state["request"]
    user_prompt = (
        f"Authority: {request.authority_name}\n"
        f"Reason for appeal: {request.reason}\n"
        "Original questions:\n"
        + "\n".join(f"{i+1}. {q}" for i, q in enumerate(request.original_questions))
    )
    if request.response_analysis:
        user_prompt += (
            "\n\nResponse analysis: "
            + request.response_analysis.model_dump_json()
        )
    result = _structured(AppealDraft).invoke([
        ("system", APPEAL_SYSTEM_PROMPT),
        ("human", user_prompt),
    ])
    result.char_count = len(result.text)
    return {"appeal": result}


def build_appeal_graph():
    graph = StateGraph(AppealState)
    graph.add_node("draft_first_appeal", appeal_node)
    graph.add_edge(START, "draft_first_appeal")
    graph.add_edge("draft_first_appeal", END)
    return graph.compile()


# Small stage graphs are exposed as well as the end-to-end graph. This lets
# the REST layer keep its existing endpoint-by-endpoint contract while every
# LLM operation still runs through LangGraph.

class IntentOnlyState(TypedDict, total=False):
    request: IntentRequest
    intent: IntentResult

class AuthorityOnlyState(TypedDict, total=False):
    intent: IntentResult
    authority_result: AuthorityResult

class DraftOnlyState(TypedDict, total=False):
    intent: IntentResult
    authority_result: AuthorityResult
    draft: RTIDraft

class QualityOnlyState(TypedDict, total=False):
    draft: RTIDraft
    quality: QualityCheck


def build_intent_graph():
    g = StateGraph(IntentOnlyState)
    g.add_node("extract_intent", intent_node)
    g.add_edge(START, "extract_intent")
    g.add_edge("extract_intent", END)
    return g.compile()


def build_authority_graph():
    g = StateGraph(AuthorityOnlyState)
    g.add_node("find_authority", authority_node)
    g.add_edge(START, "find_authority")
    g.add_edge("find_authority", END)
    return g.compile()


def build_draft_graph():
    g = StateGraph(DraftOnlyState)
    g.add_node("generate_draft", draft_node)
    g.add_edge(START, "generate_draft")
    g.add_edge("generate_draft", END)
    return g.compile()


def build_quality_graph():
    g = StateGraph(QualityOnlyState)
    g.add_node("quality_check", quality_node)
    g.add_edge(START, "quality_check")
    g.add_edge("quality_check", END)
    return g.compile()


# Compiled graphs are intentionally reused by the service layer.
rti_graph = build_rti_graph()
intent_graph = build_intent_graph()
authority_graph = build_authority_graph()
draft_graph = build_draft_graph()
quality_graph = build_quality_graph()
response_graph = build_response_graph()
appeal_graph = build_appeal_graph()
