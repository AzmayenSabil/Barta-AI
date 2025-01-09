from fastapi import APIRouter
from app.api.transcription import transcription_router

api_router = APIRouter()

# Add transcription routes
api_router.include_router(transcription_router, prefix="/api/transcribe", tags=["Transcription"])
