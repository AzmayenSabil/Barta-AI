import librosa
import torch
import numpy as np
from transformers import (
    WhisperProcessor,
    WhisperFeatureExtractor,
    WhisperForConditionalGeneration,
)


class WhisperTranscriptionService:
    def __init__(self):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model_path = "shhossain/whisper-base-bn"
        self._load_model()

    def _load_model(self):
        print("Loading ASR model...")
        self.feature_extractor = WhisperFeatureExtractor.from_pretrained(self.model_path)
        self.processor = WhisperProcessor.from_pretrained(self.model_path)
        self.model = WhisperForConditionalGeneration.from_pretrained(self.model_path).to(self.device)
        print("Model loaded successfully")

    def transcribe_audio(self, audio_path: str) -> str:
        try:
            # print(f"Loading audio file: {audio_path}")
            speech_array, sampling_rate = librosa.load(audio_path, sr=16000)

            # print(f"Audio loaded. Shape: {speech_array.shape}, Sampling rate: {sampling_rate}")
            speech_array = speech_array.astype(np.float32)

            input_features = self.feature_extractor(
                speech_array,
                sampling_rate=16000,
                return_tensors="pt"
            ).input_features

            # print("Generating transcript...")
            predicted_ids = self.model.generate(
                inputs=input_features.to(self.device)
            )[0]

            transcript = self.processor.decode(predicted_ids, skip_special_tokens=True)
            # print(f"Transcript generated: {transcript[:100]}...")
            return transcript

        except Exception as e:
            print(f"Error in transcription: {str(e)}")
            raise Exception(f"Transcription failed: {str(e)}")
