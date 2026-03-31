import type { ILeaderboardRepository, LeaderboardEntry } from '../domain/ILeaderboardRepository';

export class LeaderboardUseCase {
  constructor(private readonly leaderboardRepo: ILeaderboardRepository) {}

  public async getLeaderboard(roomId: string): Promise<LeaderboardEntry[]> {
    if (!roomId) throw new Error('Room ID is required');
    return await this.leaderboardRepo.getLeaderboardByRoom(roomId);
  }
}
