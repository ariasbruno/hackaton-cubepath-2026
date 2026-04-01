import React from 'react';
import HourglassBottomIcon from '../icons/hourglass-bottom';
import { Avatar } from '../ui/Avatar';

interface LobbyFooterProps {
  players: any[];
  isHost: boolean;
  isStarting: boolean;
  canStart: boolean;
  onStart: () => void;
  mode?: string;
}

export const LobbyFooter: React.FC<LobbyFooterProps> = ({
  players,
  isHost,
  isStarting,
  canStart,
  onStart,
  mode = 'TRADICIONAL',
}) => {
  const bgColor = mode === 'CERCANAS' ? 'bg-secondary' : mode === 'CAOS' ? 'bg-purple' : 'bg-primary';

  return (
    <footer className="p-4 md:px-8 bg-white border-t-2 border-ink/5 pt-4 pb-8 md:pb-4 shadow-[0_-10px_40px_rgba(43,45,66,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-30">
      
      {/* Players Info (Desktop only) */}
      <div className="hidden md:flex items-center gap-4">
        <div className="flex -space-x-3">
          {players.slice(0, 5).map((player: any) => (
            <div key={player.id} className="relative z-10 rounded-full ring-2 ring-white">
              <Avatar avatarId={player.avatarId} bgColor={player.avatarColor} size="sm" />
            </div>
          ))}
          {players.length > 5 && (
            <div className="relative z-0 w-8 h-8 rounded-full ring-2 ring-white bg-paper flex items-center justify-center text-xs font-bold text-ink/50">
              +{players.length - 5}
            </div>
          )}
        </div>
        <div className="text-sm font-bold uppercase tracking-widest text-ink/50">
          <span className="text-ink">{players.length}</span> Jugadores
        </div>
      </div>

      <div className="w-full md:w-auto md:min-w-[288px] flex flex-col items-center gap-2">
        {isHost ? (
          <>
            <button
              onClick={onStart}
              disabled={isStarting || !canStart}
              className={`w-full block ${bgColor} text-white font-display text-2xl py-4 md:py-3.5 rounded-btn shadow-hard active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest text-center relative overflow-hidden group disabled:opacity-50 disabled:pointer-events-none`}
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-btn"></div>
              <span className="relative z-10 font-bold">
                {isStarting ? 'Preparando...' : 'Iniciar Partida'}
              </span>
            </button>
            {!canStart && (
              <p className="text-[11px] font-bold uppercase tracking-widest text-ink/40 text-center">
                {mode === 'CAOS' ? '⚡ Se necesitan al menos 4 jugadores' : 'Se necesitan al menos 3 jugadores'}
              </p>
            )}
          </>
        ) : (
          <div className="w-full bg-paper border-2 border-dashed border-ink/10 py-4 md:py-3 rounded-btn flex flex-col items-center justify-center gap-2 opacity-60">
            <HourglassBottomIcon className="w-4 h-4 text-ink/20 animate-spin-slow" />
            <p className="font-bold uppercase tracking-widest text-[12px] text-ink/40 text-center px-4 m-0">
              Esperando a que el host inicie...
            </p>
          </div>
        )}
      </div>
    </footer>
  );
};
