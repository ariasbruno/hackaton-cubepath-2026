import { useLocalGameStore, type LocalPlayer, type SingleLocalGame } from '../store/useLocalGameStore';
import fallbackWords from '../data/fallback_words.json';

// In a real scenario, this would call the API. 
// For now, we use the fallback to ensure offline capability.
const fetchGameWords = async (mode: 'TRADICIONAL' | 'CERCANAS') => {
  try {
    const bank = (fallbackWords as any)[mode];
    if (!bank || bank.length === 0) throw new Error(`Mode ${mode} not found in bank`);
    
    const pair = bank[Math.floor(Math.random() * bank.length)];
    return {
      mainWord: pair.mainWord,
      infiltradoWord: pair.infiltradoWord || ''
    };
  } catch (error) {
    console.error('Error fetching words:', error);
    return {
      mainWord: 'CAFÉ',
      infiltradoWord: mode === 'CERCANAS' ? 'TÉ' : ''
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
      role: 'AGENT' as const,
      word: mainWord,
      isAlive: true,
      votesReceived: 0
    }));

    const indices = Array.from({ length: newPlayers.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    if (game.settings.mode === 'CERCANAS' && infiltradoWord) {
      const infiltradoIdx = indices[0];
      newPlayers[infiltradoIdx].role = 'INFILTRATED';
      newPlayers[infiltradoIdx].word = infiltradoWord;
    } else {
      const impostorIdx = indices[0];
      newPlayers[impostorIdx].role = 'IMPOSTOR';
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

    if (target.role === 'IMPOSTOR' || target.role === 'INFILTRATED') {
      winner = 'AGENTS';
    } else {
      const remainingImpostors = players.filter(p => 
        (p.role === 'IMPOSTOR' || p.role === 'INFILTRATED')
      );
      if (remainingImpostors.length > 0) {
        winner = remainingImpostors[0].role as any;
      } else {
        winner = 'AGENTS';
      }
    }

    updateGame(code, {
      winner,
      votedPlayerId: targetId,
      phase: 'REVEAL'
    });
  }
};
