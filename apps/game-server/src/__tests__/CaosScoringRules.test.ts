import { expect, test, describe } from "bun:test";
import { ScoringRules } from "../domain/ScoringRules";
import type { RoomState, PlayerState } from "../domain/models";

// ─── Helpers ────────────────────────────────────────────────────────────────

const createCaosRoom = (players: PlayerState[]): RoomState => ({
  id: "uuid",
  code: "CAOS",
  settings: {
    name: "Test",
    maxPlayers: 10,
    mode: "CAOS",
    mainCategory: "A",
    subcategories: [],
    isPublic: true,
    timers: { clues: 30, discuss: 30, vote: 30 },
  },
  phase: "VOTING",
  players,
  clues: [],
  chatMessages: [],
  turnOrder: players.map((p) => p.id),
  turnId: null,
  timerEndAt: 0,
  currentRound: 1,
  skipVotes: [],
});

type VoteAction = "ACCUSE" | "LINK" | "SKIP";

const makeVinculado = (
  id: string,
  linkedTo: string | null,
  hasVoted = true
): PlayerState => ({
  id,
  nickname: "P" + id,
  avatar: "",
  isAlive: true,
  isConnected: true,
  hasVoted,
  votedFor: linkedTo,
  votedAction: linkedTo !== null ? "LINK" : ("SKIP" as VoteAction),
  votedTargets: linkedTo !== null ? [linkedTo] : [],
  role: "VINCULADO",
  isReady: true,
  socketId: "sock-" + id,
  disconnectTimer: null,
  pointsEarned: 0,
  lastMatchPoints: 0,
  agentGames: 0,
  agentPoints: 0,
  impostorGames: 0,
  impostorPoints: 0,
});

const makeDisperso = (
  id: string,
  targets: string[],
  action: VoteAction = "ACCUSE"
): PlayerState => ({
  id,
  nickname: "P" + id,
  avatar: "",
  isAlive: true,
  isConnected: true,
  hasVoted: true,
  votedFor: targets[0] ?? null,
  votedAction: action,
  votedTargets: targets,
  role: "DISPERSO",
  isReady: true,
  socketId: "sock-" + id,
  disconnectTimer: null,
  pointsEarned: 0,
  lastMatchPoints: 0,
  agentGames: 0,
  agentPoints: 0,
  impostorGames: 0,
  impostorPoints: 0,
});

// ─── Suite ───────────────────────────────────────────────────────────────────

const scoring = new ScoringRules();

