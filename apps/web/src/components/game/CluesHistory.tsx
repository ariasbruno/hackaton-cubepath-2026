import React, { useEffect, useRef } from 'react';
import HistoryIcon from '../icons/history';
import ExpandLessIcon from '../icons/expand-less';
import TimerOffIcon from '../icons/timer-off';
import RestaurantIcon from '../icons/restaurant';

interface CluesHistoryProps {
  groupedClues: any[];
  isExpanded: boolean;
  onToggle: () => void;
}

export const CluesHistory: React.FC<CluesHistoryProps> = ({
  groupedClues, isExpanded, onToggle
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [groupedClues, isExpanded]);

  if (groupedClues.length === 0) return null;

  return (
    <div className={`flex flex-col bg-white border-t-2 border-dashed border-ink/10 transition-all duration-300 ${isExpanded ? 'max-h-[50%]' : 'max-h-[56px]'}`}>
      <header
        onClick={onToggle}
        className="px-6 py-4 bg-paper border-b border-ink/5 flex items-center justify-between cursor-pointer active:bg-ink/5 transition-colors shrink-0"
      >
        <div className="flex items-center gap-3">
          <HistoryIcon className="w-4 h-4 text-ink/40" />
          <h3 className="font-display text-[10px] text-ink/40 uppercase tracking-widest">Historial de Pistas</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-extrabold uppercase opacity-30 tracking-tighter">
            {isExpanded ? 'Presiona para ocultar' : 'Presiona para ver más'}
          </span>
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <ExpandLessIcon className="w-4 h-4 text-ink/20" />
          </div>
        </div>
      </header>

      {isExpanded && (
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6"
        >
          {groupedClues.map((group, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`${idx % 2 === 0 ? 'bg-primary' : 'bg-secondary'} text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm uppercase`}>
                  {group.title}
                </span>
                <div className="flex-1 h-px bg-ink/5"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {group.clues.map((clue: any, cidx: number) => (
                  <div key={cidx} className={`bg-paper p-3 rounded-btn border border-ink/5 shadow-hard-sm relative overflow-hidden group ${clue.isMissed ? 'opacity-30 grayscale' : ''}`}>
                    <div className="absolute -right-2 -bottom-2 opacity-5 text-ink group-hover:rotate-12 transition-transform">
                      {clue.isMissed ? <TimerOffIcon className="w-9 h-9" /> : <RestaurantIcon className="w-9 h-9" />}
                    </div>
                    <p className="text-[8px] font-extrabold opacity-40 mb-1">{clue.nickname}</p>
                    <p className={`text-[10px] font-bold leading-tight ${clue.isMissed ? 'italic text-ink/40' : ''}`}>
                      {clue.isMissed ? 'No envió pista' : `"${clue.text || clue.clue}"`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
