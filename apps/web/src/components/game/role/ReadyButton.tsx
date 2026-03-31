import React from 'react';

interface ReadyButtonProps {
  onConfirm: () => void;
  confirmed: boolean;
  readyPlayers: number;
  totalPlayers: number;
  isInfiltrado?: boolean;
}

export const ReadyButton: React.FC<ReadyButtonProps> = ({ 
  onConfirm, 
  confirmed, 
  readyPlayers, 
  totalPlayers,
  isInfiltrado 
}) => {
  return (
    <footer className="py-6 w-full">
      <button
        onClick={onConfirm}
        disabled={confirmed}
        className={`w-full block font-display text-2xl py-6 rounded-btn shadow-hard active:translate-y-1 transition-all uppercase tracking-widest text-center ${confirmed
          ? isInfiltrado ? 'bg-white/20 text-white/40 shadow-none scale-95' : 'bg-paper text-ink/20 shadow-none scale-95'
          : isInfiltrado ? 'bg-white text-accent hover:bg-white/90' : 'bg-ink text-white hover:bg-ink/90'
        }`}
      >
        {confirmed ? 'Listos' : 'Listo'}
      </button>
      <p className={`mt-4 text-[10px] font-bold uppercase tracking-[0.2em] ${isInfiltrado ? 'text-white/60' : 'text-ink/40'} text-center`}>
        {readyPlayers} de {totalPlayers} JUGADORES LISTOS
      </p>
    </footer>
  );
};
