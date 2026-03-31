import type { RoomSettings, GameContent } from '@impostor/shared';
// @ts-ignore
import fallbackData from '../data/fallback_words.json';

export class LocalFallbackService {
  async generateGameContent(
    settings: RoomSettings,
    playerCount: number,
    previousWords: string[]
  ): Promise<GameContent> {
    const modeData = (fallbackData as any)[settings.mode];
    if (!modeData || !Array.isArray(modeData)) {
      throw new Error(`Fallback data not found for mode: ${settings.mode}`);
    }

    // Filter out previous words if possible
    let availableOpts = modeData.filter(d => !previousWords.includes(d.mainWord));
    
    // If all words were used, reset pool
    if (availableOpts.length === 0) {
      availableOpts = modeData;
    }

    // Pick random
    const randomIndex = Math.floor(Math.random() * availableOpts.length);
    const chosen = availableOpts[randomIndex];

    return {
      mainWord: chosen.mainWord,
      infiltradoWord: chosen.infiltradoWord || null,
      relatedWords: chosen.relatedWords || null,
    };
  }
}
