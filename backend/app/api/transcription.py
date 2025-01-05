import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.services.transcription import TranscriptionService
from app.services.transcription_wav2vec import Wav2Vec2TranscriptionService
from app.utils.file_handler import save_temp_file, delete_file

transcription_router = APIRouter()

# Initialize services
whisper_service = TranscriptionService()
wav2vec_service = Wav2Vec2TranscriptionService()


@transcription_router.post("/whisper")
async def transcribe_with_whisper(file: UploadFile = File(...)):
    temp_path = save_temp_file(file)
    try:
        transcript = whisper_service.transcribe_audio(temp_path)
        return {"status": "success", "transcript": transcript}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": str(e)}
        )
    finally:
        delete_file(temp_path)


@transcription_router.post("/wav2vec")
async def transcribe_with_wav2vec(file: UploadFile = File(...)):
    temp_path = save_temp_file(file)
    try:
        transcript = wav2vec_service.transcribe_audio(temp_path)
        return {"status": "success", "transcript": transcript}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": str(e)}
        )
    finally:
        delete_file(temp_path)
