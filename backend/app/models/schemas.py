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


# ---------- Application Tracker & History ----------

class TimelineEvent(BaseModel):
    title: str
    date_time: str
    description: Optional[str] = None
    status: Literal["completed", "current", "pending"] = "completed"
    assigned_to: Optional[str] = None


class ApplicationStatus(BaseModel):
    application_id: str
    authority_name: str
    department: Optional[str] = "Central Secretariat"
    submitted_date: str
    type: Literal["RTI Request", "First Appeal"] = "RTI Request"
    stage: Literal["Submitted", "Received", "Processing", "Response Received"]
    status_label: str = "Under Process"
    estimated_resolution: Optional[str] = None
    days_remaining: int
    questions: list[str] = Field(default_factory=list)
    timeline: list[TimelineEvent] = Field(default_factory=list)
    can_appeal: bool = False
    response_text: Optional[str] = None
    has_response: bool = False



class ApplicationHistoryItem(BaseModel):
    application_id: str
    authority_name: str
    submitted_date: str
    type: Literal["RTI Request", "First Appeal"] = "RTI Request"
    status: str = "Under Process"
    stage: Literal["Submitted", "Received", "Processing", "Response Received"]
    days_remaining: int


class ApplicationHistoryResponse(BaseModel):
    items: list[ApplicationHistoryItem]
    total_count: int


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
    recommendation: str = "Gaps detected in the response provide strong statutory grounds for an appeal."
    appeal_recommended: bool = True



# ---------- First Appeal ----------

class AppealRequest(BaseModel):
    original_questions: list[str]
    authority_name: str
    reason: Literal["no_response", "unsatisfactory_response"]
    response_analysis: Optional[ResponseAnalysis] = None


class AppealDraft(BaseModel):
    text: str
    char_count: int


class AppealSubmitRequest(BaseModel):
    original_rti_number: str
    authority_name: str
    department: Optional[str] = "First Appellate Authority"
    ground_of_appeal: str
    appellant_name: str
    email: str
    mobile: str
    address: str
    appeal_text: str
    original_questions: list[str] = Field(default_factory=list)


class AppealSubmitResponse(BaseModel):
    success: bool = True
    appeal_id: str
    original_rti_number: str
    authority_name: str
    submitted_date: str
    receipt_id: str
    status: str = "Under Process"
    message: str = "Your First Appeal has been successfully lodged with the First Appellate Authority."
    fee_amount: float = 0.0



# ---------- Manual RTI Filing ----------

class ApplicantInfo(BaseModel):
    full_name: str
    email: str
    mobile: str
    address: str
    state: str
    district: str
    pincode: str


class CategoryInfo(BaseModel):
    is_bpl: bool = False
    bpl_card_number: Optional[str] = None
    bpl_certificate_url: Optional[str] = None
    category_name: Optional[str] = "General Public Request"


class AuthoritySelection(BaseModel):
    ministry: str
    department: str


class ManualRtiFilingRequest(BaseModel):
    applicant: ApplicantInfo
    category: CategoryInfo
    authority: AuthoritySelection
    subject: Optional[str] = "Right to Information Request"
    request_text: str = Field(..., description="The citizen's RTI query up to 3000 chars.")
    attached_documents: list[str] = Field(default_factory=list)


class ManualRtiFilingResponse(BaseModel):
    success: bool = True
    application_id: str
    authority_name: str
    department: str
    submitted_date: str
    status: str = "Under Process"
    message: str = "Your RTI application has been successfully filed."
    fee_amount: float = 0.0
    receipt_id: str


# ---------- RTI Copilot with RAG ----------

class CopilotAutoDraftRequest(BaseModel):
    query_text: str = Field(..., description="The citizen's raw query or problem description.")
    document_name: Optional[str] = None
    document_content: Optional[str] = Field(
        None, description="Extracted text or summary from user-uploaded supporting file."
    )


class CopilotAutoDraftResponse(BaseModel):
    inferred_category: str
    recommended_ministry: str
    recommended_department: str
    jurisdiction_reason: str
    subject: str
    structured_rti_text: str
    char_count: int
    extracted_rag_facts: list[str] = Field(default_factory=list)
    key_questions: list[str] = Field(default_factory=list)


