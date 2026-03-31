import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import PlayCircleIcon from '../icons/play-circle';

interface SavedRoomsProps {
  games: any[];
  onClear: () => void;
  onJoin: (code: string) => void;
}

export const SavedRooms: React.FC<SavedRoomsProps> = ({
  games,
  onClear,
  onJoin,
}) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const getModeColor = (mode?: string, isLocal?: boolean) => {
    const upperMode = mode?.toUpperCase();
    if (upperMode === 'TRADICIONAL') return '#FFF0E5'; // Primary-muted (Pastel orange)
    if (upperMode === 'CERCANAS') return '#EBF5FF'; // Secondary-muted (Pastel blue)
    if (upperMode === 'CAOS') return '#F5E6FF'; // Purple-muted (Pastel purple)
    return isLocal ? '#EBF5FF' : '#FFF9E5'; // Default to blue for local or yellow-muted for others
  };

  if (games.length === 0) return null;

  const handleClearRequest = () => {
    setShowClearConfirm(true);
  };

  const handleConfirmClear = () => {
    onClear();
    setShowClearConfirm(false);
  };

  return (
    <section className="shrink-0">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-ink/40 text-lg font-display uppercase tracking-tight">
          Partidas Guardadas
        </h2>
        <button 
          onClick={handleClearRequest}
          className="text-secondary font-bold text-xs uppercase hover:text-secondary/80 transition-colors"
        >
          Limpiar
        </button>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-6 pt-2 no-scrollbar -mx-6 px-6">
        {games.map((game, idx) => (
          <div 
            key={game.code || idx}
            onClick={() => onJoin(game.code)} 
            className={`sticky-note shrink-0 w-36 h-36 p-4 shadow-hard flex flex-col justify-between paper-card bg-white relative cursor-pointer hover:rotate-0 transition-transform`}
            style={{ backgroundColor: getModeColor(game.mode, game.isLocal) }}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 bg-white/30 rotate-2 backdrop-blur-sm shadow-sm border-l border-r border-white/20"></div>
            <div>
              <div className="flex justify-between items-start mb-1">
                {!game.isLocal && (
                  <span className="font-mono text-ink/50 text-[10px] block font-bold uppercase tracking-tighter">
                    CÓDIGO: {game.code}
                  </span>
                )}
                {game.isLocal && (
                  <div className="bg-primary text-white text-[6px] font-black px-1.5 py-0.5 rounded leading-none uppercase tracking-tighter">
                    LOCAL
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg leading-tight text-ink block truncate">
                  {game.name || (game.isLocal ? 'Partida Local' : 'Partida')}
                </span>
                {game.mode && (
                  <span className="text-[10px] font-black text-ink/30 uppercase tracking-widest leading-none mt-1">
                    {game.mode}
                  </span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-extrabold text-ink/40 uppercase">
                {game.timestamp ? 'Hace poco' : ''}
              </span>
              <PlayCircleIcon className="w-6 h-6 text-ink" />
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        title="¿Limpiar Historial?"
      >
        <div className="space-y-6">
          <p className="text-ink/60 text-center text-lg leading-snug">
            ¿Estás seguro de que quieres borrar <span className="text-ink font-bold">todas</span> tus partidas guardadas? Esta acción no se puede deshacer.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="danger"
              fullWidth
              size="lg"
              onClick={handleConfirmClear}
              className="h-14"
            >
              Sí, borrar todo
            </Button>
            <Button
              variant="ghost"
              fullWidth
              size="lg"
              onClick={() => setShowClearConfirm(false)}
              className="h-14 text-ink/40"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};
