# import librosa
# import torch
# import numpy as np
# from transformers import (
#     WhisperProcessor,
#     WhisperFeatureExtractor,
#     WhisperForConditionalGeneration,
# )


# class WhisperTranscriptionService:
#     def __init__(self):
#         self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
#         self.model_path = "shhossain/whisper-base-bn"
#         self.max_length = 30 * 16000  # 30 seconds of audio at 16kHz
#         self.overlap = 1 * 16000      # 1 second overlap between segments
#         self._load_model()

#     def _load_model(self):
#         print("Loading ASR model...")
#         self.feature_extractor = WhisperFeatureExtractor.from_pretrained(self.model_path)
#         self.processor = WhisperProcessor.from_pretrained(self.model_path)
#         self.model = WhisperForConditionalGeneration.from_pretrained(self.model_path).to(self.device)
#         print("Model loaded successfully")

#     def _segment_audio(self, audio_array):
#         """
#         Split audio into overlapping segments
#         """
#         segments = []
#         start = 0
#         while start < len(audio_array):
#             end = min(start + self.max_length, len(audio_array))
#             segment = audio_array[start:end]
#             segments.append(segment)
            
#             # Move to next segment with overlap
#             start = end - self.overlap

#             # Ensure that we don't exceed the audio length
#             if start >= len(audio_array):
#                 break

#         return segments

#     def _process_segment(self, segment):
#         """
#         Process a single audio segment
#         """
#         # Ensure segment is float32
#         segment = segment.astype(np.float32)

#         # Extract features
#         input_features = self.feature_extractor(
#             segment,
#             sampling_rate=16000,
#             return_tensors="pt"
#         ).input_features

#         # Generate transcription
#         with torch.no_grad():
#             predicted_ids = self.model.generate(
#                 inputs=input_features.to(self.device)
#             )[0]

#         # Decode transcription
#         transcript = self.processor.decode(predicted_ids, skip_special_tokens=True)
        
#         # Clear memory after processing the segment
#         del segment, input_features
#         torch.cuda.empty_cache()  # Clear GPU cache to manage memory
#         return transcript.strip()

#     def transcribe_audio(self, audio_path: str) -> str:
#         try:
#             print(f"Processing audio file: {audio_path}")
            
#             # Load audio file
#             speech_array, sampling_rate = librosa.load(audio_path, sr=16000)
#             print(f"Audio loaded. Duration: {len(speech_array)/16000:.2f} seconds")

#             # Handle short audio files directly
#             if len(speech_array) <= self.max_length:
#                 return self._process_segment(speech_array)

#             # Split longer audio into segments
#             segments = self._segment_audio(speech_array)
#             print(f"Split audio into {len(segments)} segments")

#             # Process each segment
#             transcripts = []
#             for i, segment in enumerate(segments, 1):
#                 print(f"Processing segment {i}/{len(segments)}")
#                 transcript = self._process_segment(segment)
#                 if transcript:  # Only add non-empty transcripts
#                     transcripts.append(transcript)

#             # Combine all transcripts
#             final_transcript = ' '.join(transcripts)
#             print(f"Transcription completed. Length: {len(final_transcript)} characters")
            
#             return final_transcript

#         except Exception as e:
#             print(f"Error in transcription: {str(e)}")
#             raise Exception(f"Transcription failed: {str(e)}")

#     def __del__(self):
#         # Clean up CUDA memory if using GPU
#         if hasattr(self, 'model'):
#             try:
#                 del self.model
#                 if torch.cuda.is_available():
#                     torch.cuda.empty_cache()
#             except Exception as e:
#                 print(f"Error cleaning up model: {str(e)}")


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
