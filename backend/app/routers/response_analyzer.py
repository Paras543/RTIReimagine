from typing import Optional
from fastapi import APIRouter, Depends
from app.auth import optional_clerk_token
from app.models.schemas import ResponseAnalyzeRequest, ResponseAnalysis
from app.services.response_service import analyze_response

router = APIRouter()


@router.post("/analyze-response", response_model=ResponseAnalysis)
def post_analyze_response(request: ResponseAnalyzeRequest, _: Optional[dict] = Depends(optional_clerk_token)):
    return analyze_response(request)

