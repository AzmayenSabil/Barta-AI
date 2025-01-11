import os
import tempfile
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.services.transcription_whisper import WhisperTranscriptionService
from app.services.transcription_wav2vec import Wav2Vec2TranscriptionService
from app.utils.file_handler import save_temp_file, delete_file
from app.utils.audio_preprocessing import AudioPreprocessor
import soundfile as sf
import numpy as np

transcription_router = APIRouter()

# Initialize services
whisper_service = WhisperTranscriptionService()
wav2vec_service = Wav2Vec2TranscriptionService()
audio_preprocessor = AudioPreprocessor()

def save_audio_to_temp_file(audio_array, sample_rate):
    """
    Save processed audio to a temporary file with proper handling
    """
    try:
        # Ensure the array is float32 for soundfile
        if audio_array.dtype != np.float32:
            audio_array = audio_array.astype(np.float32)
        
        # Normalize audio if needed
        if np.abs(audio_array).max() > 1.0:
            audio_array = audio_array / np.abs(audio_array).max()

        # Use tempfile to generate a unique temporary file path
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.wav')
        temp_audio_path = temp_file.name
        temp_file.close()

        # Save the audio file
        sf.write(temp_audio_path, audio_array, sample_rate)
        return temp_audio_path
    
    except Exception as e:
        if temp_audio_path and os.path.exists(temp_audio_path):
            os.unlink(temp_audio_path)
        raise Exception(f"Failed to save processed audio: {str(e)}")

@transcription_router.post("/whisper")
async def transcribe_with_whisper(file: UploadFile = File(...)):
    """
    Endpoint for transcribing audio using Whisper with audio preprocessing.
    """
    temp_files = []  # Track all temporary files for cleanup
    
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.mp3', '.wav', '.m4a', '.ogg')):
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Please upload MP3, WAV, M4A, or OGG files."
            )

        # Save uploaded file
        temp_path = save_temp_file(file)
        temp_files.append(temp_path)

        # Preprocess the audio file
        try:
            audio_array, sample_rate = audio_preprocessor.preprocess(temp_path)
            
            # Log audio duration for debugging
            duration = len(audio_array) / sample_rate
            print(f"Processed audio duration: {duration:.2f} seconds")
            
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Audio preprocessing failed: {str(e)}"
            )

        # Save preprocessed audio
        try:
            processed_audio_path = save_audio_to_temp_file(audio_array, sample_rate)
            temp_files.append(processed_audio_path)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to save processed audio: {str(e)}"
            )

        # Transcribe the preprocessed audio
        try:
            transcript = whisper_service.transcribe_audio(processed_audio_path)
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Transcription failed: {str(e)}"
            )

        return {
            "status": "success",
            "transcript": transcript,
            "audio_duration": duration,
            "sample_rate": sample_rate
        }

    except HTTPException as he:
        return JSONResponse(
            status_code=he.status_code,
            content={"status": "error", "error": he.detail}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": str(e)}
        )
    finally:
        # Clean up all temporary files
        for temp_file in temp_files:
            if temp_file and os.path.exists(temp_file):
                delete_file(temp_file)



@transcription_router.post("/wav2vec")
async def transcribe_with_wav2vec(file: UploadFile = File(...)):
    """
    Endpoint for transcribing audio using Wav2Vec2.
    """
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