import { expect, test, describe } from "bun:test";
import { 
  roomSettingsSchema, 
  matchResultSchema, 
} from '../schemas/room.schema';
import { castVoteSchema } from '../schemas/game.schema';

describe("Shared Schemas Validation", () => {
  test("roomSettingsSchema valid data", () => {
    const validData = {
      name: "Sala de Prueba",
      maxPlayers: 8,
      mode: "TRADICIONAL",
      mainCategory: "General",
      subcategories: ["Todo"],
      isPublic: true,
      timers: { clues: 30, discuss: 120, vote: 30 }
    };
    const result = roomSettingsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  test("roomSettingsSchema enforces maxPlayers limits", () => {
    const invalidData = {
      name: "Sala",
      maxPlayers: 20, // should fail (max 10)
      mode: "TRADICIONAL",
      mainCategory: "General",
      subcategories: [],
      isPublic: true,
      timers: { clues: 30, discuss: 120, vote: 30 }
    };
    const result = roomSettingsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test("roomSettingsSchema enforces 4 players minimum for CAOS mode", () => {
    const baseData = {
      name: "Sala Caos",
      mode: "CAOS",
      mainCategory: "General",
      subcategories: ["Todo"],
      isPublic: true,
      timers: { clues: 30, discuss: 120, vote: 30 }
    };

    // Should fail with 3 players
    expect(roomSettingsSchema.safeParse({ ...baseData, maxPlayers: 3 }).success).toBe(false);
    
    // Should pass with 4 players
    expect(roomSettingsSchema.safeParse({ ...baseData, maxPlayers: 4 }).success).toBe(true);
  });

  test("castVoteSchema target validation for VOTE", () => {
    const validVote = { action: 'VOTE', targets: ['123e4567-e89b-12d3-a456-426614174000'], confirm: true };
    const invalidVote = { action: 'VOTE', targets: ['uuid1', 'uuid2'], confirm: true }; // VOTE accepts 1 tgt
    
    expect(castVoteSchema.safeParse(validVote).success).toBe(true);
    expect(castVoteSchema.safeParse(invalidVote).success).toBe(false);
  });

  test("castVoteSchema target validation for SKIP", () => {
    const validSkip = { action: 'SKIP', targets: [], confirm: true };
    const invalidSkip = { action: 'SKIP', targets: ['uuid1'], confirm: true }; // SKIP accepts 0 tgts

    expect(castVoteSchema.safeParse(validSkip).success).toBe(true);
    expect(castVoteSchema.safeParse(invalidSkip).success).toBe(false);
  });
});
