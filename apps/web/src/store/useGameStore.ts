import { create } from 'zustand';

// Note: To avoid deep coupling between frontend/backend folders for domain logic,
// we alias RoomState to any for now. Later we will import robust DTO definitions.
interface GameState {
  roomCode: string | null;
  roomState: any | null; // Refers to the RoomState snapshot emitted by GameServer
  
  setRoomCode: (code: string | null) => void;
  updateRoomState: (state: any) => void;
  addChatMessage: (msg: any) => void;
  addClue: (clue: any) => void;
  clearGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  roomCode: null,
  roomState: null,
  setRoomCode: (code) => set({ roomCode: code }),
  updateRoomState: (state) => set({ roomState: state }),
  addChatMessage: (msg) => set((state) => ({
    roomState: state.roomState ? {
      ...state.roomState,
      chatMessages: [...(state.roomState.chatMessages || []), msg].slice(-50)
    } : null
  })),
  addClue: (clue) => set((state) => ({
    roomState: state.roomState ? {
      ...state.roomState,
      clues: [...(state.roomState.clues || []), clue]
    } : null
  })),
  clearGame: () => set({ roomCode: null, roomState: null })
}));
