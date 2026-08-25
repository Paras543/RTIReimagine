from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import (
    intent,
    authority,
    draft,
    quality,
    tracker,
    response_analyzer,
    appeal,
    manual_filing,
    copilot,
)

app = FastAPI(
    title="RTI Copilot API",
    description="AI-guided citizen-first RTI filing assistant.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(intent.router, prefix="/api", tags=["intent"])
app.include_router(authority.router, prefix="/api", tags=["authority"])
app.include_router(draft.router, prefix="/api", tags=["draft"])
app.include_router(quality.router, prefix="/api", tags=["quality"])
app.include_router(tracker.router, prefix="/api", tags=["tracker"])
app.include_router(response_analyzer.router, prefix="/api", tags=["response"])
app.include_router(appeal.router, prefix="/api", tags=["appeal"])
app.include_router(manual_filing.router, prefix="/api", tags=["manual-filing"])
app.include_router(copilot.router, prefix="/api", tags=["copilot"])




@app.get("/api/health")
def health():
    return {"status": "ok", "service": "rti-copilot-backend"}
