import { useEffect, useRef, useCallback } from 'react';
import SimplePeer from 'simple-peer';
import { useRoomStore } from '../store/useRoomStore';
import { sendSignalingMessage } from '../services/roomService';

export const useWebRTC = (roomId: string) => {
  const peers = useRef<Map<string, SimplePeer.Instance>>(new Map());
  const { localParticipant, currentRoom, setCurrentRoom } = useRoomStore();

  const createPeer = useCallback((targetId: string, initiator: boolean) => {
    if (!localParticipant?.stream) return null;

    const peer = new SimplePeer({
      initiator,
      stream: localParticipant.stream,
      trickle: false
    });

    peer.on('signal', (signal) => {
      sendSignalingMessage({
        type: initiator ? 'offer' : 'answer',
        roomId,
        senderId: localParticipant.id,
        targetId,
        data: signal
      });
    });

    peer.on('stream', (stream) => {
      if (currentRoom) {
        const participantIndex = currentRoom.participants.findIndex(p => p.id === targetId);
        if (participantIndex !== -1) {
          const updatedParticipants = [...currentRoom.participants];
          updatedParticipants[participantIndex] = {
            ...updatedParticipants[participantIndex],
            stream
          };
          
          setCurrentRoom({
            ...currentRoom,
            participants: updatedParticipants
          });
        }
      }
    });

    peer.on('error', (err) => {
      console.error('Peer error:', err);
      peer.destroy();
      peers.current.delete(targetId);
    });

    peers.current.set(targetId, peer);
    return peer;
  }, [localParticipant, currentRoom, roomId, setCurrentRoom]);

  useEffect(() => {
    if (!localParticipant?.stream || !roomId) return;

    const handleNewParticipant = (participantId: string) => {
      if (!peers.current.has(participantId)) {
        createPeer(participantId, true);
      }
    };

    const handleOffer = (senderId: string, signal: SimplePeer.SignalData) => {
      let peer = peers.current.get(senderId);
      
      if (!peer) {
        peer = createPeer(senderId, false);
      }
      
      if (peer) {
        peer.signal(signal);
      }
    };

    const handleAnswer = (senderId: string, signal: SimplePeer.SignalData) => {
      const peer = peers.current.get(senderId);
      if (peer) {
        peer.signal(signal);
      }
    };

    // Clean up function
    return () => {
      peers.current.forEach(peer => peer.destroy());
      peers.current.clear();
    };
  }, [roomId, localParticipant, createPeer]);

  return Array.from(peers.current.values());
};