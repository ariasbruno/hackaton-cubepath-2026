import type { RoomState, PlayerState } from '../../domain/models';
import type { IAiService } from '../../domain/IAiService';
import type { Role, GameMode } from '@impostor/shared';
import { TurnManager } from '../../domain/TurnManager';

export class PrepareMatchContent {
  private turnManager = new TurnManager();

  constructor(
    private readonly aiService: IAiService
  ) {}

  /**
   * Orchestrates requesting words, retrying, assigning roles, and distributing words.
   */
  public async execute(room: RoomState): Promise<void> {
    const playerCount = room.players.length;
    // We would ideally extract 'previousWords' from room history if we stored it, doing empty for now.
    const previousWords: string[] = []; 

    let content;
    try {
      // Pedimos todo a la API de forma central
      content = await this.aiService.generateGameContent(room.settings, playerCount, previousWords);
    } catch (e) {
      console.warn(`[PrepareMatchContent] Error delegating to API. This shouldn't happen unless API is dead.`, e);
      throw e;
    }

    room.secretWord = content.mainWord;
    this.assignRolesAndWords(room, content);
  }

  private assignRolesAndWords(room: RoomState, content: any): void {
    const { mode } = room.settings;
    
    // 1. Shuffle players to randomize assignment
    const shuffledPlayerIds = this.turnManager.generateTurnOrder(room.players.map(p => p.id));
    room.turnOrder = shuffledPlayerIds;
    
    // We map players by ID for quick arbitrary modifications
    const playerMap = new Map<string, PlayerState>();
    room.players.forEach(p => playerMap.set(p.id, p));

    // Cleanup previous match data
    playerMap.forEach(p => {
      p.isAlive = true;
    });

    if (mode === 'TRADICIONAL') {
      // 1 Impostor, resto Agentes
      const impostorId = shuffledPlayerIds[0];
      
      playerMap.forEach((p, id) => {
        if (id === impostorId) {
          p.role = 'IMPOSTOR';
          p.word = undefined; // Impostors don't get the word!
        } else {
          p.role = 'AGENTE';
          p.word = content.mainWord;
        }
      });
    } 
    else if (mode === 'CERCANAS') {
      // 1 Infiltrado, resto Agentes
      const infiltratorId = shuffledPlayerIds[0];

      playerMap.forEach((p, id) => {
        if (id === infiltratorId) {
          p.role = 'INFILTRADO';
          // Infiltrator sees their altered word
          p.word = content.infiltradoWord;
        } else {
          p.role = 'AGENTE';
          p.word = content.mainWord;
        }
      });
    }
    else if (mode === 'CAOS') {
      // 2 Vinculados (pareja), resto Dispersos
      const partnerAId = shuffledPlayerIds[0];
      const partnerBId = shuffledPlayerIds[1];
      
      let relatedIndex = 0;
      const relatedWords = content.relatedWords || [];

      playerMap.forEach((p, id) => {
        if (id === partnerAId || id === partnerBId) {
          p.role = 'VINCULADO';
          p.word = content.mainWord; // Pareja tiene la misma palabra
        } else {
          p.role = 'DISPERSO';
          // Los dispersos tienen palabras de la lista relatedWords
          p.word = relatedWords[relatedIndex] || 'ErrorSemantico';
          relatedIndex++;
        }
      });
    }
  }
}
