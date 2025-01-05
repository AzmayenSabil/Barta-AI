import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.services.transcription import TranscriptionService
from app.utils.file_handler import save_temp_file, delete_file

transcription_router = APIRouter()

# Initialize transcription service
transcription_service = TranscriptionService()


@transcription_router.post("/")
async def transcribe_audio(file: UploadFile = File(...)):
    print("Transcribing audio file...")
    temp_path = save_temp_file(file)
    try:
        transcript = transcription_service.transcribe_audio(temp_path)
        print("Transcription Returned")
        return {"status": "success", "transcript": transcript}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": str(e)}
        )
    finally:
        delete_file(temp_path)
