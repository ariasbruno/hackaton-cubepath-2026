import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type LocalPhase = 
  | 'LOBBY' 
  | 'PASS_PHONE' 
  | 'ASSIGNING' 
  | 'PLAYING' 
  | 'VOTING' 
  | 'REVEAL'
  | 'RESULTS';

export interface LocalPlayer {
  id: string;
  name: string;
  avatarId: string;
  avatarColor: string;
  role?: 'AGENT' | 'IMPOSTOR' | 'INFILTRATED';
  word?: string;
  isAlive: boolean;
  votesReceived: number;
}

export interface SingleLocalGame {
  code: string;
  settings: {
    mode: 'TRADICIONAL' | 'CERCANAS';
    categories: string[];
    timers: {
      clues: number;
      discuss: number;
      vote: number;
    };
  };
  phase: LocalPhase;
  players: LocalPlayer[];
  currentPlayerIndex: number;
  secretWord: string;
  infiltratedWord?: string;
  winner: 'AGENTS' | 'IMPOSTOR' | 'INFILTRATED' | null;
  votedPlayerId?: string;
  name: string; // Added name field
  createdAt: number;
  lastPlayedAt: number;
}

interface LocalGameState {
  games: Record<string, SingleLocalGame>;
  
  // Actions
  createGame: (code: string, settings: SingleLocalGame['settings'], name: string) => void;
  updateGame: (code: string, updates: Partial<Omit<SingleLocalGame, 'code' | 'createdAt'>>) => void;
  deleteGame: (code: string) => void;
  resetGame: (code: string) => void;
}

const initialSettings: SingleLocalGame['settings'] = {
  mode: 'TRADICIONAL',
  categories: [],
  timers: { clues: 45, discuss: 120, vote: 30 }
};

export const useLocalGameStore = create<LocalGameState>()(
  persist(
    (set) => ({
      games: {},

      createGame: (code, settings, name) => set((state) => ({
        games: {
          ...state.games,
          [code]: {
            code,
            settings: settings || initialSettings,
            name: name || 'Partida Local',
            phase: 'LOBBY',
            players: [],
            currentPlayerIndex: 0,
            secretWord: '',
            winner: null,
            createdAt: Date.now(),
            lastPlayedAt: Date.now()
          }
        }
      })),

      updateGame: (code, updates) => set((state) => {
        const game = state.games[code];
        if (!game) return state;
        return {
          games: {
            ...state.games,
            [code]: {
              ...game,
              ...updates,
              lastPlayedAt: Date.now()
            }
          }
        };
      }),

      deleteGame: (code) => set((state) => {
        const newGames = { ...state.games };
        delete newGames[code];
        return { games: newGames };
      }),

      resetGame: (code) => set((state) => {
        const game = state.games[code];
        if (!game) return state;
        return {
          games: {
            ...state.games,
            [code]: {
              ...game,
              phase: 'LOBBY',
              currentPlayerIndex: 0,
              secretWord: '',
              infiltratedWord: undefined,
              winner: null,
              votedPlayerId: undefined,
              players: game.players.map(p => ({
                ...p,
                role: undefined,
                word: undefined,
                isAlive: true,
                votesReceived: 0
              })),
              lastPlayedAt: Date.now()
            }
          }
        };
      })
    }),
    {
      name: 'el-impostor-local-games-collection',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
