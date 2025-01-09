import os
from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from app.services.transcription_whisper import WhisperTranscriptionService
from app.services.transcription_wav2vec import Wav2Vec2TranscriptionService
from app.utils.file_handler import save_temp_file, delete_file
from app.utils.audio_preprocessing import AudioPreprocessor  # Import the preprocessing module
import soundfile as sf  # To save audio to temp files

transcription_router = APIRouter()

# Initialize services
whisper_service = WhisperTranscriptionService()
wav2vec_service = Wav2Vec2TranscriptionService()
audio_preprocessor = AudioPreprocessor()  # Initialize the audio preprocessor


# Function to save processed audio to temporary file
def save_audio_to_temp_file(audio_array, sample_rate):
    temp_audio_path = "temp_processed_audio.wav"
    sf.write(temp_audio_path, audio_array, sample_rate)
    return temp_audio_path


@transcription_router.post("/whisper")
async def transcribe_with_whisper(file: UploadFile = File(...)):
    """
    Endpoint for transcribing audio using Whisper with audio preprocessing.
    """
    temp_path = save_temp_file(file)  # Save the uploaded file temporarily
    try:
        # Preprocess the audio file and get the audio array and sample rate
        audio_array, sample_rate = audio_preprocessor.preprocess(temp_path)

        # Save preprocessed audio to a temporary file
        processed_audio_path = save_audio_to_temp_file(audio_array, sample_rate)

        # Transcribe the preprocessed audio file
        transcript = whisper_service.transcribe_audio(processed_audio_path)

        return {"status": "success", "transcript": transcript}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": str(e)}
        )
    finally:
        # Cleanup temporary files
        delete_file(temp_path)
        if os.path.exists(processed_audio_path):
            delete_file(processed_audio_path)


@transcription_router.post("/wav2vec")
async def transcribe_with_wav2vec(file: UploadFile = File(...)):
    """
    Endpoint for transcribing audio using Wav2Vec2 with audio preprocessing.
    """
    temp_path = save_temp_file(file)  # Save the uploaded file temporarily
    processed_audio_path = None  # Initialize the variable outside the try block
    try:
        # Preprocess the audio file and get the audio array and sample rate
        audio_array, sample_rate = audio_preprocessor.preprocess(temp_path)

        # Save preprocessed audio to a temporary file
        processed_audio_path = save_audio_to_temp_file(audio_array, sample_rate)

        # Transcribe the preprocessed audio file
        transcript = wav2vec_service.transcribe_audio(processed_audio_path)

        return {"status": "success", "transcript": transcript}

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "error": str(e)}
        )
    finally:
        # Cleanup temporary files
        delete_file(temp_path)
        if processed_audio_path and os.path.exists(processed_audio_path):
            delete_file(processed_audio_path)

