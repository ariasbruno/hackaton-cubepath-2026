import { z } from 'zod';

// ============================================================
// Enum de Fases del Juego (GamePhase)
// Fuente de verdad para toda la aplicación.
// Usa gerundio para mantener consistencia lingüística.
// ============================================================
export const gamePhaseSchema = z.enum([
  'LOBBY',       // Esperando jugadores, pre-partida
  'ASSIGNING',   // Revelación de roles (Hold to Reveal)
  'CLUES',       // Ronda de pistas por turnos
  'DISCUSSING',  // Debate abierto / chat de acusaciones
  'VOTING',      // Votación secreta
  'ELIMINATION', // Animación de suspenso y resultado del eliminado
  'RESULTS',     // Pantalla final de puntuación
]);

export type GamePhase = z.infer<typeof gamePhaseSchema>;

// ============================================================
// Enum de Roles
// ============================================================
export const roleSchema = z.enum([
  'AGENTE',
  'IMPOSTOR',
  'INFILTRADO',
  'VINCULADO',
  'DISPERSO',
]);

export type Role = z.infer<typeof roleSchema>;

// ============================================================
// Enum de Lados Ganadores
// ============================================================
export const winnerSideSchema = z.enum(['AGENTES', 'IMPOSTORES', 'CAOS']);

export type WinnerSide = z.infer<typeof winnerSideSchema>;
