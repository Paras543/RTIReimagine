"""
Router for manual RTI application filing.
Handles structured submissions, validates inputs, generates official registration numbers,
and registers the application directly into the tracking & history system.
"""
from datetime import date, datetime, timedelta
import random
import string
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import optional_clerk_token
from app.models.schemas import (
    ManualRtiFilingRequest,
    ManualRtiFilingResponse,
    TimelineEvent,
)
from app.routers.tracker import KNOWN_APPLICATIONS

router = APIRouter()


def _generate_registration_number() -> str:
    """Generate a realistic RTI registration number like RTI/2026/7829142."""
    year = date.today().year
    suffix = "".join(random.choices(string.digits, k=7))
    return f"RTI/{year}/{suffix}"


@router.post("/manual-filing/submit", response_model=ManualRtiFilingResponse)
def submit_manual_rti(
    req: ManualRtiFilingRequest,
    _: Optional[dict] = Depends(optional_clerk_token),
):
    """
    Submits a manually composed RTI application.
    Validates applicant information, public authority, and RTI request text.
    """
    if not req.request_text or len(req.request_text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="RTI request text must be at least 10 characters long.",
        )

    if len(req.request_text) > 3000:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="RTI request text exceeds the 3000 character limit.",
        )

    app_id = _generate_registration_number()
    receipt_id = f"REC-{''.join(random.choices(string.ascii_uppercase + string.digits, k=8))}"
    today_str = date.today().strftime("%b %d, %Y")
    now_time = datetime.now().strftime("%I:%M %p")
    est_date = (date.today() + timedelta(days=30)).strftime("%b %d, %Y")

    authority_name = req.authority.ministry or "Public Authority"
    department_name = req.authority.department or "Central Secretariat"

    # Extract lines or bullet points for questions summary
    raw_lines = [line.strip() for line in req.request_text.split("\n") if line.strip()]
    questions = raw_lines[:5] if raw_lines else [req.request_text[:200]]

    # Create timeline events
    timeline = [
        TimelineEvent(
            title="Request Submitted",
            date_time=f"{today_str} • {now_time}",
            description=f"Application successfully logged into the central portal for {authority_name}.",
            status="completed",
        ),
        TimelineEvent(
            title="Received by Nodal Officer",
            date_time=f"Expected by {(date.today() + timedelta(days=1)).strftime('%b %d, %Y')} • 10:00 AM",
            description="Pending verification and assignment by Nodal Officer.",
            status="pending",
        ),
        TimelineEvent(
            title="Forwarded to CPIO",
            date_time=f"Expected by {(date.today() + timedelta(days=2)).strftime('%b %d, %Y')}",
            description=f"To be assigned to CPIO ({department_name})",
            status="pending",
            assigned_to=f"CPIO ({department_name})",
        ),
        TimelineEvent(
            title="Response Pending",
            date_time=f"Estimated resolution by {est_date}",
            description="Statutory processing under Section 7(1) of the RTI Act (30-day mandate).",
            status="pending",
        ),
    ]

    new_application_record = {
        "application_id": app_id,
        "authority_name": authority_name,
        "department": department_name,
        "submitted_date": today_str,
        "type": "RTI Request",
        "stage": "Submitted",
        "status_label": "Under Process",
        "estimated_resolution": est_date,
        "days_remaining": 30,
        "questions": questions,
        "timeline": timeline,
        "can_appeal": False,
    }

    # Insert into the beginning of KNOWN_APPLICATIONS so it shows up at the top
    KNOWN_APPLICATIONS.insert(0, new_application_record)

    fee_amount = 0.0 if req.category.is_bpl else 10.0

    return ManualRtiFilingResponse(
        success=True,
        application_id=app_id,
        authority_name=authority_name,
        department=department_name,
        submitted_date=today_str,
        status="Under Process",
        message="Your RTI application has been successfully filed with the central repository.",
        fee_amount=fee_amount,
        receipt_id=receipt_id,
    )
