import type { RoomSettings } from '@impostor/shared';

export interface RoomApiResponse {
  id: string;
  code: string;
  hostId: string;
  status: string;
  settings: RoomSettings;
}

export interface PlayerApiResponse {
  id: string;
  nickname: string;
  avatar: string;
  color: string;
}

export interface IApiClient {
  /**
   * Validates if a room code exists and retrieves its basic info from the main API.
   * Throws if it doesn't exist.
   */
  getRoomByCode(code: string): Promise<RoomApiResponse>;

  /**
   * Fetches the Player Profile using Silent Identifier.
   */
  getPlayerById(id: string): Promise<PlayerApiResponse>;

  /**
   * Permanently deletes a room.
   */
  deleteRoom(id: string): Promise<void>;
}
