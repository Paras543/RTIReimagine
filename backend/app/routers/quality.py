from fastapi import APIRouter, Depends
from app.auth import verify_clerk_token
from app.models.schemas import QualityRequest, QualityCheck
from app.services.quality_service import check_quality

router = APIRouter()


@router.post("/quality-check", response_model=QualityCheck)
def post_quality_check(request: QualityRequest, _: dict = Depends(verify_clerk_token)):
    return check_quality(request)
