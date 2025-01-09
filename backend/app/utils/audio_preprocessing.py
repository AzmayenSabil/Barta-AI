import torchaudio
from torchaudio.transforms import Resample
import librosa
import numpy as np

class AudioPreprocessor:
    def __init__(self):
        self.target_sample_rate = 16000  # Standard target sampling rate (16kHz)

    def preprocess(self, file_path):
        # Load the audio file
        waveform, sample_rate = torchaudio.load(file_path)

        # Resample if the sampling rate is different from the target
        if sample_rate != self.target_sample_rate:
            resampler = Resample(orig_freq=sample_rate, new_freq=self.target_sample_rate)
            waveform = resampler(waveform)

        # Convert stereo to mono if needed
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)

        # Convert to numpy array
        audio_array = waveform.squeeze().numpy()

        return audio_array, self.target_sample_rate
