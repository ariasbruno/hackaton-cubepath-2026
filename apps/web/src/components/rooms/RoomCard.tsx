import React from 'react';
import GroupsIcon from '../icons/groups';
import ArrowForwardIcon from '../icons/arrow-forward';

interface RoomCardProps {
  room: any;
  onJoin: (code: string) => void;
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onJoin }) => {
  const mode = room.settings?.mode || 'TRADICIONAL';
  const modeColor = mode === 'CERCANAS' ? 'secondary' : mode === 'CAOS' ? 'purple' : 'primary';

  return (
    <button
      onClick={() => onJoin(room.code)}
      className="w-full bg-white p-5 rounded-card shadow-hard-sm border border-ink/5 flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform text-left"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-${modeColor} text-white rounded-xl border-2 border-white shadow-hard-sm flex items-center justify-center font-display text-xl relative overflow-hidden shrink-0`}>
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, white 5px, white 10px)',
            }}
          />
          <span className="relative z-10">
            <GroupsIcon className="w-6 h-6" />
          </span>
        </div>
        <div>
          <p className="font-bold text-ink text-sm uppercase">
            {room.settings?.name || 'Sala'}
          </p>
          <p className="text-[10px] font-bold text-ink/40 uppercase">
            {room.settings?.mode || 'TRADICIONAL'} • {room.playerCount || 0}/{room.settings?.maxPlayers || 8}
          </p>
        </div>
      </div>
      <div className={`bg-paper text-ink p-3 rounded-full shadow-hard-sm border border-ink/5 group-hover:bg-${modeColor} group-hover:text-white transition-colors`}>
        <ArrowForwardIcon className="w-4 h-4" />
      </div>
    </button>
  );
};
