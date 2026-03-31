// @ts-nocheck
import React, { useState } from 'react';
import { VoteReveal } from '../Game/VoteReveal';

const MOCK_PLAYERS = [
  { id: 'p1', nickname: 'Bruno', avatar: 'noto--bear', color: '#FFD166', role: 'VINCULADO', isAlive: true },
  { id: 'p2', nickname: 'Ivan', avatar: 'noto--fox', color: '#EF476F', role: 'DISPERSO', isAlive: true },
  { id: 'p3', nickname: 'Ana', avatar: 'noto--cat', color: '#118AB2', role: 'VINCULADO', isAlive: true },
  { id: 'p4', nickname: 'Maria', avatar: 'noto--dog', color: '#06D6A0', role: 'DISPERSO', isAlive: true },
];

export const RevealCaosRevealPrototype: React.FC = () => {
  const [winner, setWinner] = useState<'DISPERSOS' | 'CAOS'>('DISPERSOS');

  const mockRoomState = {
    id: 'PROTO',
    code: 'PROTO',
    phase: 'VOTE_REVEAL',
    mode: 'CAOS',
    players: MOCK_PLAYERS,
    hostId: 'p1',
    settings: {
      maxPlayers: 8,
      rounds: 3,
      timers: { clues: 45, discuss: 120, voting: 60 },
      mode: 'CAOS',
    },
    turnId: 'p2',
    currentRound: 1,
    // En modo caos, un descubrimiento correcto significa que se encontró a la pareja vinculada
    lastEliminatedId: 'p1', 
    lastEliminatedIds: ['p1', 'p3'], // Dos IDs significa 'hasDiscovery' = true
    secretWord: 'Computadora',
    winner: winner, 
  };

  return (
    <div className="w-screen h-screen bg-paper flex flex-col font-sans text-ink relative overflow-hidden">
      {/* Dev Controls */}
      <div className="absolute top-2 right-2 z-50 flex flex-col gap-2 items-end">
        <div className="px-3 py-1 text-xs font-bold rounded-lg border-2 bg-primary text-white border-primary mb-1">
          Simulando: Voto Exitoso Pareja VINCULADA (p1, p3)
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setWinner('DISPERSOS')}
            className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${
              winner === 'DISPERSOS' ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-ink/20'
            }`}
          >
            WIN: DISPERSOS (Atraparon)
          </button>
          <button
            onClick={() => setWinner('CAOS')}
            className={`px-3 py-1 text-xs font-bold rounded-lg border-2 ${
              winner === 'CAOS' ? 'bg-ink text-white border-ink' : 'bg-white text-ink border-ink/20'
            }`}
          >
            WIN: CAOS (Vinculados Acertaron)
          </button>
        </div>
      </div>

      {/* Main Interface */}
      <div className="flex-1 flex flex-col w-full relative overflow-hidden">
        <VoteReveal roomState={{ ...mockRoomState }} />
      </div>
    </div>
  );
};
