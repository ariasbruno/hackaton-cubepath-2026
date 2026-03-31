import React from 'react';
import { RoomCard } from './RoomCard';
import AddCircleIcon from '../icons/add-circle';
import SearchOffIcon from '../icons/search-off';

interface PublicRoomsListProps {
  rooms: any[];
  onJoin: (code: string) => void;
  onCreateRoom: () => void;
}

export const PublicRoomsList: React.FC<PublicRoomsListProps> = ({ rooms, onJoin, onCreateRoom }) => {
  return (
    <section className="space-y-3 pb-8 flex-1 flex flex-col min-h-0">
      <div className="flex items-center justify-between px-1">
        <h3 className="font-display text-lg uppercase tracking-tight text-ink/40">
          Salas Públicas ({rooms.length})
        </h3>
        <button 
          onClick={onCreateRoom}
          className="flex items-center gap-2 px-4 py-1.5 bg-white border-2 border-ink/5 rounded-btn shadow-hard hover:shadow-none hover:translate-y-0.5 transition-all group active:scale-95"
        >
          <AddCircleIcon className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-300" />
          <span className="font-bold text-[10px] uppercase tracking-widest text-ink/60 whitespace-nowrap">Crear Sala</span>
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-ink/20 flex-1">
          <SearchOffIcon className="w-9 h-9 mb-3" />
          <p className="text-sm font-bold uppercase tracking-widest">
            No hay salas disponibles
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.code} room={room} onJoin={onJoin} />
          ))}
        </div>
      )}
    </section>
  );
};
