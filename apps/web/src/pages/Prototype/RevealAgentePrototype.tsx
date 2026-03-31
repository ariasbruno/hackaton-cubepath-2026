// @ts-nocheck
import React, { useState } from 'react';
import { VoteReveal } from '../Game/VoteReveal';

const MOCK_PLAYERS = [
  { id: 'p1', nickname: 'Bruno', avatar: 'noto--bear', color: '#FFD166', role: 'AGENT', isAlive: true },
  { id: 'p2', nickname: 'Ivan', avatar: 'noto--fox', color: '#EF476F', role: 'IMPOSTOR', isAlive: true },
  { id: 'p3', nickname: 'Ana', avatar: 'noto--cat', color: '#118AB2', role: 'AGENT', isAlive: true },
  { id: 'p4', nickname: 'Maria', avatar: 'noto--dog', color: '#06D6A0', role: 'AGENT', isAlive: true },
];

export const RevealAgentePrototype: React.FC = () => {
  const [mode, setMode] = useState<'TRADICIONAL' | 'CERCANAS'>('TRADICIONAL');

  const mockRoomState = {
    id: 'PROTO',
    code: 'PROTO',
    phase: 'VOTE_REVEAL',
    mode: mode,
    players: MOCK_PLAYERS,
    hostId: 'p1',
    settings: {
      maxPlayers: 8,
      rounds: 3,
      timers: { clues: 45, discuss: 120, voting: 60 },
      mode: mode,
    },
    turnId: 'p2',
    currentRound: 1,
    // ID of the eliminated player (an agent)
    lastEliminatedId: 'p1',
    lastEliminatedIds: ['p1'],
  };

  return (
    <div className="w-screen h-screen bg-paper flex flex-col font-sans text-ink relative overflow-hidden">
      {/* Dev Controls */}
      <div className="absolute top-2 right-2 z-50 flex gap-2">
        <button
          onClick={() => setMode('TRADICIONAL')}
          className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${
            mode === 'TRADICIONAL' ? 'bg-primary text-white border-primary' : 'bg-white text-ink border-ink/20'
          }`}
        >
          Mode: TRADICIONAL
        </button>
        <button
          onClick={() => setMode('CERCANAS')}
          className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${
            mode === 'CERCANAS' ? 'bg-primary text-white border-primary' : 'bg-white text-ink border-ink/20'
          }`}
        >
          Mode: CERCANAS
        </button>
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex flex-col w-full relative overflow-hidden">
        <VoteReveal roomState={{ ...mockRoomState }} />
      </div>
    </div>
  );
};
