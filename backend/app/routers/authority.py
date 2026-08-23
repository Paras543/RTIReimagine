from fastapi import APIRouter
from app.models.schemas import AuthorityRequest, AuthorityResult
from app.services.authority_service import find_authority

router = APIRouter()


@router.post("/authority", response_model=AuthorityResult)
def post_authority(request: AuthorityRequest):
    return find_authority(request)
