import React from 'react';
import HourglassBottomIcon from '../icons/hourglass-bottom';
import SendIcon from '../icons/send';

interface PlayingFooterProps {
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isClues: boolean;
  isDiscussing: boolean;
  isMyTurn: boolean;
  charLimit: number;
  timerPercentage: number;
  isDesktop?: boolean;
}

export const PlayingFooter: React.FC<PlayingFooterProps> = ({
  input, setInput, onSubmit, isClues, isDiscussing, isMyTurn, charLimit, timerPercentage: _timerPercentage, isDesktop
}) => {
  const charCount = input.length;
  const overLimit = charCount > charLimit;

  if (isClues && !isMyTurn) {
    return (
      <footer className={isDesktop ? "w-full" : "p-6 bg-white border-t border-ink/5 shadow-[0_-4px_20px_rgba(43,45,66,0.05)] rounded-t-[32px] z-20"}>
        <div className="bg-ink/5 border-2 border-dashed border-ink/10 py-5 px-6 rounded-2xl flex items-center justify-center gap-3 opacity-60">
          <HourglassBottomIcon className="w-5 h-5 text-ink/20 animate-spin-slow" />
          <p className="font-bold uppercase tracking-widest text-[10px] text-ink/40 text-center">
             Preparando el debate...
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className={isDesktop ? "w-full" : "p-6 bg-white border-t border-ink/5 shadow-[0_-4px_20px_rgba(43,45,66,0.05)] rounded-t-[32px] z-20"}>
      <form onSubmit={onSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isClues ? 'ESCRIBE TU PISTA...' : 'ESCRIBE TU ACUSACIÓN...'}
            maxLength={charLimit}
            className={`w-full bg-paper border-2 ${overLimit ? 'border-danger' : 'border-ink/5'} shadow-inner-hard px-4 py-3 pr-12 rounded-btn font-bold tracking-wide text-sm focus:outline-none ${isDiscussing ? 'focus:border-danger' : 'focus:border-primary'} transition-colors placeholder:normal-case`}
          />

          {/* Character Limit Indicator */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-ink/5" strokeWidth="4"></circle>
              <circle
                cx="18" cy="18" r="16" fill="none"
                className={`${(charCount / charLimit) > 0.8 ? 'stroke-danger' : 'stroke-ink/20'} transition-all`}
                strokeWidth="4"
                strokeDasharray="100"
                strokeDashoffset={100 - Math.min(100, (charCount / charLimit) * 100)}
              />
            </svg>
          </div>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || overLimit}
          className={`w-12 h-12 ${isDiscussing ? 'bg-danger' : 'bg-primary'} text-white rounded-btn shadow-hard flex items-center justify-center active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-30`}
        >
          <SendIcon className="w-6 h-6" />
        </button>
      </form>
    </footer>
  );
};
