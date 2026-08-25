"""
Application tracker and history router.
Provides deterministic timeline data, statutory deadlines, quick actions,
and history records for filed RTI applications.
"""
import hashlib
from datetime import date, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.auth import optional_clerk_token
from app.models.schemas import (
    ApplicationHistoryItem,
    ApplicationHistoryResponse,
    ApplicationStatus,
    TimelineEvent,
)

router = APIRouter()

STAGES = ["Submitted", "Received", "Processing", "Response Received"]

KNOWN_APPLICATIONS = [
    {
        "application_id": "RTI/2026/XXXXXXX",
        "authority_name": "Ministry of Home Affairs",
        "department": "Internal Security Division, Central Secretariat",
        "submitted_date": "Aug 23, 2026",
        "type": "RTI Request",
        "stage": "Processing",
        "status_label": "Under Process",
        "estimated_resolution": "Sep 22, 2026",
        "days_remaining": 28,
        "questions": [
            "Certified copy of administrative sanctions for project contracts.",
            "Total expenditure incurred during the financial year.",
        ],
        "timeline": [
            TimelineEvent(
                title="Request Submitted",
                date_time="Aug 23, 2026 • 10:45 AM",
                description="Application successfully logged into the central portal.",
                status="completed",
            ),
            TimelineEvent(
                title="Received by Nodal Officer",
                date_time="Aug 24, 2026 • 09:15 AM",
                description="Application verified and acknowledged by the nodal authority.",
                status="completed",
            ),
            TimelineEvent(
                title="Forwarded to CPIO",
                date_time="Aug 25, 2026 • 02:30 PM",
                description="Assigned to: Central Public Information Officer (Internal Security Div.)",
                status="completed",
                assigned_to="Central Public Information Officer (Internal Security Div.)",
            ),
            TimelineEvent(
                title="Response Pending",
                date_time="Estimated resolution by Sep 22, 2026",
                description="Statutory processing under Section 7(1) of the RTI Act.",
                status="current",
            ),
        ],
        "can_appeal": False,
    },
    {
        "application_id": "RTI/2025/ABC8921",
        "authority_name": "Department of Revenue",
        "department": "Central Board of Direct Taxes",
        "submitted_date": "Nov 12, 2025",
        "type": "First Appeal",
        "stage": "Response Received",
        "status_label": "Resolved",
        "estimated_resolution": "Dec 12, 2025",
        "days_remaining": 0,
        "questions": [
            "Action Taken Report on grievance ref no. REV/2025/098.",
            "Guidelines followed for revenue tax assessment.",
        ],
        "timeline": [
            TimelineEvent(
                title="First Appeal Submitted",
                date_time="Nov 12, 2025 • 11:20 AM",
                description="First Appeal lodged with First Appellate Authority (FAA).",
                status="completed",
            ),
            TimelineEvent(
                title="Received by FAA",
                date_time="Nov 14, 2025 • 03:00 PM",
                description="Appellate officer admitted the hearing petition.",
                status="completed",
            ),
            TimelineEvent(
                title="Hearing Completed",
                date_time="Nov 28, 2025 • 04:15 PM",
                description="Submissions reviewed by FAA bench.",
                status="completed",
            ),
            TimelineEvent(
                title="Order Issued & Resolved",
                date_time="Dec 10, 2025 • 05:00 PM",
                description="Final certified order uploaded to citizen portal.",
                status="completed",
            ),
        ],
        "can_appeal": False,
    },
    {
        "application_id": "RTI/2025/XYZ3344",
        "authority_name": "Ministry of Defence",
        "department": "Department of Military Affairs",
        "submitted_date": "Sep 05, 2025",
        "type": "RTI Request",
        "stage": "Response Received",
        "status_label": "Resolved",
        "estimated_resolution": "Oct 05, 2025",
        "days_remaining": 0,
        "questions": [
            "Details regarding land demarcation near cantonment perimeter.",
            "Copy of clearance certificate issued by nodal officer.",
        ],
        "timeline": [
            TimelineEvent(
                title="Request Submitted",
                date_time="Sep 05, 2025 • 09:30 AM",
                description="Application logged into central defence portal.",
                status="completed",
            ),
            TimelineEvent(
                title="Forwarded to CPIO",
                date_time="Sep 08, 2025 • 11:00 AM",
                description="Forwarded to Cantonment Board CPIO.",
                status="completed",
            ),
            TimelineEvent(
                title="Response Provided",
                date_time="Oct 01, 2025 • 02:45 PM",
                description="Information furnished by the CPIO in full.",
                status="completed",
            ),
        ],
        "can_appeal": False,
    },
]


