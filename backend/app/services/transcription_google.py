from google.cloud import speech, storage
from google.oauth2 import service_account
import os
from dotenv import load_dotenv
import json
from typing import List, Dict

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

    def transcribe_audio_with_diarization(
        self,
        audio_path: str,
        bucket_name: str = "barta-ai-bucket",
        language_code: str = "bn-BD",
        min_speakers: int = 2,
        max_speakers: int = 2
    ) -> List[Dict]:
        """
        Transcribe audio with speaker diarization using Google Speech-to-Text API.
        """
        try:
            gcs_uri = self.upload_to_gcs(audio_path, bucket_name)
            
            # Configure speaker diarization
            diarization_config = speech.SpeakerDiarizationConfig(
                enable_speaker_diarization=True,
                min_speaker_count=min_speakers,
                max_speaker_count=max_speakers
            )
            
            # Configure recognition with diarization
            config = speech.RecognitionConfig(
                encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
                sample_rate_hertz=16000,
                language_code=language_code,
                diarization_config=diarization_config,
                enable_automatic_punctuation=True,
                enable_word_time_offsets=True,  # Enable word timing for better diarization
                use_enhanced=True  # Use enhanced model for better accuracy
            )

            audio = speech.RecognitionAudio(uri=gcs_uri)
            
            print("Starting transcription with speaker diarization...")
            operation = self.speech_client.long_running_recognize(config=config, audio=audio)
            response = operation.result(timeout=600)

            # Process the diarized transcript
            diarized_transcript = []
            
            # Process all results to get complete diarization
            for result in response.results:
                if not result.alternatives:
                    continue
                
                words_info = result.alternatives[0].words
                current_speaker = None
                current_utterance = []
                current_start_time = None
                current_end_time = None

                for word_info in words_info:
                    if current_speaker is None:
                        current_speaker = word_info.speaker_tag
                        current_start_time = word_info.start_time.total_seconds()
                    
                    # If speaker changes, save current utterance and start new one
                    if word_info.speaker_tag != current_speaker:
                        if current_utterance:
                            diarized_transcript.append({
                                'speaker': f'Speaker {current_speaker}',
                                'text': ' '.join(current_utterance),
                                'start_time': current_start_time,
                                'end_time': current_end_time
                            })
                        current_speaker = word_info.speaker_tag
                        current_utterance = []
                        current_start_time = word_info.start_time.total_seconds()
                    
                    current_utterance.append(word_info.word)
                    current_end_time = word_info.end_time.total_seconds()

                # Add the last utterance from this result
                if current_utterance:
                    diarized_transcript.append({
                        'speaker': f'Speaker {current_speaker}',
                        'text': ' '.join(current_utterance),
                        'start_time': current_start_time,
                        'end_time': current_end_time
                    })

            return diarized_transcript

        except Exception as e:
            print(f"Detailed error in diarization: {str(e)}")  # Add detailed error logging
            raise Exception(f"Google transcription with diarization failed: {str(e)}")
            
    # Keep the original method for backward compatibility
    def transcribe_audio(self, audio_path: str, bucket_name: str = "barta-ai-bucket", language_code: str = "bn-BD") -> str:
        """
        Original transcribe method without diarization for backward compatibility.
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