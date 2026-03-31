import React from 'react';

interface VotingProgressProps {
  needsConfirmation: boolean;
  hasVoted: boolean;
  progress: number;
}

export const VotingProgress: React.FC<VotingProgressProps> = ({ needsConfirmation, hasVoted, progress }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 border-b border-ink/5 flex flex-col items-center gap-2 shrink-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink/40">
        {(!needsConfirmation && hasVoted)
          ? 'Voto confirmado. Esperando...'
          : (hasVoted ? 'Cambio detectado. ¡Vuelve a confirmar!' : 'Toca un avatar para seleccionarlo')}
      </p>
      <div className="w-48 h-1.5 bg-ink/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-danger transition-all duration-1000 linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
