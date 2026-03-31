import React from 'react';
import QuestionMarkIcon from '../../icons/question-mark';

interface FlipCardProps {
  word: string | undefined;
  theme: any;
  isImpostor: boolean;
  flipped: boolean;
  onFlip: () => void;
}

export const FlipCard: React.FC<FlipCardProps> = ({ word, theme, isImpostor, flipped, onFlip }) => {
  return (
    <div
      className="relative w-72 h-96 perspective-1000 cursor-pointer group shrink-0"
      onClick={onFlip}
    >
      <div className={`card-inner relative w-full h-full shadow-hard-lg rounded-card transition-all duration-700 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>

        {/* Front (Hidden State) */}
        <div className="card-front absolute inset-0 bg-primary rounded-card border-8 border-white flex flex-col items-center justify-center text-white overflow-hidden backface-hidden">
          <div className="absolute inset-0 pattern-lines opacity-20"></div>
          <div className="absolute inset-4 border-2 border-white/40 border-dashed rounded-btn"></div>
          <QuestionMarkIcon className="w-12 h-12 text-8xl mb-4 drop-shadow-md" />
          <p className="font-display text-2xl uppercase tracking-widest drop-shadow-md text-center">Tocar para<br />Revelar</p>
        </div>

        {/* Back (Role State) */}
        <div className="card-back absolute inset-0 bg-white rounded-card border-8 flex flex-col items-center justify-center p-6 backface-hidden rotate-y-180 transition-colors duration-300" style={{ borderColor: `var(--color-${theme.color})` }}>
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white text-ink px-8 py-2 rounded-full font-display font-bold text-xl shadow-hard border-4 uppercase transition-all duration-300" style={{ borderColor: `var(--color-${theme.color})`, color: `var(--color-${theme.color})` }}>
            {isImpostor ? 'Tu Rol' : 'Tu Palabra'}
          </div>

          <div className="absolute inset-0 pattern-dots opacity-5"></div>
          
          {isImpostor ? (
            <>
              <div className={`w-20 h-20 ${theme.bgColor} ${theme.textColor} rounded-full flex items-center justify-center mb-6`}>
                {theme.icon && <theme.icon className="w-12 h-12" />}
              </div>
              <h2 className={`font-display text-4xl uppercase leading-none mb-2 ${theme.textColor}`}>
                {theme.title}
              </h2>
              <div className={`w-full h-0.5 ${theme.bgColor} my-4`}></div>
              <p className="text-ink text-sm font-bold uppercase tracking-tight balance text-center">
                No conoces la palabra.<br />¡Miente e improvisa!
              </p>
            </>
          ) : (
            <>
              <p className="text-ink/40 text-xs font-bold uppercase tracking-[0.2em] mt-4 mb-2">Secreto de Estado</p>
              <h3 className={`font-display ${word && word.length > 12 ? 'text-2xl' :
                  word && word.length > 10 ? 'text-3xl' :
                    word && word.length > 7 ? 'text-4xl' :
                      'text-6xl'
                } ${theme.textColor} uppercase tracking-widest text-center transition-all duration-300`}>
                {word}
              </h3>
              <div className="p-4 mt-6 bg-ink/5 border-2 border-ink/5 rounded-btn">
                <p className="text-ink/40 text-[10px] font-bold leading-relaxed uppercase tracking-widest text-center">
                  {theme.description}
                </p>
              </div>
            </>
          )}

          <p className="mt-8 text-ink/40 text-[8px] font-bold uppercase tracking-widest">Toca de nuevo para ocultar</p>
        </div>

      </div>
      {/* Decorative Stack */}
      <div className="absolute top-2 left-2 w-full h-full bg-black/5 rounded-card -z-10 rotate-2"></div>
    </div>
  );
};
