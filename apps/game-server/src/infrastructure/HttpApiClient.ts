import type { IApiClient, RoomApiResponse, PlayerApiResponse } from '../domain/IApiClient';

export class HttpApiClient implements IApiClient {
  private readonly baseUrl: string;
  private readonly internalKey: string;

  constructor() {
    this.baseUrl = process.env.INTERNAL_API_URL || 'http://localhost:3000';
    this.internalKey = process.env.INTERNAL_API_KEY || 'dev-internal-key';
  }

  async getRoomByCode(code: string): Promise<RoomApiResponse> {
    const res = await fetch(`${this.baseUrl}/rooms/check/${code}`);
    if (!res.ok) {
      if (res.status === 404) {
        throw new Error('RoomNotFound');
      }
      throw new Error(`Failed to fetch room: ${res.statusText}`);
    }
    return res.json() as Promise<RoomApiResponse>;
  }

  async getPlayerById(id: string): Promise<PlayerApiResponse> {
    const res = await fetch(`${this.baseUrl}/auth/me/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch player: ${res.statusText}`);
    }
    return res.json() as Promise<PlayerApiResponse>;
  }

  async deleteRoom(id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/internal/rooms/${id}`, {
      method: 'DELETE',
      headers: {
        'x-internal-key': this.internalKey 
      }
    });
    if (!res.ok) {
      console.error(`[HttpApiClient] Failed to delete room ${id}: ${res.statusText}`);
    }
  }
}
