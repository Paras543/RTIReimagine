from fastapi import APIRouter, Depends
from app.auth import verify_clerk_token
from app.models.schemas import IntentRequest, IntentResult
from app.services.intent_service import extract_intent

router = APIRouter()


@router.post("/intent", response_model=IntentResult)
def post_intent(request: IntentRequest, _: dict = Depends(verify_clerk_token)):
    return extract_intent(request)
