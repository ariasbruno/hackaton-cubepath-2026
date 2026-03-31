import type { MatchResult } from '@impostor/shared';
import type { IMatchRepository } from '../domain/IMatchRepository';

export class MatchUseCase {
  constructor(private readonly matchRepo: IMatchRepository) {}

  public async archiveMatch(result: MatchResult): Promise<void> {
    // We could validate business logic here.
    // E.g., is room active? are players registered? 
    // For now we trust the internal game-server payload.
    await this.matchRepo.archiveMatch(result);
  }
}
