import { useLocalGameStore, type LocalPlayer, type SingleLocalGame } from '../store/useLocalGameStore';
import fallbackWords from '../data/fallback_words.json';
import { GAME_MODES, PLAYER_ROLES, WINNER_SIDES } from '@impostor/shared';
import type { GameMode } from '@impostor/shared';

const fetchGameWords = async (mode: GameMode) => {
  const currentMode = mode || GAME_MODES.TRADITIONAL;
  try {
    const bank = (fallbackWords as any)[currentMode];
    if (!bank || bank.length === 0) throw new Error(`Mode ${currentMode} not found in bank`);
    
    const pair = bank[Math.floor(Math.random() * bank.length)];
    return {
      mainWord: pair.mainWord,
      infiltradoWord: pair.infiltradoWord || ''
    };
  } catch (error) {
    console.error('Error fetching words:', error);
    return {
      mainWord: 'CAFÉ',
      infiltradoWord: currentMode === GAME_MODES.CERCANAS ? 'TÉ' : ''
    };
  }
};

const getGame = (code: string) => useLocalGameStore.getState().games[code];
const updateGame = (code: string, updates: Partial<Omit<SingleLocalGame, 'code' | 'createdAt'>>) => 
  useLocalGameStore.getState().updateGame(code, updates);

export const LocalGameEngine = {
  startGame: async (code: string) => {
    const game = getGame(code);
    if (!game || game.players.length < 3) return;

    const { mainWord, infiltradoWord } = await fetchGameWords(game.settings.mode);

    const newPlayers: LocalPlayer[] = [...game.players].map(p => ({
      ...p,
      role: PLAYER_ROLES.AGENTE,
      word: mainWord,
      isAlive: true,
      votesReceived: 0
    }));

    const indices = Array.from({ length: newPlayers.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    if (game.settings.mode === GAME_MODES.CERCANAS && infiltradoWord) {
      const infiltradoIdx = indices[0];
      newPlayers[infiltradoIdx].role = PLAYER_ROLES.INFILTRADO;
      newPlayers[infiltradoIdx].word = infiltradoWord;
    } else {
      const impostorIdx = indices[0];
      newPlayers[impostorIdx].role = PLAYER_ROLES.IMPOSTOR;
      newPlayers[impostorIdx].word = ''; 
    }

    const shuffledPlayers = indices.map(i => newPlayers[i]);

    updateGame(code, {
      players: shuffledPlayers,
      currentPlayerIndex: 0,
      phase: 'PASS_PHONE',
      secretWord: mainWord,
      infiltratedWord: infiltradoWord || undefined
    });
  },

  handleVote: (code: string, targetId: string) => {
    const game = getGame(code);
    if (!game) return;

    const players = [...game.players];
    const target = players.find(p => p.id === targetId);
    if (!target) return;

    let winner: SingleLocalGame['winner'] = null;

    if (target.role === PLAYER_ROLES.IMPOSTOR || target.role === PLAYER_ROLES.INFILTRADO) {
      winner = WINNER_SIDES.AGENTES;
    } else {
      winner = WINNER_SIDES.IMPOSTORES;
    }

    updateGame(code, {
      winner,
      votedPlayerId: targetId,
      phase: 'REVEAL'
    });
  }
};
