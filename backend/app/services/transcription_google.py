from google.cloud import speech, storage
from google.oauth2 import service_account

class GoogleTranscriptionService:
    def __init__(self):
        # Instantiates a client
        self.client_file = "creds.json"
        self.credentials = service_account.Credentials.from_service_account_file(self.client_file)
        self.speech_client = speech.SpeechClient(credentials=self.credentials)
        self.storage_client = storage.Client(credentials=self.credentials)

    def upload_to_gcs(self, audio_path: str, bucket_name: str) -> str:
        """
        Uploads the audio file to Google Cloud Storage and returns its URI.
        
        Args:
            audio_path: Path to the audio file.
            bucket_name: Name of the GCS bucket.
        
        Returns:
            str: URI of the uploaded file in GCS.
        """
        try:
            bucket = self.storage_client.bucket(bucket_name)
            blob_name = audio_path.split("/")[-1]  # Use the file name as the blob name
            blob = bucket.blob(blob_name)

            # Upload the file
            print(f"Uploading {audio_path} to GCS bucket {bucket_name}...")
            blob.upload_from_filename(audio_path)
            gcs_uri = f"gs://{bucket_name}/{blob_name}"
            print(f"File uploaded to GCS: {gcs_uri}")
            return gcs_uri
        except Exception as e:
            print(f"Error uploading file to GCS: {str(e)}")
            raise Exception(f"Failed to upload to GCS: {str(e)}")

    def transcribe_audio(self, audio_path: str, bucket_name: str = "barta-ai-bucket", language_code: str = "bn-BD") -> str:
        """
        Transcribe audio using Google Speech-to-Text API with a GCS URI.
        
        Args:
            audio_path: Path to the audio file.
            bucket_name: Name of the GCS bucket.
            language_code: BCP-47 language code (default: Bengali).
        
        Returns:
            str: Transcribed text.
        """
        try:
            # Upload the audio file to GCS and get the URI
            gcs_uri = self.upload_to_gcs(audio_path, bucket_name)

            # Configure the recognition settings
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code=language_code,
            )

            # Create the audio input object using the GCS URI
            audio = speech.RecognitionAudio(uri=gcs_uri)

            # Use LongRunningRecognize for longer audio
            operation = self.speech_client.long_running_recognize(config=config, audio=audio)

            print("Waiting for transcription to complete...")
            response = operation.result(timeout=600)  # Adjust timeout as needed

            # Combine all transcriptions
            transcript = ""
            for result in response.results:
                transcript += result.alternatives[0].transcript + " "

            print("Transcription completed successfully")
            return transcript.strip()

        except Exception as e:
            print(f"Error in Google transcription: {str(e)}")
            raise Exception(f"Google transcription failed: {str(e)}")
