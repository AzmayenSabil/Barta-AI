import React from 'react';
import { Mic, MicOff, Video, VideoOff, Share2, PhoneOff } from 'lucide-react';
import { useRoomStore } from '../store/useRoomStore';
import { toggleMediaTrack } from '../utils/mediaUtils';

interface RoomControlsProps {
  onLeaveRoom: () => void;
}

export const RoomControls: React.FC<RoomControlsProps> = ({ onLeaveRoom }) => {
  const { localParticipant, updateParticipant } = useRoomStore();

  const toggleAudio = () => {
    if (!localParticipant?.stream) return;
    const isEnabled = toggleMediaTrack(localParticipant.stream, 'audio');
    updateParticipant(localParticipant.id, { ...localParticipant, audioEnabled: isEnabled });
  };

  const toggleVideo = () => {
    if (!localParticipant?.stream) return;
    const isEnabled = toggleMediaTrack(localParticipant.stream, 'video');
    updateParticipant(localParticipant.id, { ...localParticipant, videoEnabled: isEnabled });
  };

  const shareLink = () => {
    const roomId = new URLSearchParams(window.location.search).get('roomId');
    if (roomId) {
      const shareUrl = `${window.location.origin}?roomId=${roomId}`;
      navigator.clipboard.writeText(shareUrl);
      alert('Room link copied to clipboard!');
    }
  };

  if (!localParticipant) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-6 py-3 flex items-center gap-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full transition-colors ${
            localParticipant.audioEnabled 
              ? 'bg-slate-100 hover:bg-slate-200' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
          title={localParticipant.audioEnabled ? 'Mute' : 'Unmute'}
        >
          {localParticipant.audioEnabled ? (
            <Mic className="w-6 h-6" />
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </button>
        
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-colors ${
            localParticipant.videoEnabled 
              ? 'bg-slate-100 hover:bg-slate-200' 
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
          title={localParticipant.videoEnabled ? 'Turn off camera' : 'Turn on camera'}
        >
          {localParticipant.videoEnabled ? (
            <Video className="w-6 h-6" />
          ) : (
            <VideoOff className="w-6 h-6" />
          )}
        </button>

        <button
          onClick={shareLink}
          className="p-3 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
          title="Share room link"
        >
          <Share2 className="w-6 h-6" />
        </button>

        <button
          onClick={onLeaveRoom}
          className="p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
          title="Leave room"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};