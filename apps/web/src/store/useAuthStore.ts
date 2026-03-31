import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AVATAR_IDS } from '@impostor/shared';
import { authService } from '../services/api';

const DEFAULT_AVATARS = AVATAR_IDS;
const DEFAULT_COLORS = ['#FFD166', '#06D6A0', '#EF476F', '#118AB2', '#073B4C', '#8338EC', '#3A86FF', '#FB5607'];
const DEFAULT_NAMES = ['Player', 'Guest', 'Anon', 'Gamer', 'Noob', 'Pro', 'Ghost'];

interface AuthState {
  playerId: string | null;
  nickname: string | null;
  avatar: string | null;
  color: string | null;
  totalScore: number;
  impostorGames: number;
  agenteGames: number;
  infiltradoGames: number;
  dispersoGames: number;
  vinculadoGames: number;
  totalVotes: number;
  correctVotes: number;
  globalRank: number | null;
  voteEfficacy: number;
  isRegistered: boolean;
  setProfile: (id: string, nickname: string, avatar: string, color: string, stats?: Partial<AuthState>) => void;
  setRegistered: (status: boolean) => void;
  initGuest: () => void;
  register: (nickname: string, avatar: string, color: string) => Promise<void>;
  verifySession: (id: string) => Promise<void>;
  addStats: (points: number, role: string, votedCorrectly?: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      playerId: null,
      nickname: null,
      avatar: null,
      color: null,
      totalScore: 0,
      impostorGames: 0,
      agenteGames: 0,
      infiltradoGames: 0,
      dispersoGames: 0,
      vinculadoGames: 0,
      totalVotes: 0,
      correctVotes: 0,
      globalRank: null,
      voteEfficacy: 0,
      isRegistered: false,
      setProfile: (playerId, nickname, avatar, color, stats) =>
        set((state) => ({
          playerId,
          nickname,
          avatar,
          color,
          totalScore: stats?.totalScore ?? state.totalScore,
          impostorGames: stats?.impostorGames ?? state.impostorGames,
          agenteGames: stats?.agenteGames ?? state.agenteGames,
          infiltradoGames: stats?.infiltradoGames ?? state.infiltradoGames,
          dispersoGames: stats?.dispersoGames ?? state.dispersoGames,
          vinculadoGames: stats?.vinculadoGames ?? state.vinculadoGames,
          totalVotes: stats?.totalVotes ?? state.totalVotes,
          correctVotes: stats?.correctVotes ?? state.correctVotes,
          globalRank: stats?.globalRank ?? state.globalRank,
          voteEfficacy: stats?.voteEfficacy ?? state.voteEfficacy,
          isRegistered: stats?.isRegistered ?? state.isRegistered
        })),
      setRegistered: (isRegistered) => set({ isRegistered }),
      initGuest: () => {
        const avatar = DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
        const color = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];
        const noun = DEFAULT_NAMES[Math.floor(Math.random() * DEFAULT_NAMES.length)];
        const number = Math.floor(Math.random() * 9999) + 1;
        const uuid = (typeof window.crypto.randomUUID === 'function') 
          ? window.crypto.randomUUID() 
          : Math.random().toString(36).substring(2, 15);

        set({
          playerId: `guest_${uuid}`,
          nickname: `${noun}${number}`,
          avatar,
          color,
          isRegistered: false,
          totalScore: 0,
          impostorGames: 0,
          agenteGames: 0,
          infiltradoGames: 0,
          dispersoGames: 0,
          vinculadoGames: 0,
          totalVotes: 0,
          correctVotes: 0,
          globalRank: null,
          voteEfficacy: 0
        });
      },
      register: async (nickname, avatar, color) => {
        const data = await authService.register({ nickname, avatar, color });
        set({
          playerId: data.id,
          nickname: data.nickname,
          avatar: data.avatar,
          color: data.color,
          isRegistered: true,
          totalScore: data.totalScore,
          impostorGames: data.impostorGames,
          agenteGames: data.agenteGames,
          infiltradoGames: data.infiltradoGames,
          dispersoGames: data.dispersoGames,
          vinculadoGames: data.vinculadoGames,
          totalVotes: data.totalVotes,
          correctVotes: data.correctVotes,
          globalRank: data.globalRank,
          voteEfficacy: data.voteEfficacy
        });
      },
      verifySession: async (id) => {
        const data = await authService.verify(id);
        set({
          playerId: data.id,
          nickname: data.nickname,
          avatar: data.avatar,
          color: data.color,
          isRegistered: true,
          totalScore: data.totalScore,
          // Partial data: preserve existing stats for everything else
        });
      },
      addStats: (points, role, votedCorrectly) => set((state) => {
        const newTotalVotes = state.totalVotes + (votedCorrectly !== undefined ? 1 : 0);
        const newCorrectVotes = state.correctVotes + (votedCorrectly === true ? 1 : 0);
        return {
          totalScore: state.totalScore + points,
          impostorGames: state.impostorGames + (role === 'IMPOSTOR' ? 1 : 0),
          agenteGames: state.agenteGames + (role === 'AGENTE' || role === 'AGENT' ? 1 : 0),
          infiltradoGames: state.infiltradoGames + (role === 'INFILTRADO' ? 1 : 0),
          dispersoGames: state.dispersoGames + (role === 'DISPERSO' ? 1 : 0),
          vinculadoGames: state.vinculadoGames + (role === 'VINCULADO' ? 1 : 0),
          totalVotes: newTotalVotes,
          correctVotes: newCorrectVotes,
          voteEfficacy: newTotalVotes > 0 ? Math.round((newCorrectVotes / newTotalVotes) * 100) : 0,
        };
      }),
      clearAuth: () => set({
        playerId: null,
        nickname: null,
        avatar: null,
        color: null,
        totalScore: 0,
        impostorGames: 0,
        agenteGames: 0,
        infiltradoGames: 0,
        dispersoGames: 0,
        vinculadoGames: 0,
        totalVotes: 0,
        correctVotes: 0,
        globalRank: null,
        voteEfficacy: 0,
        isRegistered: false
      }),
    }),
    {
      name: 'impostor-auth',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
