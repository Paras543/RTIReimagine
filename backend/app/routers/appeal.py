import random
import string
from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from app.auth import optional_clerk_token
from app.models.schemas import (
    AppealRequest,
    AppealDraft,
    AppealSubmitRequest,
    AppealSubmitResponse,
    TimelineEvent,
)
from app.services.appeal_service import generate_appeal
from app.routers.tracker import KNOWN_APPLICATIONS

router = APIRouter()


@router.post("/appeal", response_model=AppealDraft)
def post_appeal(request: AppealRequest, _: Optional[dict] = Depends(optional_clerk_token)):
    return generate_appeal(request)


@router.post("/appeal/submit", response_model=AppealSubmitResponse)
def submit_first_appeal(
    req: AppealSubmitRequest,
    _: Optional[dict] = Depends(optional_clerk_token),
):
    """
    Lodge an official First Appeal under Section 19(1) of the RTI Act, 2005.
    Registers the appeal in the central tracker with zero fee requirement.
    """
    if len(req.appeal_text.strip()) < 10:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Appeal petition text must be at least 10 characters.",
        )

    # Generate First Appeal ID (FAA/2026/XXXXXXX)
    rand_digits = "".join(random.choices(string.digits, k=7))
    appeal_id = f"FAA/2026/{rand_digits}"

    # Generate Receipt ID
    rand_alpha = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    receipt_id = f"REC-FAA-{rand_alpha}"

    today_str = date.today().strftime("%b %d, %Y")

    # Construct new application object for tracking
    new_appeal_record = {
        "application_id": appeal_id,
        "authority_name": req.authority_name,
        "department": req.department or f"First Appellate Authority, {req.authority_name}",
        "submitted_date": today_str,
        "type": "First Appeal",
        "stage": "Processing",
        "status_label": "Under Process",
        "estimated_resolution": "Within 30–45 days (Section 19(6))",
        "days_remaining": 30,
        "questions": req.original_questions or [f"First Appeal against RTI: {req.original_rti_number}"],
        "timeline": [
            TimelineEvent(
                title="First Appeal Submitted",
                date_time=f"{today_str} • Just Now",
                description=f"First Appeal lodged under Section 19(1) citing: {req.ground_of_appeal}.",
                status="completed",
            ),
            TimelineEvent(
                title="Acknowledgment by FAA Registry",
                date_time="Within 2 Working Days",
                description=f"Appeal notice queued for First Appellate Authority ({req.authority_name}).",
                status="current",
            ),
            TimelineEvent(
                title="Hearing / Notice to CPIO",
                date_time="Statutory Notice",
                description="CPIO directed to submit reasons for omission / withholding of public records.",
                status="pending",
            ),
            TimelineEvent(
                title="Appellate Order Pronouncement",
                date_time="Mandatory 30-Day Limit (Sec 19(6))",
                description="Final binding appellate decision and disclosure order.",
                status="pending",
            ),
        ],
        "can_appeal": False,
    }

    # Register into tracker
    KNOWN_APPLICATIONS.insert(0, new_appeal_record)

    return AppealSubmitResponse(
        success=True,
        appeal_id=appeal_id,
        original_rti_number=req.original_rti_number,
        authority_name=req.authority_name,
        submitted_date=today_str,
        receipt_id=receipt_id,
        status="Under Process",
        message="Your First Appeal has been successfully lodged with the First Appellate Authority.",
        fee_amount=0.0,
    )


