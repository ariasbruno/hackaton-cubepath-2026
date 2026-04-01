import React from 'react';
import PersonSearchIcon from '../icons/person-search';
import TranslateIcon from '../icons/translate';
import BoltIcon from '../icons/bolt';
import ArrowBackIcon from '../icons/arrow-back';
import ShareIcon from '../icons/share';

interface LobbyHeaderProps {
  mode?: string;
  code: string;
  onShare: () => void;
  onBack: () => void;
}

export const LobbyHeader: React.FC<LobbyHeaderProps> = ({ mode = 'TRADICIONAL', code, onShare, onBack }) => {
  return (
    <div className="flex flex-col items-center pt-8 pb-4 relative shrink-0">
      {/* Back Button (Top Left) */}
      <button
        onClick={onBack}
        className="absolute top-8 left-0 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-hard border-2 border-ink/5 active:translate-y-0.5 active:shadow-none transition-all z-20 hover:bg-paper"
        title="Salir de la sala"
      >
        <ArrowBackIcon className="w-5 h-5" />
      </button>

      {/* Share Button (Top Right) */}
      <button
        onClick={onShare}
        className="absolute top-8 right-0 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-hard border-2 border-ink/5 active:translate-y-0.5 active:shadow-none transition-all z-20 hover:bg-paper"
        title="Compartir código"
      >
        <ShareIcon className="w-5 h-5" />
      </button>

      <div className={`${mode === 'CERCANAS' ? 'bg-secondary' : mode === 'CAOS' ? 'bg-purple' : 'bg-primary'} text-white px-4 py-1.5 rounded-full shadow-hard font-display text-[12px] uppercase tracking-[0.2em] -rotate-2 mb-6 z-10 border-2 border-white flex items-center gap-2`}>
        {mode === 'TRADICIONAL' ? <PersonSearchIcon className="w-3.5 h-3.5" /> : mode === 'CERCANAS' ? <TranslateIcon className="w-3.5 h-3.5" /> : <BoltIcon className="w-3.5 h-3.5" />}
        {mode === 'CERCANAS' ? 'Cercanas' : mode === 'CAOS' ? 'Caos' : mode}
      </div>

      <div
        className={`bg-sticky-yellow text-ink px-8 py-4 shadow-hard flex flex-col items-center justify-center relative w-56 h-28 ${mode === 'CERCANAS' ? 'pattern-checkers' : 'pattern-lines'} rotate-1 cursor-pointer active:rotate-0 transition-transform select-all`}
        style={{ borderRadius: '2px 2px 24px 2px', clipPath: 'polygon(0% 0%, 100% 0%, 100% 85%, 88% 100%, 0% 100%)' }}
        onClick={() => {
          navigator.clipboard.writeText(code);
        }}
        title="Toca para copiar código"
      >
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/20 -rotate-1 shadow-sm border-l border-r border-white/40 pointer-events-none" />
        <p className="font-display text-base opacity-60 mb-0.5 uppercase tracking-widest leading-none">Código</p>
        <h1 className="font-mono font-bold text-3xl md:text-4xl tracking-[0.2em] border-b-[3px] border-ink/10 pb-1 border-dashed uppercase">
          {code}
        </h1>
      </div>
    </div>
  );
};
