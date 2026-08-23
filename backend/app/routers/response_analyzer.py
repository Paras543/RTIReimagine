from fastapi import APIRouter
from app.models.schemas import ResponseAnalyzeRequest, ResponseAnalysis
from app.services.response_service import analyze_response

router = APIRouter()


@router.post("/analyze-response", response_model=ResponseAnalysis)
def post_analyze_response(request: ResponseAnalyzeRequest):
    return analyze_response(request)
