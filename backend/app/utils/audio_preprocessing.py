import torchaudio
import torch
import numpy as np
import tempfile
from torchaudio.transforms import Resample
from pydub import AudioSegment
from scipy import signal

class AudioPreprocessor:
    def __init__(self):
        self.target_sample_rate = 16000
        self.segment_duration = 30

    def preprocess(self, file_path):
        # Convert MP3 to WAV if needed
        if file_path.endswith('.mp3'):
            file_path = self.convert_mp3_to_wav(file_path)

        # Load and ensure the waveform is contiguous
        waveform, sample_rate = torchaudio.load(file_path)
        waveform = waveform.contiguous()

        # Resample if needed
        if sample_rate != self.target_sample_rate:
            resampler = Resample(orig_freq=sample_rate, new_freq=self.target_sample_rate)
            waveform = resampler(waveform).contiguous()

        # Convert stereo to mono if needed
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True).contiguous()

        # Process the entire waveform without segmentation first
        waveform_np = waveform.squeeze().numpy()
        waveform_np = np.ascontiguousarray(waveform_np)

        # Apply noise reduction
        filtered_waveform = self.apply_noise_reduction_full(waveform_np)
        
        # Apply spectral subtraction
        enhanced_waveform = self.spectral_subtraction_full(filtered_waveform)

        # Ensure the final array is contiguous
        final_array = np.ascontiguousarray(enhanced_waveform)
        
        return final_array, self.target_sample_rate

    def convert_mp3_to_wav(self, mp3_path):
        audio = AudioSegment.from_mp3(mp3_path)
        temp_wav_path = tempfile.mktemp(suffix=".wav")
        audio.export(temp_wav_path, format="wav")
        return temp_wav_path

    def apply_noise_reduction_full(self, waveform):
        """
        Apply noise reduction to the full waveform
        """
        low_cutoff = 300
        high_cutoff = 3400
        nyquist_rate = 0.5 * self.target_sample_rate
        low = low_cutoff / nyquist_rate
        high = high_cutoff / nyquist_rate

        # Ensure input is contiguous
        waveform = np.ascontiguousarray(waveform)
        
        # Apply band-pass filter
        b, a = signal.butter(4, [low, high], btype='band')
        filtered_waveform = signal.filtfilt(b, a, waveform)
        
        return np.ascontiguousarray(filtered_waveform)

    def spectral_subtraction_full(self, waveform):
        """
        Apply spectral subtraction to the full waveform
        """
        # Ensure input is contiguous
        waveform = np.ascontiguousarray(waveform)
        
        # Convert to frequency domain
        f, t, Zxx = signal.stft(waveform, self.target_sample_rate, nperseg=1024)

        # Estimate noise PSD
        noise_psd = np.median(np.abs(Zxx), axis=1)
        Zxx_denoised = Zxx - noise_psd[:, None]

        # Convert back to time domain
        _, x_reconstructed = signal.istft(Zxx_denoised, self.target_sample_rate)
        
        return np.ascontiguousarray(x_reconstructed)