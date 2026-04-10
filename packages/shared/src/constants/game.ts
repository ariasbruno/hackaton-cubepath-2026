export const GAME_MODES = {
  TRADITIONAL: 'TRADICIONAL',
  CERCANAS: 'CERCANAS',
  CAOS: 'CAOS',
} as const;
export type GameMode = typeof GAME_MODES[keyof typeof GAME_MODES];

export const PLAYER_ROLES = {
  AGENTE: 'AGENTE',
  IMPOSTOR: 'IMPOSTOR',
  INFILTRADO: 'INFILTRADO',
  VINCULADO: 'VINCULADO',
  DISPERSO: 'DISPERSO',
} as const;
export type PlayerRole = typeof PLAYER_ROLES[keyof typeof PLAYER_ROLES];

// Subset local justificado por la ausencia del modo Caos
export type LocalPlayerRole = Extract<PlayerRole, 'AGENTE' | 'IMPOSTOR' | 'INFILTRADO'>;

export const WINNER_SIDES = {
  AGENTES: 'AGENTES',
  IMPOSTORES: 'IMPOSTORES',
  CAOS: 'CAOS',
} as const;
export type WinnerSide = typeof WINNER_SIDES[keyof typeof WINNER_SIDES];

export const ROOM_STATUSES = {
  LOBBY: 'LOBBY',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED',
} as const;
export type RoomStatus = typeof ROOM_STATUSES[keyof typeof ROOM_STATUSES];

export const GAME_PHASES = {
  LOBBY: 'LOBBY',
  ASSIGNING: 'ASSIGNING',
  CLUES: 'CLUES',
  DISCUSSING: 'DISCUSSING',
  VOTING: 'VOTING',
  VOTE_REVEAL: 'VOTE_REVEAL',
  RESULTS: 'RESULTS',
} as const;
export type GamePhase = typeof GAME_PHASES[keyof typeof GAME_PHASES];

export const LOCAL_PHASES = {
  LOBBY: 'LOBBY',
  PASS_PHONE: 'PASS_PHONE',
  ASSIGNING: 'ASSIGNING',
  PLAYING: 'PLAYING',
  VOTING: 'VOTING',
  REVEAL: 'REVEAL',
  RESULTS: 'RESULTS',
} as const;
export type LocalPhase = typeof LOCAL_PHASES[keyof typeof LOCAL_PHASES];
export const CONNECTION_TYPES = {
  LOCAL: 'local',
  ONLINE: 'online',
} as const;
export type ConnectionType = typeof CONNECTION_TYPES[keyof typeof CONNECTION_TYPES];
