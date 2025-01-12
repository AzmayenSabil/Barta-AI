from google.cloud import speech, storage
from google.oauth2 import service_account
import os
from dotenv import load_dotenv
import json

class GoogleTranscriptionService:
    def __init__(self):
        # Load environment variables before anything else
        if not load_dotenv():
            print("Warning: No .env file found or error loading .env file")
        
        self.credentials = self._load_credentials()
        self.speech_client = speech.SpeechClient(credentials=self.credentials)
        self.storage_client = storage.Client(credentials=self.credentials)

    def _load_credentials(self):
        """Load credentials from JSON file."""
        credentials_path = os.getenv('GOOGLE_CLOUD_CREDENTIALS')
        
        if not credentials_path:
            raise Exception("GOOGLE_CLOUD_CREDENTIALS environment variable not found")
            
        if not os.path.exists(credentials_path):
            raise Exception(f"Credentials file not found at: {credentials_path}")
            
        try:
            return service_account.Credentials.from_service_account_file(credentials_path)
        except Exception as e:
            raise Exception(f"Failed to load credentials from file: {str(e)}")

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