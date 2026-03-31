import type { PlayerEntity } from './entities';

/**
 * Puerto de salida para persistencia de Jugadores.
 */
export interface IPlayerRepository {
  /**
   * Crea un nuevo jugador.
   * TotalScore es 0 por defecto. lastIp es opcional (para auditoría).
   */
  create(player: {
    nickname: string;
    avatar: string;
    color?: string;
    lastIp?: string | null;
  }): Promise<PlayerEntity>;

  /**
   * Obtiene un jugador mediante su ID (UUID).
   */
  findById(id: string): Promise<PlayerEntity | null>;

  /**
   * Obtiene múltiples jugadores por ID simultáneamente.
   */
  findByIds(ids: string[]): Promise<PlayerEntity[]>;

  /**
   * Actualiza el puntaje total de un jugador (operación atómica).
   */
  addScore(id: string, scoreToAdd: number): Promise<void>;

  /**
   * Actualiza los datos del perfil del jugador.
   */
  update(id: string, nickname: string, avatarId: string, color: string): Promise<PlayerEntity | null>;
  touch(id: string): Promise<void>;
}
