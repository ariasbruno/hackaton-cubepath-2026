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
      <h2 className={`font-display text-xl uppercase tracking-tight ${accentColor} flex items-center gap-2 px-1`}>
        <AnalyticsIcon className="w-6 h-6" />
        Tabla de Puntuación
      </h2>
      
      <div className="bg-white rounded-card border-2 border-ink/5 shadow-hard overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[320px]">
            <thead>
              <tr className="bg-ink/2 border-b border-ink/10">
                <th className="py-4 px-4 font-display text-[8px] text-ink-muted uppercase tracking-widest">Jugador</th>
                <th className="py-4 px-1 text-center font-display text-[8px] text-ink-muted uppercase tracking-widest">Ag.(P)</th>
                <th className="py-4 px-1 text-center font-display text-[8px] text-ink-muted uppercase tracking-widest">Pts</th>
                <th className="py-4 px-1 text-center font-display text-[8px] text-ink-muted uppercase tracking-widest">
                  {mode === 'CERCANAS' ? 'Infil.(P)' : 'Imp.(P)'}
                </th>
                <th className="py-4 px-1 text-center font-display text-[8px] text-ink-muted uppercase tracking-widest">Pts</th>
                <th className={`py-4 px-4 text-center font-display text-[8px] ${accentColor} uppercase tracking-widest`}>Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {[...(players || [])]
                .sort((a, b) => (b.pointsEarned || 0) - (a.pointsEarned || 0))
                .map((p: any) => (
                  <tr key={p.id} className="group hover:bg-paper/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[10px] truncate max-w-[120px]">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{p.nickname}</span>
                        {p.id === hostId && (
                          <CrownIcon className="w-4 h-4 text-yellow shrink-0" />
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-1 text-center text-[10px] font-bold text-ink/60">{p.agentGames || 0}</td>
                    <td className="py-3.5 px-1 text-center text-[10px] font-bold text-ink/60">{p.agentPoints || 0}</td>
                    <td className="py-3.5 px-1 text-center text-[10px] font-bold text-ink/60">{p.impostorGames || 0}</td>
                    <td className="py-3.5 px-1 text-center text-[10px] font-bold text-ink/60">{p.impostorPoints || 0}</td>
                    <td className={`py-3.5 px-4 text-center text-xs font-display ${accentColor}`}>
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
