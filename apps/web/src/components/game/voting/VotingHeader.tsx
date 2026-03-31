import React from 'react';
import HowToVoteIcon from '../../icons/how-to-vote';

interface VotingHeaderProps {
  secondsLeft: number;
}

export const VotingHeader: React.FC<VotingHeaderProps> = ({ secondsLeft }) => {
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m < 10 ? '0' : ''}${m}:${rs < 10 ? '0' : ''}${rs}`;
  };

  return (
    <header className="p-6 bg-white border-b border-ink/5 flex items-center justify-between shadow-[0_4px_20px_rgba(43,45,66,0.05)] sticky top-0 z-30">
      <div className="flex flex-col">
        <h1 className="font-display text-2xl text-danger uppercase tracking-tight leading-none italic">¿Quién miente?</h1>
        <p className="text-[10px] font-extrabold uppercase opacity-40 tracking-[0.2em] mt-1">Fase de Votación</p>
      </div>
      <div className="bg-danger-muted px-4 py-2 rounded-full border-2 border-danger/10 flex items-center gap-2">
        <HowToVoteIcon className="w-4 h-4 text-danger" />
        <span className="font-mono font-bold text-danger text-sm uppercase tracking-tighter">
          {formatTime(secondsLeft)}
        </span>
      </div>
    </header>
  );
};
