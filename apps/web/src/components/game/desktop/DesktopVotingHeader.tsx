import React from 'react';
import TimerIcon from '../../icons/timer';

interface DesktopVotingHeaderProps {
  secondsLeft: number;
  needsConfirmation: boolean;
  hasVoted: boolean;
  progress: number;
}

export const DesktopVotingHeader: React.FC<DesktopVotingHeaderProps> = ({ secondsLeft, needsConfirmation, hasVoted, progress }) => {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs < 10 ? '0' : ''}${rs}`;
  };

  return (
    <header className="hidden md:flex bg-white rounded-3xl border-2 border-ink/5 p-4 px-6 shadow-hard-sm items-center justify-between w-full relative z-30">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <span className="font-display text-2xl leading-none uppercase tracking-tight text-ink">
            Fase de Votación
          </span>
          <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] mt-1 text-secondary">
            ¿Quién es el impostor?
          </span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        {/* Voting Progress Status */}
        <div className="flex flex-col items-center mr-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1">
            {(!needsConfirmation && hasVoted)
              ? 'Voto confirmado'
              : (hasVoted ? 'Cambio detectado' : 'Estado de Votación')}
          </span>
          <div className="w-48 h-3 bg-ink/5 rounded-full overflow-hidden border border-ink/10 shadow-[inset_4px_4px_0px_rgba(0,0,0,0.1)]">
            <div
              className={`h-full transition-all duration-1000 linear rounded-full ${!needsConfirmation && hasVoted ? 'bg-secondary' : 'bg-danger'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1">
            Tiempo Restante
          </span>
          <div className={`px-6 py-2 rounded-full border-2 flex items-center gap-3 shadow-hard-sm ${secondsLeft <= 10 ? 'bg-danger-muted border-danger text-danger' : 'bg-secondary-muted border-secondary text-secondary'}`}>
            <TimerIcon className="w-5 h-5" />
            <span className={`font-mono font-black text-lg leading-none ${secondsLeft <= 10 ? 'text-danger' : 'text-secondary'}`}>
              {formatTime(secondsLeft)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
