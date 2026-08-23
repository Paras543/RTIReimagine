"""
Mock application tracker. For the hackathon there is no real RTI portal
integration, so this endpoint returns a plausible, deterministic fake
status timeline for any application_id. Good enough to demo the
"Application Tracker" and "Deadline intelligence" features without
building real government integration.
"""
import hashlib
from datetime import date, timedelta
from fastapi import APIRouter
from app.models.schemas import ApplicationStatus

router = APIRouter()

STAGES = ["Submitted", "Received", "Processing", "Response Received"]


@router.get("/applications/{application_id}", response_model=ApplicationStatus)
def get_application_status(application_id: str, authority_name: str = "Public Authority"):
    # Deterministic "randomness" so the same ID always returns the same demo state.
    seed = int(hashlib.sha256(application_id.encode()).hexdigest(), 16)
    stage_index = seed % len(STAGES)
    days_elapsed = seed % 28
    submitted_date = date.today() - timedelta(days=days_elapsed)
    days_remaining = max(0, 30 - days_elapsed)

    return ApplicationStatus(
        application_id=application_id,
        authority_name=authority_name,
        submitted_date=submitted_date.isoformat(),
        stage=STAGES[stage_index],
        questions=[],
        days_remaining=days_remaining,
    )
