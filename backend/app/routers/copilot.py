"""
RTI Copilot Router with RAG (Retrieval-Augmented Generation) layer.
Analyzes citizen queries, extracts document facts, determines competent authority,
and generates structured RTI drafts ready for automated form auto-filling.
"""
import re
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import optional_clerk_token
from app.config import settings
from app.models.schemas import (
    CopilotAutoDraftRequest,
    CopilotAutoDraftResponse,
    IntentRequest,
)

router = APIRouter()

# Domain knowledge mapping for authorities and subjects
DOMAIN_KNOWLEDGE = [
    {
        "keywords": ["highway", "road", "nhai", "nh-", "bypass", "toll", "traffic", "expressway", "bridge", "flyover", "pothole", "pvd"],
        "category": "Infrastructure & Transport",
        "ministry": "Ministry of Road Transport and Highways",
        "department": "National Highways Authority of India (NHAI)",
        "jurisdiction": "Central apex body governing National Highways, tenders, and construction oversight.",
        "default_subject": "Details regarding project sanctions, completion timelines, and contractor obligations.",
        "questions_template": [
            "Please provide a certified copy of the approved project completion timeline and DPR.",
            "What is the current official percentage of physical and financial progress achieved to date?",
            "Details of delays, if any, along with copies of explanations submitted by the primary executing agency.",
            "Particulars of penalties or liquidated damages levied for missing intermediate milestone deadlines."
        ]
    },
    {
        "keywords": ["ration", "pds", "grain", "food", "wheat", "rice", "fps", "fair price", "quota", "ration card"],
        "category": "Public Distribution & Food",
        "ministry": "Ministry of Consumer Affairs, Food and Public Distribution",
        "department": "Department of Food and Public Distribution",
        "jurisdiction": "Nodal authority for Targeted Public Distribution System (TPDS) quotas and storage management.",
        "default_subject": "Information regarding PDS monthly quota allocation and fair price shop distribution.",
        "questions_template": [
            "Please provide the official monthly allocation of food grains sanctioned for the designated fair price shop.",
            "Certified copy of the stock register and beneficiary distribution log for the last 6 months.",
            "Criteria and official list of active ration cardholders registered under AAY and PHH categories."
        ]
    },
    {
        "keywords": ["hospital", "health", "medicine", "doctor", "aiims", "oxygen", "dispensary", "ayushman", "pmjay", "medical"],
        "category": "Public Health & Hospitals",
        "ministry": "Ministry of Health and Family Welfare",
        "department": "Department of Health and Family Welfare",
        "jurisdiction": "Central authority overseeing public healthcare infrastructure, central hospitals, and statutory drug supply.",
        "default_subject": "Query regarding hospital equipment procurement, sanctioned staff strength, and essential medicine stocks.",
        "questions_template": [
            "Please provide certified details of the sanctioned vs. actual working strength of medical officers and specialists.",
            "List of essential medicines and diagnostic equipment procured under central health schemes during the current FY.",
            "Certified copy of the maintenance log and operational status of key clinical infrastructure (e.g. ICU/Oxygen plant)."
        ]
    },
    {
        "keywords": ["school", "college", "university", "ugc", "cbse", "exam", "nta", "scholarship", "fee", "degree", "education"],
        "category": "Education & Scholarships",
        "ministry": "Ministry of Education",
        "department": "Department of Higher Education",
        "jurisdiction": "Nodal apex body for central universities, national testing standards, and statutory student welfare grants.",
        "default_subject": "Information regarding scholarship fund disbursement, admission quotas, and institutional affiliations.",
        "questions_template": [
            "Please provide the total number of applications received and disbursed under the designated scholarship scheme.",
            "Certified copy of the inspection report and approval status granted to the institution for the academic year.",
            "Details of unutilized funds returned or carried forward under centrally funded educational grants."
        ]
    },
    {
        "keywords": ["tax", "refund", "gst", "income tax", "bank", "loan", "rbi", "epf", "pension", "finance", "provident"],
        "category": "Finance & Revenue",
        "ministry": "Ministry of Finance",
        "department": "Department of Revenue",
        "jurisdiction": "Central ministry overseeing direct and indirect taxes, revenue administration, and central financial authorities.",
        "default_subject": "Status and official records regarding tax assessment, refund processing, and administrative sanctions.",
        "questions_template": [
            "Please provide the daily progress report and file movement notes for the submitted application/grievance.",
            "Designation and official contact details of the officer currently seized of the matter.",
            "Time limit stipulated in the citizen charter for resolution of such cases and reasons recorded for non-compliance."
        ]
    },
]


