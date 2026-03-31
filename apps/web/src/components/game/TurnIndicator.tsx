import React from 'react';

interface TurnIndicatorProps {
  isClues: boolean;
  turnPlayer: any;
  isMyTurn: boolean;
  timerPercentage: number;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ isClues, turnPlayer, isMyTurn, timerPercentage }) => {
  if (!isClues) return null;

  if (!turnPlayer) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-ink/5 flex flex-col items-center gap-2 shrink-0 animate-in fade-in duration-500">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary text-center">
          ¡Todas las pistas enviadas! Prepárate para el debate...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-ink/5 flex flex-col items-center gap-2 shrink-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
        Turno de: <span className="text-secondary">{isMyTurn ? 'Ti' : turnPlayer.nickname}</span>
      </p>
      <div className="w-48 h-1.5 bg-ink/5 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${isMyTurn ? 'bg-primary' : 'bg-secondary'}`}
          style={{ width: `${timerPercentage}%` }}
        />
      </div>
    </div>
  );
};
