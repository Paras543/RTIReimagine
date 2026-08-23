from fastapi import APIRouter
from app.models.schemas import IntentRequest, IntentResult
from app.services.intent_service import extract_intent

router = APIRouter()


@router.post("/intent", response_model=IntentResult)
def post_intent(request: IntentRequest):
    return extract_intent(request)
