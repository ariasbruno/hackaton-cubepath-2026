import React from 'react';

interface ReadyStatusProps {
  confirmed: boolean;
  progress: number;
  isInfiltrado?: boolean;
  hideBar?: boolean;
}

export const ReadyStatus: React.FC<ReadyStatusProps> = ({ confirmed, progress, isInfiltrado, hideBar }) => {
  if (hideBar) return null;

  return (
    <div className="w-full max-w-xs space-y-4">
      <p className={`${isInfiltrado ? 'text-white' : 'text-ink/40'} font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse-glow text-center`}>
        {confirmed ? 'Esperando al resto...' : 'Memorizando palabra...'}
      </p>
      {/* Thin Time Bar */}
      <div className={`w-full h-1.5 ${isInfiltrado ? 'bg-white/20' : 'bg-ink/5'} rounded-full overflow-hidden`}>
        <div
          className={`h-full ${isInfiltrado ? 'bg-white' : 'bg-primary'} transition-all duration-500 linear`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
