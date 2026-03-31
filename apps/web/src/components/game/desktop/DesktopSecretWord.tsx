import React, { useState } from 'react';
import VisibilityIcon from '../../icons/visibility';
import VisibilityOffIcon from '../../icons/visibility-off';

interface DesktopSecretWordProps {
  player: any;
  mode?: string;
}

// @ts-ignore - Mode planned for future theme extensions
export const DesktopSecretWord: React.FC<DesktopSecretWordProps> = ({ player, mode = 'TRADICIONAL' }) => {
  const [isHidden, setIsHidden] = useState(true);

  if (!player) return null;

  const isImpostor = player.role === 'IMPOSTOR' || player.role === 'INFILTRADO';
  const roleTitle = isImpostor ? 'TU ROL' : 'TU PALABRA SECRETA';
  const displayedTitle = isHidden ? 'TU ROL' : roleTitle;
  const displayWord = isImpostor ? (player.role === 'IMPOSTOR' ? 'EL IMPOSTOR' : player.word) : player.word;
  const subtitle = isImpostor 
    ? (player.role === 'INFILTRADO' ? 'Tienes una palabra diferente. Encuentra la impostora.' : 'No tienes palabra, ¡finge y adivínala!')
    : 'No dejes que el impostor descubra esta palabra.';

  // Neutral subtle background pattern via simple radial gradients
  return (
    <div className="bg-white rounded-3xl border-2 border-ink/5 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-hard-sm">
      
      {/* Background illustration pseudo-element (neutral circles/dots instead of pizza) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center">
         <div className="w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,#000_2px,transparent_2.5px)] bg-size-[24px_24px] rotate-12" />
      </div>

      <div className="flex items-center gap-2 mb-4 relative z-10">
        <button
          onClick={() => setIsHidden(!isHidden)}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer hover:scale-110 active:scale-95 ${
            isImpostor 
              ? isHidden ? 'bg-ink/10 text-ink/40' : 'bg-danger/10 text-danger hover:bg-danger hover:text-white' 
              : isHidden ? 'bg-ink/10 text-ink/40' : 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white'
          }`}
          title={isHidden ? "Mostrar palabra" : "Ocultar palabra"}
        >
          {isHidden ? <VisibilityOffIcon className="w-4 h-4" /> : <VisibilityIcon className="w-4 h-4" />}
        </button>
        <span className={`font-bold text-xs uppercase tracking-widest ${
          isHidden ? 'text-ink/40' : isImpostor ? 'text-danger' : 'text-secondary'
        }`}>
          {displayedTitle}
        </span>
      </div>

      <h2 className={`font-display text-5xl md:text-6xl uppercase tracking-tighter mb-4 relative z-10 transition-all duration-300 ${
        isHidden ? 'blur-md opacity-20 select-none text-ink' : isImpostor && player.role === 'IMPOSTOR' ? 'text-danger' : 'text-ink'
      }`}>
        {isHidden ? 'OCULTO' : displayWord}
      </h2>

      <p className={`text-xs italic font-medium relative z-10 transition-opacity duration-300 ${isHidden ? 'opacity-0' : 'text-ink/40'}`}>
        {subtitle}
      </p>

    </div>
  );
};
