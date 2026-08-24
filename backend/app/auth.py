"""
Clerk JWT verification dependency.

Usage in any router:
    from app.auth import verify_clerk_token
    from fastapi import Depends

    @router.post("/your-endpoint")
    def handler(request: ..., _: dict = Depends(verify_clerk_token)):
        ...

The dependency validates the Bearer token sent by the frontend proxy against
Clerk's public JWKS endpoint, raises HTTP 401 on failure, and returns the
decoded JWT payload (contains `sub` = Clerk user ID).
"""

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.config import settings

_bearer_scheme = HTTPBearer(auto_error=True)

# Clerk JWKS URL — fetched once per process and cached in memory.
_CLERK_JWKS_URL = "https://api.clerk.com/v1/jwks"
_jwks_cache: dict | None = None


def _get_jwks() -> dict:
    """Fetch Clerk's JWKS, caching the result for the process lifetime."""
    global _jwks_cache
    if _jwks_cache is None:
        resp = httpx.get(
            _CLERK_JWKS_URL,
            headers={"Authorization": f"Bearer {settings.clerk_secret_key}"},
            timeout=10,
        )
        resp.raise_for_status()
        _jwks_cache = resp.json()
    return _jwks_cache


def verify_clerk_token(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
) -> dict:
    """
    FastAPI dependency — validates a Clerk-issued JWT.

    Raises HTTP 401 if:
    - No Authorization header / not a Bearer token.
    - Token is expired, tampered with, or issued by a different Clerk instance.
    - JWKS fetch fails.

    Returns the decoded JWT payload on success.
    """
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required. Please sign in to file or manage RTI applications.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        jwks = _get_jwks()
        # python-jose handles RS256 key lookup by kid automatically.
        payload = jwt.decode(
            token,
            jwks,
            algorithms=["RS256"],
            options={"verify_aud": False},  # Clerk tokens have no aud claim
        )
        return payload
    except (JWTError, httpx.HTTPError, Exception):
        raise credentials_exception
