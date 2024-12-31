import React from 'react';
import { VideoPlayer } from './VideoPlayer';
import { RoomControls } from './RoomControls';
import { useRoomStore } from '../store/useRoomStore';
import { useWebRTC } from '../hooks/useWebRTC';

export const Room: React.FC = () => {
  const { currentRoom, localParticipant } = useRoomStore();
  const peers = useWebRTC(currentRoom?.id || '');

  const handleLeaveRoom = () => {
    peers.forEach(peer => peer.destroy());
    window.location.href = '/';
  };

  if (!currentRoom || !localParticipant) return null;

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <VideoPlayer
            stream={localParticipant.stream}
            name={`${localParticipant.name} (You)`}
            audioEnabled={localParticipant.audioEnabled}
            videoEnabled={localParticipant.videoEnabled}
            isLocal
          />
          {currentRoom.participants
            .filter((p) => p.id !== localParticipant.id)
            .map((participant) => (
              <VideoPlayer
                key={participant.id}
                stream={participant.stream}
                name={participant.name}
                audioEnabled={participant.audioEnabled}
                videoEnabled={participant.videoEnabled}
              />
            ))}
        </div>
      </div>
      <RoomControls onLeaveRoom={handleLeaveRoom} />
    </div>
  );
};