def _extract_facts_from_rag(text: str) -> list[str]:
    """Extract key reference numbers, dates, amounts, and names from uploaded text."""
    facts = []
    # Dates
    date_matches = re.findall(r"\b(?:\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{2,4})\b", text, re.IGNORECASE)
    if date_matches:
        facts.append(f"Referenced Dates: {', '.join(set(date_matches[:3]))}")

    # Tender / File / Ref numbers
    ref_matches = re.findall(r"\b(?:NIT|Tender|File|Ref|No|Order)[\s.:#-]+([A-Z0-9/-]{4,20})\b", text, re.IGNORECASE)
    if ref_matches:
        facts.append(f"File/Tender Reference: {', '.join(set(ref_matches[:3]))}")

    # Currency amounts
    amt_matches = re.findall(r"(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d+)?(?:\s*(?:Crore|Lakh|thousand|cr|lakhs))?)", text, re.IGNORECASE)
    if amt_matches:
        facts.append(f"Sanctioned Amount: {amt_matches[0]}")

    if not facts and len(text.strip()) > 20:
        facts.append("Supporting document attached and cross-referenced in query points.")

    return facts


@router.post("/copilot/auto-draft", response_model=CopilotAutoDraftResponse)
def generate_copilot_draft(
    req: CopilotAutoDraftRequest,
    _: Optional[dict] = Depends(optional_clerk_token),
):
    """
    RTI Copilot Auto-Draft Engine:
    Combines user prompt + RAG document extraction, matches the competent public authority,
    and constructs a fully structured, legally sound RTI application.
    """
    query = req.query_text.strip()
    if len(query) < 5:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Please provide a query or description of at least 5 characters.",
        )

    doc_content = (req.document_content or "").strip()
    combined_text = f"{query}\n{doc_content}".lower()

    # Extract RAG facts
    rag_facts = _extract_facts_from_rag(doc_content) if doc_content else []

    # Check for domain match
    matched_domain = None
    for domain in DOMAIN_KNOWLEDGE:
        if any(kw in combined_text for kw in domain["keywords"]):
            matched_domain = domain
            break

    if not matched_domain:
        matched_domain = {
            "category": "Public Administration & General Grievances",
            "ministry": "Ministry of Personnel, Public Grievances and Pensions",
            "department": "Department of Personnel and Training (DoPT)",
            "jurisdiction": "Central authority overseeing public administration and statutory RTI compliance.",
            "default_subject": f"Request for information regarding: {query[:80]}",
            "questions_template": [
                f"Please provide certified copies of all relevant file notes and administrative orders related to: {query[:120]}.",
                "Current status of the matter and daily progress log since the initial representation was submitted.",
                "Designation and name of the official currently responsible for taking action on the above subject.",
                "Copies of any correspondence exchanged between departments regarding this matter."
            ]
        }

    # Construct clean subject
    subject = f"Information sought under RTI Act 2005 regarding {query[:90].strip(' .')}."

    # Construct formal RTI application text
    rag_clause = ""
    if req.document_name:
        rag_clause = f"\n[Reference Document: {req.document_name}]\n"
        if rag_facts:
            rag_clause += f"[Extracted Fact References: {'; '.join(rag_facts)}]\n"

    questions_list = list(matched_domain["questions_template"])

    # If citizen specified particular aspects, tailor question 1
    if len(query) > 15:
        questions_list[0] = f"Please provide certified copies of all administrative sanctions, work orders, and file notings concerning: {query.strip()}."

    numbered_questions = "\n".join(f"{i+1}. {q}" for i, q in enumerate(questions_list))

    structured_text = f"""Subject: {subject}
To: The Central Public Information Officer (CPIO)
{matched_domain['department']},
{matched_domain['ministry']}, Government of India.
{rag_clause}
Sir/Madam,

Under Section 6(1) of the Right to Information Act, 2005, please furnish the following certified information and official records:

{numbered_questions}

As per Section 7(1) of the RTI Act, 2005, you are requested to provide the above information within 30 days of receipt of this application.

Yours faithfully,
Citizen of India
"""

    return CopilotAutoDraftResponse(
        inferred_category=matched_domain["category"],
        recommended_ministry=matched_domain["ministry"],
        recommended_department=matched_domain["department"],
        jurisdiction_reason=matched_domain["jurisdiction"],
        subject=subject,
        structured_rti_text=structured_text.strip(),
        char_count=len(structured_text.strip()),
        extracted_rag_facts=rag_facts,
        key_questions=questions_list,
    )
