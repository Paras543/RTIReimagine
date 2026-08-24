from fastapi import APIRouter, Depends
from app.auth import verify_clerk_token
from app.models.schemas import AppealRequest, AppealDraft
from app.services.appeal_service import generate_appeal

router = APIRouter()


@router.post("/appeal", response_model=AppealDraft)
def post_appeal(request: AppealRequest, _: dict = Depends(verify_clerk_token)):
    return generate_appeal(request)
