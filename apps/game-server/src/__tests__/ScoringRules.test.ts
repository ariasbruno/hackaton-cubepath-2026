import { expect, test, describe } from "bun:test";
import { ScoringRules } from "../domain/ScoringRules";
import type { RoomState, PlayerState } from "../domain/models";

describe("ScoringRules", () => {
  const scoring = new ScoringRules();

  const createRoom = (players: PlayerState[]): RoomState => ({
    id: "uuid",
    code: "ABCD",
    settings: {
      name: "Test",
      maxPlayers: 5,
      mode: "TRADICIONAL",
      mainCategory: "A",
      subcategories: [],
      isPublic: true,
      timers: { clues: 30, discuss: 30, vote: 30 }
    },
    phase: "RESULTS",
    players,
    clues: [],
    chatMessages: [],
    turnOrder: players.map(p => p.id),
    turnId: null,
    timerEndAt: 0
  });

  const createPlayer = (id: string, role: string, isAlive: boolean, votedFor: string | null): PlayerState => ({
    id,
    nickname: "P" + id,
    avatar: "",
    isAlive,
    isConnected: true,
    hasVoted: votedFor !== null,
    votedFor,
    pointsEarned: 0,
    role,
    isReady: true,
    socketId: "sock-" + id,
    disconnectTimer: null
  });

  test("Impostor wins if equal or more than agents", () => {
    const players: PlayerState[] = [
      createPlayer("1", "IMPOSTOR", true, null),
      createPlayer("2", "AGENTE", true, null),
      createPlayer("3", "AGENTE", false, null),
    ];
    const room = createRoom(players);
    const result = scoring.evaluateWinCondition(room);

    expect(result.isGameOver).toBe(true);
    expect(result.winnerTeam).toBe("IMPOSTOR");
  });

  test("Agents win if all impostors are dead", () => {
    const players: PlayerState[] = [
      createPlayer("1", "IMPOSTOR", false, null),
      createPlayer("2", "AGENTE", true, null),
      createPlayer("3", "AGENTE", true, null),
    ];
    const room = createRoom(players);
    const result = scoring.evaluateWinCondition(room);

    expect(result.isGameOver).toBe(true);
    expect(result.winnerTeam).toBe("AGENTS");
  });

  test("calculates points correctly for AGENTS winning", () => {
    const players: PlayerState[] = [
      createPlayer("1", "IMPOSTOR", false, "2"), // died, voted an agent (misdirect +10)
      createPlayer("2", "AGENTE", true, "1"), // voted impostor (+10), won (+20)
      createPlayer("3", "AGENTE", true, "1"), // voted impostor (+10), won (+20)
    ];
    const room = createRoom(players);
    const condition = scoring.evaluateWinCondition(room);
    scoring.calculatePoints(room, condition);

    expect(room.players[0].pointsEarned).toBe(10);
    expect(room.players[1].pointsEarned).toBe(30);
    expect(room.players[2].pointsEarned).toBe(30);
  });
});
