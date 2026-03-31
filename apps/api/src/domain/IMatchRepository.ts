import type { MatchResult } from '@impostor/shared';

export interface IMatchRepository {
  /**
   * Archives a match result including adjusting player stats using a transaction
   */
  archiveMatch(result: MatchResult): Promise<void>;
}
