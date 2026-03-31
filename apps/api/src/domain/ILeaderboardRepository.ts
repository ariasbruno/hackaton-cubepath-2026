export interface LeaderboardEntry {
  id: string;
  nickname: string;
  avatar: string;
  role: string;
  matchesPlayed: number;
  totalPoints: number;
}

export interface ILeaderboardRepository {
  /**
   * Retrieves the aggregated points ranking per role inside a given room.
   */
  getLeaderboardByRoom(roomId: string): Promise<LeaderboardEntry[]>;
}
