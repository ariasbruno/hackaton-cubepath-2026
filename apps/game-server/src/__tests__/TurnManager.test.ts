import { expect, test, describe } from "bun:test";
import { TurnManager } from "../domain/TurnManager";

describe("TurnManager", () => {
  test("generates a randomized turn order array", () => {
    const turnManager = new TurnManager();
    const playerIds = ["1", "2", "3", "4", "5"];
    
    const turnOrder = turnManager.generateTurnOrder(playerIds);
    
    expect(turnOrder.length).toBe(5);
    expect(turnOrder.every(id => playerIds.includes(id))).toBe(true);
  });
});
