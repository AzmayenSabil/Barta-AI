import React, { useRef, useState, useEffect } from 'react';
import { PlayIcon, PauseIcon } from 'lucide-react';

interface AudioWaveformPlayerProps {
  audioSrc: string;
}

const AudioPlayer: React.FC<AudioWaveformPlayerProps> = ({ audioSrc }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [waveformData, setWaveformData] = useState<number[]>([]);

  useEffect(() => {
    const generateWaveform = async () => {
      // Simulate waveform generation
      const mockWaveform = Array.from({length: 50}, () => Math.random() * 0.8 + 0.2);
      setWaveformData(mockWaveform);
    };

    generateWaveform();
  }, [audioSrc]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = e.nativeEvent.offsetX;
      const progressWidth = progressBar.clientWidth;
      const seekTime = (clickPosition / progressWidth) * audioRef.current.duration;
      
      audioRef.current.currentTime = seekTime;
      setProgress((seekTime / audioRef.current.duration) * 100);
    }
  };

  return (
<div className="bg-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center space-x-4">
        <button 
          onClick={togglePlay} 
          className="text-white bg-blue-600 hover:bg-blue-700 rounded-full p-2"
        >
          {isPlaying ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
        </button>
        
        <div 
          className="flex-1 h-12 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-blue-600 transition-all duration-200" 
            style={{ width: `${progress}%` }}
          >
            <div className="flex h-full items-center">
              {waveformData.map((height, index) => (
                <div 
                  key={index} 
                  className="w-1 mx-0.5 bg-white opacity-50 rounded-full" 
                  style={{ 
                    height: `${height * 100}%`,
                    transform: `scaleY(${progress / 100 > index / waveformData.length ? 1 : 0.5})` 
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

export default AudioPlayer;