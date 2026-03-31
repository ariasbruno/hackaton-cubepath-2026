// @ts-nocheck
import React, { useState } from 'react';
import { TraditionalReveal } from '../../components/game/reveal/TraditionalReveal';

export const TmpImpostorReveal: React.FC = () => {
  const [scenario, setScenario] = useState<'impostor' | 'agente' | 'CERCANAS' | 'EMPATE'>('impostor');
  const [key, setKey] = useState(0);

  const players = [
    { id: '1', nickname: 'Félix', avatar: 'noto--cat-face', color: '#FF8C42', role: 'IMPOSTOR' },
    { id: '2', nickname: 'Ana', avatar: 'noto--fox', color: '#4D9DE0', role: 'AGENTE' },
    { id: '3', nickname: 'Bruno', avatar: 'noto--dog-face', color: '#9D4EDD', role: 'AGENTE' },
  ];

  const getRoomState = () => {
    switch (scenario) {
      case 'impostor':
        return {
          players,
          lastEliminatedId: '1',
          settings: { mode: 'TRADICIONAL' as const },
          secretWord: 'PERRO'
        };
      case 'agente':
        return {
          players,
          lastEliminatedId: '2',
          settings: { mode: 'TRADICIONAL' as const },
          secretWord: 'PERRO'
        };
      case 'CERCANAS':
        return {
          players: [
            { id: '1', nickname: 'Topo', avatar: '1', role: 'INFILTRADO', color: '#10b981', isAlive: false },
            { id: '2', nickname: 'Detective', avatar: '2', role: 'AGENTE', color: '#3b82f6', isAlive: true },
          ],
          lastEliminatedId: '1',
          settings: { mode: 'CERCANAS' as const }
        };
      case 'EMPATE':
      default:
        return {
          players,
          lastEliminatedId: players[0].id,
          dynamicMode: 'TRADICIONAL' as const,
          roomState: { mode: 'TRADICIONAL' as const },
          settings: { mode: 'TRADICIONAL' as const }
        };
    }
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans">
      <div key={key} className="w-full h-full">
        <TraditionalReveal roomState={getRoomState()} />
      </div>

      {/* Control Panel (Testing only) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex gap-2 bg-black/80 backdrop-blur-xl p-2 rounded-2xl border-2 border-white/10 shadow-2xl">
        <button 
          onClick={() => { setScenario('impostor'); setKey(k => k + 1); }}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            scenario === 'impostor' ? 'bg-purple text-white shadow-[0_0_15px_rgba(157,78,221,0.5)]' : 'bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          IMPOSTOR CAZADO
        </button>
        <button 
          onClick={() => { setScenario('agente'); setKey(k => k + 1); }}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            scenario === 'agente' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          ERROR TÁCTICO
        </button>
        <button 
          onClick={() => { setScenario('CERCANAS'); setKey(k => k + 1); }}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            scenario === 'CERCANAS' ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          CERCANAS
        </button>
        <button 
          onClick={() => { setScenario('EMPATE'); setKey(k => k + 1); }}
          className={`px-4 py-2 rounded-xl font-bold text-xs transition-all ${
            scenario === 'EMPATE' ? 'bg-slate-700 text-white shadow-[0_0_15px_rgba(51,65,85,0.5)]' : 'bg-white/5 text-white/40 hover:bg-white/10'
          }`}
        >
          EMPATE
        </button>
      </div>
    </div>
  );
};
