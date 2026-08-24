from fastapi import APIRouter, Depends
from app.auth import verify_clerk_token
from app.models.schemas import DraftRequest, RTIDraft
from app.services.draft_service import generate_draft

router = APIRouter()


@router.post("/draft", response_model=RTIDraft)
def post_draft(request: DraftRequest, _: dict = Depends(verify_clerk_token)):
    return generate_draft(request)
