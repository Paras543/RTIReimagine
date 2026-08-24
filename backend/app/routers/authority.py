from fastapi import APIRouter, Depends
from app.auth import verify_clerk_token
from app.models.schemas import AuthorityRequest, AuthorityResult
from app.services.authority_service import find_authority

router = APIRouter()


@router.post("/authority", response_model=AuthorityResult)
def post_authority(request: AuthorityRequest, _: dict = Depends(verify_clerk_token)):
    return find_authority(request)
