import React from 'react';
import CheckCircleIcon from '../../icons/check-circle';
import { Avatar } from '../../ui/Avatar';

interface DesktopTurnOrderProps {
  players: any[];
  turnId: string;
  myId: string;
  maxPlayers: number;
}

export const DesktopTurnOrder: React.FC<DesktopTurnOrderProps> = ({ players, turnId, myId }) => {
  // Find index of current turn to know who already played
  const currentTurnIndex = players.findIndex(p => p.id === turnId);

  // Helper to determine status
  const getStatus = (index: number) => {
    if (currentTurnIndex === -1) return 'WAITING'; // Or finished
    if (index < currentTurnIndex) return 'DONE';
    if (index === currentTurnIndex) return 'CURRENT';
    return 'WAITING';
  };

  const playersLeft = players.length - (currentTurnIndex === -1 ? players.length : currentTurnIndex);

  return (
    <div className="bg-white rounded-3xl border-2 border-ink/5 flex flex-col overflow-hidden shadow-hard-sm h-full max-h-[500px]">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-ink/5 bg-ink/5">
        <h3 className="font-bold text-[10px] uppercase tracking-widest text-ink/40">
          Orden de turnos
        </h3>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 relative custom-scrollbar">
        {players.map((p, index) => {
          const status = getStatus(index);
          const isMe = p.id === myId;
          
          return (
            <div 
              key={p.id}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 border-2 ${
                status === 'CURRENT' ? 'border-primary bg-primary/5 shadow-inner' : 'border-transparent'
              } ${status === 'WAITING' ? 'opacity-50' : ''}`}
            >
              <Avatar avatarId={p.avatar} bgColor={p.color} size="md" />
              
              <span className={`font-bold text-sm tracking-tight flex-1 ${status === 'CURRENT' ? 'text-primary' : 'text-ink'}`}>
                {p.nickname} {isMe && <span className="opacity-50 text-xs italic ml-1">(Tú)</span>}
              </span>

              {status === 'DONE' && (
                <CheckCircleIcon className="w-5 h-5 text-secondary animate-in zoom-in" />
              )}

              {status === 'CURRENT' && (
                <div className="flex gap-1 pr-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-ink/5 bg-[#F9F9F9] flex items-center gap-2">
        {playersLeft > 0 ? (
          <>
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
             <span className="font-bold text-[9px] uppercase tracking-widest text-primary">
              Faltan {playersLeft} pistas para pasar a votación
             </span>
          </>
        ) : (
          <>
             <CheckCircleIcon className="w-4 h-4 text-ink/20" />
             <span className="font-bold text-[9px] uppercase tracking-widest text-ink/40">
               Todas las pistas enviadas
             </span>
          </>
        )}
      </div>

    </div>
  );
};
