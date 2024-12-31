import { create } from 'zustand';
import { Room, Participant } from '../types/room';

interface RoomStore {
  currentRoom: Room | null;
  localParticipant: Participant | null;
  setCurrentRoom: (room: Room) => void;
  setLocalParticipant: (participant: Participant) => void;
  updateParticipant: (participantId: string, updates: Partial<Participant>) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  currentRoom: null,
  localParticipant: null,
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setLocalParticipant: (participant) => set({ localParticipant: participant }),
  updateParticipant: (participantId, updates) =>
    set((state) => {
      if (!state.currentRoom) return state;
      
      const updatedParticipants = state.currentRoom.participants.map((p) =>
        p.id === participantId ? { ...p, ...updates } : p
      );

      return {
        ...state,
        currentRoom: {
          ...state.currentRoom,
          participants: updatedParticipants,
        },
      };
    }),
}));