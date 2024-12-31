import { v4 as uuidv4 } from 'uuid';
import { Room, Participant } from '../types/room';
import { useRoomStore } from '../store/useRoomStore';

// Using a free public signaling server for demo purposes
// In production, you should use your own secure signaling server
const SIGNALING_SERVER = 'wss://free.blitzr.xyz';
let ws: WebSocket | null = null;

interface SignalingMessage {
  type: 'join' | 'offer' | 'answer' | 'ice-candidate' | 'participant-joined' | 'participant-left';
  roomId: string;
  senderId: string;
  targetId?: string;
  data?: any;
}

export const createRoom = (localParticipant: Participant): Room => {
  const room: Room = {
    id: uuidv4(),
    participants: [localParticipant]
  };
  
  connectToSignalingServer(room.id, localParticipant);
  return room;
};

export const joinRoom = (roomId: string, localParticipant: Participant): void => {
  connectToSignalingServer(roomId, localParticipant);
};

const connectToSignalingServer = (roomId: string, participant: Participant) => {
  ws = new WebSocket(`${SIGNALING_SERVER}?roomId=${roomId}&participantId=${participant.id}`);
  
  ws.onopen = () => {
    // Announce this participant to the room
    sendSignalingMessage({
      type: 'join',
      roomId,
      senderId: participant.id,
      data: {
        name: participant.name
      }
    });
  };
  
  ws.onmessage = (event) => {
    const message: SignalingMessage = JSON.parse(event.data);
    handleSignalingMessage(message);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
  };
};

export const sendSignalingMessage = (message: SignalingMessage) => {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  }
};

const handleSignalingMessage = (message: SignalingMessage) => {
  const store = useRoomStore.getState();
  const { currentRoom, localParticipant } = store;

  if (!currentRoom || !localParticipant) return;

  switch (message.type) {
    case 'participant-joined':
      if (message.senderId !== localParticipant.id) {
        const newParticipant: Participant = {
          id: message.senderId,
          name: message.data.name,
          videoEnabled: true,
          audioEnabled: true
        };
        
        store.setCurrentRoom({
          ...currentRoom,
          participants: [...currentRoom.participants, newParticipant]
        });
      }
      break;

    case 'participant-left':
      if (message.senderId !== localParticipant.id) {
        store.setCurrentRoom({
          ...currentRoom,
          participants: currentRoom.participants.filter(p => p.id !== message.senderId)
        });
      }
      break;
  }
};