@router.get("/applications", response_model=ApplicationHistoryResponse)
def get_applications(
    status_filter: Optional[str] = Query(None, description="all | active | completed"),
    search: Optional[str] = Query(None, description="Search query by registration number or authority"),
    user: Optional[dict] = Depends(optional_clerk_token),
):
    """Retrieve history of all submitted RTI applications and appeals."""
    if not user:
        return ApplicationHistoryResponse(items=[], total_count=0)

    items = []
    for app in KNOWN_APPLICATIONS:
        # Filter by status
        if status_filter:
            sf = status_filter.lower()
            if sf == "active" and app["status_label"].lower() != "under process":
                continue
            if sf == "completed" and app["status_label"].lower() != "resolved":
                continue

        # Filter by search
        if search:
            q = search.lower()
            if (
                q not in app["application_id"].lower()
                and q not in app["authority_name"].lower()
                and q not in app["department"].lower()
            ):
                continue

        items.append(
            ApplicationHistoryItem(
                application_id=app["application_id"],
                authority_name=app["authority_name"],
                submitted_date=app["submitted_date"],
                type=app["type"],
                status=app["status_label"],
                stage=app["stage"],
                days_remaining=app["days_remaining"],
            )
        )

    return ApplicationHistoryResponse(items=items, total_count=len(items))


@router.get("/applications/{application_id:path}", response_model=ApplicationStatus)
def get_application_status(
    application_id: str,
    authority_name: str = "Public Authority",
    user: Optional[dict] = Depends(optional_clerk_token),
):
    """Get status timeline and details for a specific RTI application."""
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required to track application details.",
        )

    # Check if this matches a known application
    for app in KNOWN_APPLICATIONS:
        if app["application_id"].lower() == application_id.strip().lower():
            return ApplicationStatus(**app)

    # Otherwise generate a deterministic plausible state for any arbitrary ID
    seed = int(hashlib.sha256(application_id.encode()).hexdigest(), 16)
    stage_index = seed % len(STAGES)
    stage = STAGES[stage_index]
    days_elapsed = seed % 28
    submitted_dt = date.today() - timedelta(days=days_elapsed)
    days_remaining = max(0, 30 - days_elapsed)
    est_date = (submitted_dt + timedelta(days=30)).strftime("%b %d, %Y")
    sub_date_str = submitted_dt.strftime("%b %d, %Y")

    is_resolved = stage == "Response Received"
    status_label = "Resolved" if is_resolved else "Under Process"

    timeline = [
        TimelineEvent(
            title="Request Submitted",
            date_time=f"{sub_date_str} • 10:45 AM",
            description="Application successfully logged into the central portal.",
            status="completed",
        ),
        TimelineEvent(
            title="Received by Nodal Officer",
            date_time=f"{(submitted_dt + timedelta(days=1)).strftime('%b %d, %Y')} • 09:15 AM",
            description="Application acknowledged by nodal office.",
            status="completed" if stage_index >= 1 else "pending",
        ),
        TimelineEvent(
            title="Forwarded to CPIO",
            date_time=f"{(submitted_dt + timedelta(days=2)).strftime('%b %d, %Y')} • 02:30 PM",
            description=f"Assigned to: Central Public Information Officer ({authority_name})",
            status="completed" if stage_index >= 2 else "pending",
            assigned_to=f"Central Public Information Officer ({authority_name})",
        ),
    ]

    if is_resolved:
        timeline.append(
            TimelineEvent(
                title="Response Provided",
                date_time=f"{date.today().strftime('%b %d, %Y')} • 03:30 PM",
                description="Official response and certified documents uploaded.",
                status="completed",
            )
        )
    else:
        timeline.append(
            TimelineEvent(
                title="Response Pending",
                date_time=f"Estimated resolution by {est_date}",
                description="Statutory processing under Section 7(1) of the RTI Act.",
                status="current" if stage_index == 2 else "pending",
            )
        )

    return ApplicationStatus(
        application_id=application_id,
        authority_name=authority_name if authority_name != "Public Authority" else "Ministry of Home Affairs",
        department=f"{authority_name}, Central Secretariat",
        submitted_date=sub_date_str,
        type="RTI Request",
        stage=stage,
        status_label=status_label,
        estimated_resolution=est_date,
        days_remaining=days_remaining,
        questions=[
            "Certified copy of approved plans and sanctioned budget.",
            "Name and designation of the inspecting official.",
        ],
        timeline=timeline,
        can_appeal=is_resolved or days_remaining == 0,
    )


