from google.cloud import speech, storage
from google.oauth2 import service_account
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

class GoogleTranscriptionService:
    def __init__(self):
        self.credentials = self._load_credentials()
        self.speech_client = speech.SpeechClient(credentials=self.credentials)
        self.storage_client = storage.Client(credentials=self.credentials)

    def _load_credentials(self):
        """Load credentials from environment variable or file."""
        try:
            # First try loading from environment variable
            credentials_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
            if credentials_path and os.path.exists(credentials_path):
                return service_account.Credentials.from_service_account_file(credentials_path)
            
            # If that fails, try loading from .env JSON
            credentials_json = os.getenv('GOOGLE_CLOUD_CREDENTIALS')
            if credentials_json:
                try:
                    credentials_info = json.loads(credentials_json)
                    return service_account.Credentials.from_service_account_info(credentials_info)
                except json.JSONDecodeError:
                    print("Error: GOOGLE_CLOUD_CREDENTIALS is not valid JSON")
            
            # If neither worked, look for default locations
            default_paths = [
                'secrets.json',
                'secrets/secrets.json',
                'backend/secrets/secrets.json',
                os.path.join(os.path.dirname(__file__), 'secrets.json'),
            ]
            
            for path in default_paths:
                if os.path.exists(path):
                    return service_account.Credentials.from_service_account_file(path)
            
            raise FileNotFoundError("No valid credentials found")
            
        except Exception as e:
            raise Exception(f"Failed to load credentials: {str(e)}")

    def upload_to_gcs(self, audio_path: str, bucket_name: str) -> str:
        """
        Uploads the audio file to Google Cloud Storage and returns its URI.
        """
        try:
            bucket = self.storage_client.bucket(bucket_name)
            blob_name = audio_path.split("/")[-1]
            blob = bucket.blob(blob_name)
            blob.upload_from_filename(audio_path)
            gcs_uri = f"gs://{bucket_name}/{blob_name}"
            print(f"File uploaded to GCS: {gcs_uri}")
            return gcs_uri
        except Exception as e:
            raise Exception(f"Failed to upload to GCS: {str(e)}")

    def transcribe_audio(self, audio_path: str, bucket_name: str = "barta-ai-bucket", language_code: str = "bn-BD") -> str:
        """
        Transcribe audio using Google Speech-to-Text API with a GCS URI.
        """
        try:
            gcs_uri = self.upload_to_gcs(audio_path, bucket_name)
            
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code=language_code,
            )

            audio = speech.RecognitionAudio(uri=gcs_uri)
            operation = self.speech_client.long_running_recognize(config=config, audio=audio)
            
            print("Waiting for transcription to complete...")
            response = operation.result(timeout=600)

            transcript = ""
            for result in response.results:
                transcript += result.alternatives[0].transcript + " "

            return transcript.strip()

        except Exception as e:
            raise Exception(f"Google transcription failed: {str(e)}")