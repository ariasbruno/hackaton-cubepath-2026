import React from 'react';
import CrownIcon from '../icons/crown';
import AnalyticsIcon from '../icons/analytics';

interface ScoreboardProps {
  players: any[];
  hostId: string;
  mode?: string;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ players, hostId, mode = 'TRADICIONAL' }) => {
  const accentColor = mode === 'CERCANAS' ? 'text-secondary' : mode === 'CAOS' ? 'text-purple' : 'text-primary';

  return (
    <section className="space-y-4">
      <h2 className={`font-display text-lg uppercase tracking-tight ${accentColor} flex items-center gap-2`}>
        <AnalyticsIcon className="w-5 h-5" />
        Tabla de Puntuación
      </h2>
      
      <div className="bg-white rounded-card border-2 border-ink/5 shadow-hard overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[288px]">
            <thead>
              <tr className="bg-ink/2 border-b border-ink/10">
                <th className="py-3 px-3 md:px-4 font-display text-[8px] md:text-[10px] text-ink-muted uppercase tracking-wider md:tracking-widest">Jugador</th>
                <th className="py-3 px-1 text-center font-display text-[8px] md:text-[10px] text-ink-muted uppercase tracking-wider md:tracking-widest whitespace-nowrap">Ag (P)</th>
                <th className="py-3 px-1 text-center font-display text-[8px] md:text-[10px] text-ink-muted uppercase tracking-wider md:tracking-widest">Pts</th>
                <th className="py-3 px-1 text-center font-display text-[8px] md:text-[10px] text-ink-muted uppercase tracking-wider md:tracking-widest whitespace-nowrap">
                  {mode === 'CERCANAS' ? 'Infil' : 'Imp'} (P)
                </th>
                <th className="py-3 px-1 text-center font-display text-[8px] md:text-[10px] text-ink-muted uppercase tracking-wider md:tracking-widest">Pts</th>
                <th className={`py-3 px-3 md:px-4 text-center font-display text-[8px] md:text-[10px] ${accentColor} uppercase tracking-wider md:tracking-widest`}>Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {[...(players || [])]
                .sort((a, b) => (b.pointsEarned || 0) - (a.pointsEarned || 0))
                .map((p: any) => (
                  <tr key={p.id} className="group hover:bg-paper/50 transition-colors">
                    <td className="py-3 px-3 md:px-4 font-bold text-[10px] md:text-[11px] truncate max-w-[100px] md:max-w-[120px]">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{p.nickname}</span>
                        {p.id === hostId && (
                          <CrownIcon className="w-3.5 h-3.5 text-yellow shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-1 text-center text-[9px] md:text-[10px] font-bold text-ink/60">{p.agentGames || 0}</td>
                    <td className="py-3 px-1 text-center text-[9px] md:text-[10px] font-bold text-ink/60">{p.agentPoints || 0}</td>
                    <td className="py-3 px-1 text-center text-[9px] md:text-[10px] font-bold text-ink/60">{p.impostorGames || 0}</td>
                    <td className="py-3 px-1 text-center text-[9px] md:text-[10px] font-bold text-ink/60">{p.impostorPoints || 0}</td>
                    <td className={`py-3 px-3 md:px-4 text-center text-xs md:text-sm font-display ${accentColor}`}>
                      {p.pointsEarned || 0}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
