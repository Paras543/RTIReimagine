from fastapi import APIRouter
from app.models.schemas import QualityRequest, QualityCheck
from app.services.quality_service import check_quality

router = APIRouter()


@router.post("/quality-check", response_model=QualityCheck)
def post_quality_check(request: QualityRequest):
    return check_quality(request)
