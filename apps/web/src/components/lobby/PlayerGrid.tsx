import React from 'react';
import { Avatar } from '../ui/Avatar';
import CrownIcon from '../icons/crown';
import CheckCircleIcon from '../icons/check-circle';
import PersonAddIcon from '../icons/person-add';

interface PlayerGridProps {
  players: any[];
  maxPlayers: number;
  hostId: string;
  currentPlayerId: string;
  mode?: string;
}

export const PlayerGrid: React.FC<PlayerGridProps> = ({
  players,
  maxPlayers,
  hostId,
  currentPlayerId,
  mode = 'TRADICIONAL',
}) => {
  const accentColor = mode === 'CERCANAS' ? 'secondary' : mode === 'CAOS' ? 'purple' : 'primary';

  return (
    <section className="flex-1 pb-10">
      <div className="flex justify-between items-end mb-6">
        <h2 className={`font-display text-xl uppercase tracking-tight text-${accentColor}`}>En la mesa</h2>
        <span className={`bg-${accentColor}/10 text-${accentColor} text-xs font-extrabold px-3 py-1.5 rounded-full border border-${accentColor}/20 uppercase tracking-widest`}>
          {players.length} / {maxPlayers}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2">
        {players.map((p: any) => {
          const isMe = p.id === currentPlayerId;
          const isHost = p.id === hostId;
          return (
            <div key={p.id} className="flex flex-col items-center gap-2 relative">
              <div className="relative">
                <Avatar
                  avatarId={p.avatar || 'noto--bear'}
                  bgColor={p.color || '#FFD166'}
                  size="md"
                  borderColor={isMe ? `border-${accentColor}` : 'border-white'}
                />
                {isMe && <div className={`absolute inset-0 bg-${accentColor}/10 animate-pulse rounded-full pointer-events-none`}></div>}
              </div>
              {p.id === hostId ? (
                <div className="absolute -top-2 right-5 bg-[#FFD166] rounded-full border-2 border-white p-0.5 shadow-hard-sm z-30 transform rotate-12">
                  <CrownIcon className="w-3.5 h-3.5 text-white" />
                </div>
              ) : p.isReady && (
                <div className="absolute -top-1 -right-1 bg-accent rounded-full border-2 border-white p-0.5 shadow-hard-sm z-30">
                  <CheckCircleIcon className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <span className={`font-bold text-[11px] tracking-tight text-center truncate w-full ${!p.isReady && !isHost ? 'opacity-40 italic' : ''}`}>
                {p.nickname}{isMe ? ' (Tú)' : ''}
              </span>
            </div>
          );
        })}

        {/* Empty invitation slots */}
        {players.length < maxPlayers && (
          <div className="flex flex-col items-center gap-2 opacity-20">
            <div className="w-12 h-12 bg-ink/5 rounded-full border-4 border-dashed border-ink/10 flex items-center justify-center">
              <PersonAddIcon className="w-6 h-6 text-ink/20" />
            </div>
            <span className="font-bold text-[10px] uppercase tracking-widest text-center mt-1">Esperando...</span>
          </div>
        )}
      </div>
    </section>
  );
};
