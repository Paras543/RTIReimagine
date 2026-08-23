from fastapi import APIRouter
from app.models.schemas import AppealRequest, AppealDraft
from app.services.appeal_service import generate_appeal

router = APIRouter()


@router.post("/appeal", response_model=AppealDraft)
def post_appeal(request: AppealRequest):
    return generate_appeal(request)
