import type { IAiService } from '../../domain/IAiService';
import type { RoomSettings, GameContent } from '@impostor/shared';

/**
 * Delegated service that requests Game Content from the main REST API.
 * This keeps the game-server decoupled from external AI SDKs.
 */
export class ApiContentService implements IAiService {
  private apiUrl: string;
  private internalApiKey: string;

  constructor() {
    this.apiUrl = process.env.VITE_API_URL || 'http://localhost:3000';
    this.internalApiKey = process.env.INTERNAL_API_KEY || '';
  }

  async generateGameContent(
    settings: RoomSettings,
    playerCount: number,
    previousWords: string[]
  ): Promise<GameContent> {
    
    const response = await fetch(`${this.apiUrl}/internal/ai/generate-game-content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-key': this.internalApiKey
      },
      body: JSON.stringify({
        mode: settings.mode,
        mainCategory: settings.mainCategory,
        subcategories: settings.subcategories,
        previousWords,
        playerCount
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[ApiContentService] Failed to fetch content from internal API:', errorText);
      throw new Error(`Internal API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data as GameContent;
  }
}
