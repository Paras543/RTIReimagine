from fastapi import APIRouter
from app.models.schemas import DraftRequest, RTIDraft
from app.services.draft_service import generate_draft

router = APIRouter()


@router.post("/draft", response_model=RTIDraft)
def post_draft(request: DraftRequest):
    return generate_draft(request)
