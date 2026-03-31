import React from 'react';

interface RevealInfoProps {
  isRevealed: boolean;
  targetPlayer: any | null;
  isImpostor: boolean;
  remainingImpostors: number;
  isCercanasMode?: boolean;
}

export const RevealInfo: React.FC<RevealInfoProps> = ({ isRevealed, targetPlayer, isImpostor, remainingImpostors, isCercanasMode }) => {
  return (
    <div className={`mt-10 text-center max-w-xs mx-auto z-20 transition-all duration-1000 delay-700 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="bg-slate-900/40 backdrop-blur-xl border-2 border-slate-700/50 p-6 rounded-3xl shadow-hard-sm relative overflow-hidden group">
        {/* Subtle decorative line */}
        <div className={`absolute top-0 left-0 w-1 h-full ${isImpostor ? 'bg-danger' : 'bg-primary'}`}></div>
        
        {targetPlayer ? (
          <div className="space-y-3">
            <p className="font-body text-slate-300 text-lg leading-tight">
              <span className="font-display text-white uppercase italic tracking-tighter">{targetPlayer.nickname}</span> 
              <span className="opacity-60 text-base block mt-1">era {isImpostor ? (isCercanasMode ? 'el Infiltrado' : 'un Impostor') : 'un Agente'}</span>
            </p>
            
            <div className="pt-2">
              <span className={`font-mono text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border border-white/10 bg-white/5 ${isImpostor && remainingImpostors > 0 ? 'text-danger border-danger/30' : 'text-slate-400'}`}>
                {remainingImpostors === 1 
                  ? (isCercanasMode ? 'Falta 1 Infiltrado' : 'Falta 1 Impostor') 
                  : (isCercanasMode ? `${remainingImpostors} Infiltrados Restantes` : `${remainingImpostors} Impostores Restantes`)}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="font-display text-white uppercase italic tracking-tighter text-xl">Protocolo de Supervivencia</p>
            <p className="font-body text-slate-400 text-sm">Sin decisión unánime. Todos los jugadores continúan operativos.</p>
          </div>
        )}
      </div>
    </div>
  );
};

