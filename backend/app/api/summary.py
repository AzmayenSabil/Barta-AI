from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.services.summaryTask_service import process_meeting_summary  # Import the service function

summary_router = APIRouter()

# Define the TranscriptEntry model
class TranscriptEntry(BaseModel):
    start_time: str
    end_time: str
    dialogue: str
    name: Optional[str] = None
    sentiment: Optional[str] = None

@summary_router.post("/process-meeting")
async def process_meeting(transcript: List[TranscriptEntry]):
    """
    Process a meeting transcript to generate sentiment analysis,
    action items, and a meeting summary.
    """
    if not transcript:
        raise HTTPException(status_code=400, detail="Transcript data is missing")

    try:
        # Convert Pydantic models to dictionaries before passing them to the processing function
        transcript_dicts = [entry.dict() for entry in transcript]

        # Call the imported process_meeting_summary function
        result = process_meeting_summary(transcript_dicts)

        return {"status": "success", "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing meeting summary: {str(e)}")
