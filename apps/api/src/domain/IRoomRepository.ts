import type { RoomEntity, RoomStatus } from './entities';
import type { RoomSettings } from '@impostor/shared';

/**
 * Puerto de salida para persistencia de Salas.
 */
export interface IRoomRepository {
  /**
   * Crea una sala nueva (status LOBBY por defecto, UUID gen_random_uuid).
   */
  create(room: {
    code: string;
    hostId: string;
    settings: RoomSettings;
  }): Promise<RoomEntity>;

  /**
   * Busca una sala activa o no por su código de 4 letras.
   */
  findByCode(code: string): Promise<RoomEntity | null>;

  /**
   * Retorna las últimas N salas públicas en estado LOBBY.
   */
  getPublicLobbies(limit: number): Promise<RoomEntity[]>;
  findAll(): Promise<(RoomEntity & { hostNickname?: string, participants?: string[] })[]>;

  /**
   * Actualiza el estado de una sala (LOBBY -> PLAYING -> FINISHED).
   */
  updateStatus(id: string, status: RoomStatus): Promise<RoomEntity | null>;
  
  /**
   * Actualiza la configuración de la sala.
   */
  updateSettings(id: string, settings: RoomSettings): Promise<RoomEntity | null>;
  /**
   * Elimina la sala permanentemente.
   */
  delete(id: string): Promise<void>;
}
