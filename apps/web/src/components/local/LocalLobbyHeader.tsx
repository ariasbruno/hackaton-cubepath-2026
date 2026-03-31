import React from 'react';
import PersonSearchIcon from '../icons/person-search';
import TranslateIcon from '../icons/translate';
import BoltIcon from '../icons/bolt';
import ArrowBackIcon from '../icons/arrow-back';
import DeleteIcon from '../icons/delete';

interface LocalLobbyHeaderProps {
  mode?: string;
  playerCount: number;
  onBack: () => void;
  onDelete: () => void;
}

export const LocalLobbyHeader: React.FC<LocalLobbyHeaderProps> = ({ 
  mode = 'TRADICIONAL', 
  onBack, 
  onDelete 
}) => {
  return (
    <div className="flex flex-col items-center pt-8 pb-4 relative shrink-0">
      {/* Back Button (Top Left) */}
      <button
        onClick={onBack}
        className="absolute top-8 left-6 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-hard border-2 border-ink/5 active:translate-y-0.5 active:shadow-none transition-all z-10 hover:bg-paper"
        title="Volver"
      >
        <ArrowBackIcon className="w-6 h-6" />
      </button>

      {/* Delete/Reset Button (Top Right) */}
      <button
        onClick={onDelete}
        className="absolute top-8 right-6 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-hard border-2 border-ink/5 active:translate-y-0.5 active:shadow-none transition-all z-10 hover:bg-paper text-danger"
        title="Eliminar partida"
      >
        <DeleteIcon className="w-6 h-6" />
      </button>

      {/* Mode Badge */}
      <div className={`${mode === 'CERCANAS' ? 'bg-secondary' : mode === 'CAOS' ? 'bg-purple' : 'bg-primary'} text-white px-6 py-2 rounded-full shadow-hard font-display text-sm uppercase tracking-[0.2em] -rotate-2 mb-6 z-10 border-2 border-white flex items-center gap-2`}>
        {mode === 'TRADICIONAL' ? <PersonSearchIcon className="w-5 h-5" /> : mode === 'CERCANAS' ? <TranslateIcon className="w-5 h-5" /> : <BoltIcon className="w-5 h-5" />}
        {mode === 'CERCANAS' ? 'Cercanas' : mode === 'CAOS' ? 'Caos' : 'Tradicional'}
      </div>


    </div>
  );
};
