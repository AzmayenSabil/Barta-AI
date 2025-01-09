import torch
import torchaudio
from transformers import Wav2Vec2ForCTC, Wav2Vec2Processor
from torchaudio.transforms import Resample

class Wav2Vec2TranscriptionService:
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.processor = Wav2Vec2Processor.from_pretrained("tanmoyio/wav2vec2-large-xlsr-bengali")
        self.model = Wav2Vec2ForCTC.from_pretrained("tanmoyio/wav2vec2-large-xlsr-bengali").to(self.device)
        self.resampler = Resample(orig_freq=48_000, new_freq=16_000)
        print("Wav2Vec2 Model Loaded Successfully")

    def transcribe_audio(self, audio_path: str) -> str:
        try:
            # Load and preprocess audio
            speech_array, sampling_rate = torchaudio.load(audio_path)

            # Resample if necessary
            if sampling_rate != 16000:
                speech_array = self.resampler(speech_array)

            # Prepare inputs for Wav2Vec2
            inputs = self.processor(speech_array.squeeze().numpy(), sampling_rate=16_000, return_tensors="pt", padding=True)

            # Perform inference
            with torch.no_grad():
                logits = self.model(inputs.input_values.to(self.device)).logits

            # Decode transcription
            predicted_ids = torch.argmax(logits, dim=-1)
            transcription = self.processor.decode(predicted_ids[0])
            return transcription

        except Exception as e:
            print(f"Error during Wav2Vec2 transcription: {str(e)}")
            raise Exception(f"Transcription failed: {str(e)}")
