import React from 'react';
import { Heading } from '../ui/Typography';
import { Button } from '../ui/Button';
import MicIcon from '../icons/mic';
import PersonIcon from '../icons/person';
import VoteIcon from '../icons/vote';
import ArrowForwardIcon from '../icons/arrow-forward';

interface LocalPlayingProps {
  playerName: string;
  isLast: boolean;
  onNext: () => void;
}

export const LocalPlaying: React.FC<LocalPlayingProps> = ({ playerName, isLast, onNext }) => {
  return (
    <div className="flex-1 w-full bg-paper relative overflow-hidden">
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-8 py-12 flex flex-col items-center justify-center text-center gap-10 relative z-10">
        <header className="flex flex-col items-center gap-2 relative z-10 py-4">
        <div className="inline-flex items-center justify-center px-4 py-1.5 bg-primary/10 text-primary rounded-full mb-3 shadow-none">
          <MicIcon className="w-4 h-4 mr-2" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Fase de Claves</p>
        </div>
        
        <Heading variant="h2" className="text-3xl font-display text-ink tracking-tight">
          Ronda de <span className="text-primary uppercase italic">Pistas</span>
        </Heading>
        <p className="text-[11px] text-ink/40 font-medium tracking-tight mt-1">
          Digan una palabra relacionada con la secreta.
        </p>
      </header>

      <div className="w-full relative z-10">
        <div className="relative bg-white border-2 border-primary/10 p-10 py-12 rounded-[40px] shadow-xl text-center group transition-all duration-500 hover:scale-[1.02]">
          <p className="text-[10px] font-black uppercase text-ink/30 mb-3 tracking-[0.4em]">Turno de</p>
          <Heading variant="h1" className="text-primary text-4xl sm:text-5xl font-display leading-tight tracking-tight relative z-10">
            {playerName}
          </Heading>
          
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-primary/5 group-hover:rotate-12 transition-transform">
            <PersonIcon className="w-4 h-4 text-primary" />
          </div>
        </div>
      </div>

      <div className="w-full mt-4 relative z-10">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          onClick={onNext}
          className="py-6 rounded-btn bg-primary hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20 border-none"
        >
          <span className="font-display text-lg uppercase tracking-widest text-white">
            {isLast ? 'IR A VOTACIÓN' : 'SIGUIENTE TURNO'}
          </span>
          {isLast ? (
            <VoteIcon className="w-6 h-6 ml-2 text-white" />
          ) : (
            <ArrowForwardIcon className="w-6 h-6 ml-2 text-white" />
          )}
        </Button>
        {!isLast && (
          <p className="mt-8 text-[9px] font-black text-ink/20 uppercase tracking-[0.3em] italic animate-fade-in">
            Pasa el móvil al siguiente jugador
          </p>
        )}
      </div>
      </div>
    </div>
  );
};
