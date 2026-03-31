// @ts-nocheck
import React, { useState } from 'react';
import { Playing } from '../Game/Playing';

const MOCK_PLAYERS = [
  { id: 'p1', nickname: 'Bruno', avatar: 'noto--bear', color: '#FFD166' },
  { id: 'p2', nickname: 'Ivan', avatar: 'noto--fox', color: '#EF476F' },
  { id: 'p3', nickname: 'Ana', avatar: 'noto--cat', color: '#118AB2' },
  { id: 'p4', nickname: 'Maria', avatar: 'noto--dog', color: '#06D6A0' },
];

export const PlayingPrototype: React.FC = () => {
  const [phase, setPhase] = useState<'CLUES' | 'DISCUSSING'>('CLUES');

  const mockRoomState = {
    id: 'PROTO',
    code: 'PROTO',
    phase: phase,
    mode: 'TRADICIONAL',
    players: MOCK_PLAYERS,
    hostId: 'p1',
    settings: {
      maxPlayers: 8,
      rounds: 3,
      timers: { clues: 45, discuss: 120 },
    },
    turnId: 'p2',
    currentRound: 1,
    timerEndAt: Date.now() + 30000,
    clues: [
      {
        id: 'clue-1',
        text: 'Ronda 1',
        type: 'divider',
        timestamp: Date.now() - 60000,
      },
      {
        id: 'c1',
        playerId: 'p1',
        text: 'Vive en el frío',
        timestamp: Date.now() - 50000,
        type: 'clue',
        playerInfo: MOCK_PLAYERS[0],
      },
      {
        id: 'c2',
        playerId: 'p2',
        text: 'Tiene mucho pelo',
        timestamp: Date.now() - 40000,
        type: 'clue',
        playerInfo: MOCK_PLAYERS[1],
      },
      {
        id: 'clue-2',
        text: 'Ronda 2',
        type: 'divider',
        timestamp: Date.now() - 30000,
      },
      {
        id: 'c3',
        playerId: 'p3',
        text: 'Come peces',
        timestamp: Date.now() - 20000,
        type: 'clue',
        playerInfo: MOCK_PLAYERS[2],
      },
    ],
    chatMessages: [
      {
        id: 'm1',
        playerId: 'p1',
        text: '¡Yo creo que es Ivan!',
        timestamp: Date.now() - 10000,
        playerInfo: MOCK_PLAYERS[0],
      },
      {
        id: 'm2',
        playerId: 'p3',
        text: 'Su pista fue muy rara...',
        timestamp: Date.now() - 5000,
        playerInfo: MOCK_PLAYERS[2],
      },
    ],
    skipVotes: ['p4'],
  };

  // Mock the active player
  const myPlayerId = 'p1';

  // Override word for me
  const me = MOCK_PLAYERS.find(p => p.id === myPlayerId);
  (me as any).word = 'Oso polar';
  (me as any).role = 'AGENT'; 

  return (
    <div className="w-screen h-screen bg-paper flex flex-col font-sans text-ink relative overflow-hidden">
      {/* Dev Controls */}
      <div className="absolute top-2 right-2 z-50 flex gap-2">
        <button
          onClick={() => setPhase('CLUES')}
          className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${
            phase === 'CLUES' ? 'bg-primary text-white border-primary' : 'bg-white text-ink border-ink/20'
          }`}
        >
          Phase: CLUES
        </button>
        <button
          onClick={() => setPhase('DISCUSSING')}
          className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${
            phase === 'DISCUSSING' ? 'bg-primary text-white border-primary' : 'bg-white text-ink border-ink/20'
          }`}
        >
          Phase: DISCUSSING
        </button>
      </div>

      {/* Main Game Interface */}
      <div className="flex-1 flex flex-col w-full relative overflow-hidden">
        <Playing roomState={{...mockRoomState}} playerId={myPlayerId} />
      </div>
    </div>
  );
};
