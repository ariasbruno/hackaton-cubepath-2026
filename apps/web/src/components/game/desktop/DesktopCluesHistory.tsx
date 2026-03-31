import React from 'react';
import HistoryIcon from '../../icons/history';

interface DesktopCluesHistoryProps {
  groupedClues: any[];
}

export const DesktopCluesHistory: React.FC<DesktopCluesHistoryProps> = ({ groupedClues }) => {
  if (groupedClues.length === 0) {
    return (
      <div className="bg-white rounded-3xl border-2 border-ink/5 flex flex-col items-center justify-center p-8 shadow-hard-sm h-full text-center">
        <HistoryIcon className="w-10 h-10 text-ink/10 mb-4" />
        <span className="font-bold text-xs text-ink/40 uppercase tracking-widest">Aún no hay pistas</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border-2 border-ink/5 flex flex-col overflow-hidden shadow-hard-sm h-full">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-ink/5 flex flex-col bg-paper shrink-0">
         <div className="flex items-center gap-3">
            <HistoryIcon className="w-4 h-4 text-ink/40" />
            <h3 className="font-bold text-[10px] uppercase tracking-widest text-ink/40">
              Historial de Pistas
            </h3>
         </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 relative custom-scrollbar bg-[#FAFAFA]">
        {groupedClues.map((group, idx) => (
          <div key={idx} className="space-y-3">
             <div className="flex items-center gap-3">
               <span className="font-bold text-[10px] text-ink/40 uppercase tracking-widest bg-ink/5 px-3 py-1 rounded-full">
                 {group.title}
               </span>
               <div className="flex-1 h-px bg-ink/10"></div>
             </div>
             
             <div className="grid grid-cols-1 gap-2">
                {group.clues.map((clue: any, cidx: number) => (
                  <div key={cidx} className={`px-4 py-3 rounded-xl border border-ink/5 flex flex-col shadow-sm bg-white ${clue.isMissed ? 'opacity-50 grayscale' : ''}`}>
                     <span className="font-extrabold text-[10px] text-ink/40 mb-1 tracking-wider uppercase">
                        {clue.playerInfo?.nickname || clue.nickname || 'Jugador'}
                     </span>
                     <p className={`text-sm ${clue.isMissed ? 'italic text-ink/40' : 'font-medium'}`}>
                        {clue.isMissed ? 'Sanción (Tiempo agotado)' : `"${clue.text || clue.clue}"`}
                     </p>
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-ink/5 bg-paper shrink-0">
         <p className="font-bold text-[9px] uppercase tracking-widest text-ink/40">
           Mesa de Debate Oficial
         </p>
      </div>

    </div>
  );
};
