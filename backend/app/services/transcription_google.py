from google.cloud import speech
import os
from dotenv import load_dotenv
from google.oauth2 import service_account
from pydub import AudioSegment, silence
from typing import List, Dict
import tempfile
import json

class GoogleTranscriptionService:
    def __init__(self):
        # Load environment variables
        if not load_dotenv():
            print("Warning: No .env file found or error loading .env file")

        self.credentials = self._load_credentials()
        self.speech_client = speech.SpeechClient(credentials=self.credentials)

    def _load_credentials(self):
        """Load credentials from JSON file."""
        credentials_path = os.getenv("GOOGLE_CLOUD_CREDENTIALS")

        if not credentials_path:
            raise Exception("GOOGLE_CLOUD_CREDENTIALS environment variable not found")

        if not os.path.exists(credentials_path):
            raise Exception(f"Credentials file not found at: {credentials_path}")

        try:
            return service_account.Credentials.from_service_account_file(credentials_path)
        except Exception as e:
            raise Exception(f"Failed to load credentials from file: {str(e)}")

    def chunk_audio(self, audio_path: str) -> List[Dict]:
        """
        Split the audio file into chunks based on silence detection.
        """
        audio = AudioSegment.from_file(audio_path)
        audio = audio.set_frame_rate(16000).set_channels(1)

        # Split audio based on silence
        chunks = silence.split_on_silence(
            audio,
            min_silence_len=300,
            silence_thresh=-35,
            keep_silence=150,
            seek_step=10
        )

        chunk_info = []
        total_duration = 0

        for i, chunk in enumerate(chunks):
            temp_chunk_path = tempfile.NamedTemporaryFile(delete=False, suffix=f"_chunk_{i}.wav").name
            chunk.export(temp_chunk_path, format="wav")

            duration = len(chunk) / 1000  # Duration in seconds
            chunk_info.append({
                "file": temp_chunk_path,
                "start": total_duration,
                "end": total_duration + duration
            })

            total_duration += duration

        return chunk_info

    def transcribe_chunk(self, chunk_path: str, chunk_start: float, language_code: str = "bn-IN") -> List[Dict]:
        """
        Transcribe a single audio chunk using Google Speech-to-Text API.
        """
        with open(chunk_path, "rb") as audio_file:
            content = audio_file.read()

        audio = speech.RecognitionAudio(content=content)

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code=language_code,
            enable_automatic_punctuation=True,
            enable_word_time_offsets=True,
            use_enhanced=True,
            model="default"
        )

        operation = self.speech_client.long_running_recognize(config=config, audio=audio)
        response = operation.result(timeout=300)

        results = []
        for result in response.results:
            for word_info in result.alternatives[0].words:
                start = word_info.start_time.total_seconds() + chunk_start
                end = word_info.end_time.total_seconds() + chunk_start
                results.append({
                    "start": start,
                    "end": end,
                    "text": word_info.word
                })

        return results

    def build_phrases(self, words: List[Dict], pause_threshold: float = 0.4) -> List[Dict]:
        """
        Combine words into phrases based on pauses.
        """
        transcript = []
        current_phrase = []
        current_start = 0

        for i, word in enumerate(words):
            if not current_phrase:
                current_start = word["start"]
                current_phrase.append(word["text"])
            else:
                prev_end = words[i - 1]["end"]
                pause_duration = word["start"] - prev_end

                if pause_duration > pause_threshold:
                    transcript.append({
                        "start": current_start,
                        "end": prev_end,
                        "text": " ".join(current_phrase)
                    })
                    current_phrase = [word["text"]]
                    current_start = word["start"]
                else:
                    current_phrase.append(word["text"])

        if current_phrase:
            transcript.append({
                "start": current_start,
                "end": words[-1]["end"],
                "text": " ".join(current_phrase)
            })

        return transcript

    def format_timestamp(self, seconds: float) -> str:
        """
        Format a timestamp in the format '00:00:17.020'.
        """
        hours = int(seconds // 3600)
        minutes = int((seconds % 3600) // 60)
        seconds = seconds % 60
        return f"{hours:02}:{minutes:02}:{seconds:06.3f}"

    def process_audio(self, audio_path: str, language_code: str = "bn-BD") -> List[Dict]:
        """
        Main method to process audio: chunk, transcribe, and generate formatted transcript.
        """
        # Step 1: Chunk the audio
        chunk_info = self.chunk_audio(audio_path)

        # Step 2: Transcribe each chunk
        all_words = []
        for chunk in chunk_info:
            words = self.transcribe_chunk(chunk["file"], chunk["start"], language_code)
            all_words.extend(words)

        # Step 3: Build phrases from words
        transcript = self.build_phrases(all_words)

        # Step 4: Format transcript with timestamps
        formatted_transcript = []
        for segment in transcript:
            formatted_transcript.append({
                "start": self.format_timestamp(segment["start"]),
                "end": self.format_timestamp(segment["end"]),
                "text": segment["text"]
            })

        return formatted_transcript

    def save_transcript(self, transcript: List[Dict], output_path: str):
        """
        Save the transcript to a text file.
        """
        with open(output_path, "w", encoding="utf-8") as f:
            for segment in transcript:
                f.write(f"[{segment['start']} - {segment['end']}] {segment['text']}\n")
