// @ts-nocheck
import React, { useState } from 'react';
import { Voting } from '../Game/Voting';

const MOCK_PLAYERS = [
  { id: 'p1', nickname: 'Bruno', avatar: 'noto--bear', color: '#FFD166', role: 'AGENT' },
  { id: 'p2', nickname: 'Ivan', avatar: 'noto--fox', color: '#EF476F', role: 'IMPOSTOR' },
  { id: 'p3', nickname: 'Ana', avatar: 'noto--cat', color: '#118AB2', role: 'AGENT' },
  { id: 'p4', nickname: 'Maria', avatar: 'noto--dog', color: '#06D6A0', role: 'AGENT' },
];

export const VotingPrototype: React.FC = () => {
  const [mode, setMode] = useState<'TRADICIONAL' | 'CAOS'>('TRADICIONAL');

  const mockRoomState = {
    id: 'PROTO',
    code: 'PROTO',
    phase: 'VOTING',
    mode: mode,
    players: MOCK_PLAYERS.map(p => ({ ...p, hasVoted: false })),
    hostId: 'p1',
    settings: {
      maxPlayers: 8,
      rounds: 3,
      timers: { clues: 45, discuss: 120, voting: 60 },
      mode: mode
    },
    turnId: 'p2',
    currentRound: 1,
    timerEndAt: Date.now() + 60000,
  };

  const myPlayerId = 'p1';

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
          onClick={() => setMode('CAOS')}
          className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${
            mode === 'CAOS' ? 'bg-primary text-white border-primary' : 'bg-white text-ink border-ink/20'
          }`}
        >
          Mode: CAOS
        </button>
      </div>

      {/* Main Game Interface */}
      <div className="flex-1 flex flex-col w-full relative overflow-hidden">
        <Voting roomState={{...mockRoomState}} playerId={myPlayerId} />
      </div>
    </div>
  );
};
