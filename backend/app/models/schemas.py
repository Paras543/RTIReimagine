"""
All Pydantic models for the RTI Copilot backend.
These are the contract between the AI services, the routers, and the frontend.
Keep field names stable once the frontend starts consuming them.
"""
from typing import Literal, Optional
from pydantic import BaseModel, Field


# ---------- Intent Understanding ----------

class IntentRequest(BaseModel):
    text: str = Field(..., description="The citizen's free-text question, in their own words.")
    previous_answers: Optional[dict] = Field(
        default=None, description="Answers to earlier follow-up questions, if any."
    )


class IntentResult(BaseModel):
    subject: str = Field(..., description="What the citizen wants to know about, in a few words.")
    location: Optional[str] = None
    project_or_department: Optional[str] = None
    time_period: Optional[str] = None
    category: str = Field(..., description="e.g. 'infrastructure', 'education funding', 'welfare scheme'")
    missing_fields: list[str] = Field(default_factory=list)
    follow_up_question: Optional[str] = Field(
        default=None, description="A single most-useful clarifying question, or null if nothing is missing."
    )


# ---------- Authority Finder ----------

class AuthorityRequest(BaseModel):
    intent: IntentResult


class Authority(BaseModel):
    name: str
    jurisdiction: Literal["Central", "State", "Municipal/Local"]
    department: str
    reason: str = Field(..., description="One-line justification for why this authority is likely responsible.")


class AuthorityResult(BaseModel):
    recommended: Authority
    alternatives: list[Authority] = Field(default_factory=list)


# ---------- RTI Draft Generator ----------

class DraftRequest(BaseModel):
    intent: IntentResult
    authority: Authority


class RTIDraft(BaseModel):
    questions: list[str] = Field(..., description="Numbered, specific, document-request-style RTI questions.")
    full_text: str = Field(..., description="The questions formatted as a single application body.")
    char_count: int


# ---------- Quality Checker ----------

class QualityRequest(BaseModel):
    draft_text: str


class QualityCheck(BaseModel):
    char_count: int
    char_limit: int = 3000
    within_limit: bool
    is_specific: bool
    has_time_period: bool
    issues: list[str] = Field(default_factory=list)
    suggestions: list[str] = Field(default_factory=list)


# ---------- Application Tracker (mock) ----------

class ApplicationStatus(BaseModel):
    application_id: str
    authority_name: str
    submitted_date: str
    stage: Literal["Submitted", "Received", "Processing", "Response Received"]
    questions: list[str]
    days_remaining: int


# ---------- Response Analyzer ----------

class ResponseAnalyzeRequest(BaseModel):
    original_questions: list[str]
    response_text: str


class QuestionAnalysis(BaseModel):
    question: str
    status: Literal["answered", "partial", "unanswered"]
    explanation: str = Field(..., description="Plain-language explanation of what was/wasn't provided.")


class ResponseAnalysis(BaseModel):
    items: list[QuestionAnalysis]
    answered_count: int
    partial_count: int
    unanswered_count: int
    summary: str


# ---------- First Appeal ----------

class AppealRequest(BaseModel):
    original_questions: list[str]
    authority_name: str
    reason: Literal["no_response", "unsatisfactory_response"]
    response_analysis: Optional[ResponseAnalysis] = None


class AppealDraft(BaseModel):
    text: str
    char_count: int
