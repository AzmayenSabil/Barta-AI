import torchaudio
from torchaudio.transforms import Resample
from pydub import AudioSegment  # For MP3 to WAV conversion
import numpy as np
import tempfile

class AudioPreprocessor:
    def __init__(self):
        self.target_sample_rate = 16000  # Standard target sampling rate (16kHz)

    def preprocess(self, file_path):
        # Check if the file is MP3 and convert it to WAV if necessary
        if file_path.endswith('.mp3'):
            file_path = self.convert_mp3_to_wav(file_path)

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

    def convert_mp3_to_wav(self, mp3_path):
        """
        Convert MP3 file to WAV format using pydub
        """
        audio = AudioSegment.from_mp3(mp3_path)
        temp_wav_path = tempfile.mktemp(suffix=".wav")
        audio.export(temp_wav_path, format="wav")
        return temp_wav_path
