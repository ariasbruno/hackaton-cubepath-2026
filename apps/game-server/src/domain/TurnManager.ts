/**
 * Pure domain logic to decide turn ordering during the Clues phase.
 */
export class TurnManager {
  /**
   * Randomizes the order of player IDs.
   * Can be seeded or weighted in the future if we want certain roles to speak first/last.
   */
  public generateTurnOrder(playerIds: string[]): string[] {
    // Fisher-Yates shuffle
    const order = [...playerIds];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  }
}
