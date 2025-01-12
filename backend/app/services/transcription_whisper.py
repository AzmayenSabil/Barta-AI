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
        self.max_length = 25 * 16000  # 25 seconds of audio at 16kHz
        self.overlap = 5 * 16000      # 5 seconds overlap between segments
        self._load_model()

    def _load_model(self):
        print("Loading ASR model...")
        self.feature_extractor = WhisperFeatureExtractor.from_pretrained(self.model_path)
        self.processor = WhisperProcessor.from_pretrained(self.model_path)
        self.model = WhisperForConditionalGeneration.from_pretrained(self.model_path).to(self.device)
        print("Model loaded successfully")

    def _segment_audio(self, audio_array):
        """
        Split audio into overlapping segments with proper handling of boundaries
        """
        segments = []
        segment_info = []  # Store start and end times for each segment
        
        start = 0
        while start < len(audio_array):
            end = min(start + self.max_length, len(audio_array))
            
            # Extract segment with overlap
            segment = audio_array[start:end]
            segments.append(segment)
            
            # Store timing information
            segment_info.append({
                'start': start / 16000,  # Convert to seconds
                'end': end / 16000,
                'original_start': start,
                'original_end': end
            })
            
            if end == len(audio_array):
                break
            
            # Move to next segment with overlap
            start = end - self.overlap

        return segments, segment_info

    def _process_segment(self, segment, timing_info=None):
        """
        Process a single audio segment with timing information
        """
        # Ensure segment is float32
        segment = segment.astype(np.float32)

        # Extract features
        input_features = self.feature_extractor(
            segment,
            sampling_rate=16000,
            return_tensors="pt"
        ).input_features

        # Generate transcription
        with torch.no_grad():
            predicted_ids = self.model.generate(
                inputs=input_features.to(self.device)
            )[0]

        # Decode transcription
        transcript = self.processor.decode(predicted_ids, skip_special_tokens=True)
        
        return {
            'text': transcript.strip(),
            'timing': timing_info
        }

    def _merge_transcripts(self, transcript_segments):
        """
        Merge overlapping transcript segments intelligently
        """
        if not transcript_segments:
            return ""
            
        # If only one segment, return it directly
        if len(transcript_segments) == 1:
            return transcript_segments[0]['text']
        
        final_transcript = []
        for i in range(len(transcript_segments)):
            current_segment = transcript_segments[i]
            
            # Add first segment as is
            if i == 0:
                final_transcript.append(current_segment['text'])
                continue
                
            # For subsequent segments, handle overlap
            current_text = current_segment['text']
            previous_text = transcript_segments[i-1]['text']
            
            # Find potential overlap in text
            words_current = current_text.split()
            words_previous = previous_text.split()
            
            # Look for overlap in last few words
            overlap_found = False
            for j in range(min(len(words_previous), 5)):
                overlap_size = j + 1
                if ' '.join(words_previous[-overlap_size:]) in current_text:
                    # Found overlap, add only the non-overlapping part
                    overlap_found = True
                    overlap_index = current_text.index(' '.join(words_previous[-overlap_size:]))
                    final_transcript.append(current_text[overlap_index + len(' '.join(words_previous[-overlap_size:])):].strip())
                    break
            
            # If no overlap found, add a space and the full current segment
            if not overlap_found:
                final_transcript.append(current_text)
        
        return ' '.join(final_transcript)

    def transcribe_audio(self, audio_path: str) -> str:
        try:
            print(f"Processing audio file: {audio_path}")
            
            # Load audio file
            speech_array, sampling_rate = librosa.load(audio_path, sr=16000)
            print(f"Audio loaded. Duration: {len(speech_array)/16000:.2f} seconds")

            # Handle short audio files directly
            if len(speech_array) <= self.max_length:
                return self._process_segment(speech_array)['text']

            # Split longer audio into segments
            segments, segment_info = self._segment_audio(speech_array)
            print(f"Split audio into {len(segments)} segments with {self.overlap/16000}s overlap")

            # Process each segment
            transcripts = []
            for i, (segment, timing) in enumerate(zip(segments, segment_info), 1):
                print(f"Processing segment {i}/{len(segments)} ({timing['start']:.2f}s - {timing['end']:.2f}s)")
                transcript = self._process_segment(segment, timing)
                if transcript['text']:  # Only add non-empty transcripts
                    transcripts.append(transcript)

            # Merge transcripts with overlap handling
            final_transcript = self._merge_transcripts(transcripts)
            print(f"Transcription completed. Length: {len(final_transcript)} characters")
            
            return final_transcript

        except Exception as e:
            print(f"Error in transcription: {str(e)}")
            raise Exception(f"Transcription failed: {str(e)}")

    def __del__(self):
        # Clean up CUDA memory if using GPU
        if hasattr(self, 'model'):
            try:
                del self.model
                if torch.cuda.is_available():
                    torch.cuda.empty_cache()
            except Exception as e:
                print(f"Error cleaning up model: {str(e)}")