describe("Modo Caos — getEliminationTarget", () => {
  // ── PASO 0: Vínculo mutuo ────────────────────────────────────────────────

  test("PASO 0: vinculados se vinculan mutuamente → CAOS gana (retorna ids)", () => {
    const room = createCaosRoom([
      makeVinculado("v1", "v2"),
      makeVinculado("v2", "v1"),
      makeDisperso("d1", ["v1", "v2"]),
      makeDisperso("d2", ["d1", "v1"]),
    ]);
    const result = scoring.getEliminationTarget(room);
    // Mutual link → vinculados must be identified as the "target" to reveal
    expect(result).not.toBeNull();
  });

  test("PASO 0: vínculo unilateral (solo uno encuentra al otro) NO es mutuo → continuar lógica", () => {
    // v2→v1 but v1 links to a disperso: NOT mutual
    const room = createCaosRoom([
      makeVinculado("v1", "d1"), // wrong link
      makeVinculado("v2", "v1"), // correct link but unilateral
      makeDisperso("d1", ["v1", "v2"]),
      makeDisperso("d2", ["d1", "v1"]),
    ]);
    const result = scoring.getEliminationTarget(room);
    // No mutual link; no majority accusation either → TIE
    expect(result).toBeNull();
  });

  test("PASO 0: vinculados se vinculan mutuamente Y son descubiertos simultáneamente → CAOS gana (prioridad)", () => {
    // Both vinculados link to each other AND both dispersos correctly accuse
    const room = createCaosRoom([
      makeVinculado("v1", "v2"),
      makeVinculado("v2", "v1"),
      makeDisperso("d1", ["v1", "v2"]),
      makeDisperso("d2", ["v1", "v2"]),
    ]);
    const result = scoring.getEliminationTarget(room);
    // Both correct → Vinculados win (priority)
    // Result should signal this is a "vinculados win" scenario, not dispersos
    // We verify by checking evaluateWinCondition returns IMPOSTOR win
    expect(result).not.toBeNull();
    // Simulate elimination of vinculados for evaluateWinCondition check
    room.players
      .filter((p) => p.role === "VINCULADO")
      .forEach((p) => (p.isAlive = false));
    const condition = scoring.evaluateWinCondition(room);
    expect(condition.winnerTeam).toBe("IMPOSTOR");
  });

  // ── PASO 1: No hay ningún grupo (todos votan distinto) ────────────────────

  test("sin ningún grupo de ≥2 votos iguales → empate (null)", () => {
    // The scenario from the user's original question
    const room = createCaosRoom([
      makeDisperso("d1", ["v1", "v2"]), // accuse v1+v2
      makeVinculado("v1", "v2"),        // link to v2 (correct but unilateral)
      makeDisperso("d2", ["v2", "d1"]), // accuse v2+d1 (wrong)
      makeVinculado("v2", "d1"),        // link to d1 (wrong)
    ]);
    const result = scoring.getEliminationTarget(room);
    expect(result).toBeNull(); // TIE
  });

  test("10 jugadores con 10 votos distintos → empate (null)", () => {
    const room = createCaosRoom([
      makeVinculado("v1", "d1"),
      makeVinculado("v2", "d2"),
      makeDisperso("d1", ["v1", "d3"]),
      makeDisperso("d2", ["v2", "d4"]),
      makeDisperso("d3", ["v1", "d5"]),
      makeDisperso("d4", ["v2", "d6"]),
      makeDisperso("d5", ["d3", "d1"]),
      makeDisperso("d6", ["d4", "d2"]),
      makeDisperso("d7", ["v1", "d8"]),
      makeDisperso("d8", ["v2", "d7"]),
    ]);
    const result = scoring.getEliminationTarget(room);
    expect(result).toBeNull(); // TIE — all voted differently
  });

  // ── PASO 2: Un único grupo con mayoría clara ──────────────────────────────

  test("2 dispersos acusan el mismo par correcto (única mayoría) → AGENTES ganan", () => {
    const room = createCaosRoom([
      makeVinculado("v1", "d3"), // wrong link
      makeVinculado("v2", "d3"), // wrong link
      makeDisperso("d1", ["v1", "v2"]), // correct accusation
      makeDisperso("d2", ["v1", "v2"]), // correct accusation → group of 2
      makeDisperso("d3", ["d1", "v1"]), // wrong, solo
    ]);
    const result = scoring.getEliminationTarget(room);
    expect(result).not.toBeNull(); // Dispersos win
    // Verify it correctly identifies vinculados as the target
    expect(["v1", "v2"]).toContain(result);
  });

  test("4 votos iguales vs 2 iguales vs 4 individuales → el grupo de 4 es la mayoría", () => {
    // 4 dispersos accuse the same (correct) pair → clear majority over group of 2
    const room = createCaosRoom([
      makeVinculado("v1", "d1"),
      makeVinculado("v2", "d1"),
      makeDisperso("d1", ["v1", "v2"]), // correct+majority group (x4)
      makeDisperso("d2", ["v1", "v2"]),
      makeDisperso("d3", ["v1", "v2"]),
      makeDisperso("d4", ["v1", "v2"]),
      makeDisperso("d5", ["d1", "d2"]), // wrong minority group (x2)
      makeDisperso("d6", ["d1", "d2"]),
      makeDisperso("d7", ["d3", "d4"]), // individual
      makeDisperso("d8", ["d5", "d6"]), // individual
    ]);
    const result = scoring.getEliminationTarget(room);
    expect(result).not.toBeNull();
    expect(["v1", "v2"]).toContain(result);
  });

  test("2 dispersos acusan el mismo par INCORRECTO (única mayoría) → empate", () => {
    const room = createCaosRoom([
      makeVinculado("v1", "d1"),
      makeVinculado("v2", "d2"),
      makeDisperso("d1", ["d3", "d4"]), // wrong pair but group of 2
      makeDisperso("d2", ["d3", "d4"]), // same wrong pair
      makeDisperso("d3", ["v1", "v2"]), // correct but solo
      makeDisperso("d4", ["v1", "d2"]), // wrong solo
    ]);
    const result = scoring.getEliminationTarget(room);
    expect(result).toBeNull(); // Only incorrect majority → TIE
  });

  // ── Caso: dos grupos del mismo tamaño, NINGUNO correcto → empate ─────────

  test("dos grupos empatados en tamaño pero ninguno acusa correctamente → empate (null)", () => {
    // 2 vote {d3,d4} (wrong) and 2 vote {d1,d2} (also wrong) → tie, neither correct
    const room = createCaosRoom([
      makeVinculado("v1", "d1"),
      makeVinculado("v2", "d2"),
      makeDisperso("d1", ["d3", "d4"]), // wrong group A (x2)
      makeDisperso("d2", ["d3", "d4"]),
      makeDisperso("d3", ["d1", "d2"]), // wrong group B (x2)
      makeDisperso("d4", ["d1", "d2"]),
    ]);
    const result = scoring.getEliminationTarget(room);
    expect(result).toBeNull(); // No correct group among tied leaders → TIE
  });

  // ── Caso: Dos grupos empatados, uno correcto y uno incorrecto ─────────────

  test("dos grupos empatados: 2 acusan correcto + 2 acusan incorrecto → AGENTES ganan", () => {
    const room = createCaosRoom([
      makeVinculado("v1", "d3"),
      makeVinculado("v2", "d3"),
      makeDisperso("d1", ["v1", "v2"]), // correct group (x2)
      makeDisperso("d2", ["v1", "v2"]),
      makeDisperso("d3", ["d1", "d4"]), // wrong group (x2)
      makeDisperso("d4", ["d1", "d4"]),
    ]);
    const result = scoring.getEliminationTarget(room);
    // One correct group → AGENTES win
    expect(result).not.toBeNull();
    expect(["v1", "v2"]).toContain(result);
  });

  // ── Vínculo correcto es SIEMPRE ganador aunque sea minoría ───────────────

  test("vínculo mutuo correcto aunque sean minoría (2 vs 8 dispersos con mayoría incorrecta) → CAOS gana", () => {
    const room = createCaosRoom([
      makeVinculado("v1", "v2"), // mutual link ✅
      makeVinculado("v2", "v1"), // mutual link ✅
      makeDisperso("d1", ["d3", "d4"]), // wrong majority group (8 players)
      makeDisperso("d2", ["d3", "d4"]),
      makeDisperso("d3", ["d3", "d4"]),
      makeDisperso("d4", ["d3", "d4"]),
      makeDisperso("d5", ["d3", "d4"]),
      makeDisperso("d6", ["d3", "d4"]),
      makeDisperso("d7", ["d3", "d4"]),
      makeDisperso("d8", ["d3", "d4"]),
    ]);
    const result = scoring.getEliminationTarget(room);
    // Mutual link wins regardless of disperso votes
    expect(result).not.toBeNull();
    room.players
      .filter((p) => p.role === "VINCULADO")
      .forEach((p) => (p.isAlive = false));
    const condition = scoring.evaluateWinCondition(room);
    expect(condition.winnerTeam).toBe("IMPOSTOR");
  });
});
