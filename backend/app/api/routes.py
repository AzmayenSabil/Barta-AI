from fastapi import APIRouter
from app.api.transcription import transcription_router
from app.api.summary import summary_router

api_router = APIRouter()

# Add transcription routes
api_router.include_router(transcription_router, prefix="/api/transcribe", tags=["Transcription"])

# Add summary routes
api_router.include_router(summary_router, prefix="/api/summary", tags=["Summary Tasks"])