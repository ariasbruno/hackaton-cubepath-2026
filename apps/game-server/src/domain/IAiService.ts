import type { RoomSettings } from '@impostor/shared';
import type { GameContent } from '@impostor/shared';

export interface IAiService {
  /**
   * Genereate game content (words) based on the room's configurations.
   * 
   * @param settings The configuration for the room (Mode, Category, Subcategories)
   * @param playerCount Number of active players, used for Chaos Mode balancing
   * @param previousWords Words used in earlier rounds to avoid repetition
   */
  generateGameContent(
    settings: RoomSettings,
    playerCount: number,
    previousWords: string[]
  ): Promise<GameContent>;
}
