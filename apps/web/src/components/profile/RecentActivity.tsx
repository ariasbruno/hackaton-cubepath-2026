import React from 'react';
import { Card } from '../ui/Card';

export const RecentActivity: React.FC = () => {
  return (
    <section className="space-y-4">
      <div className="flex justify-between items-end px-2">
        <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight text-ink opacity-40 md:opacity-100">
          Actividad Reciente
        </h3>
        <button className="hidden md:block text-xs font-bold text-secondary uppercase hover:underline">Historial Completo</button>
      </div>
      <Card variant="paper" borderWidth="thin" className="overflow-hidden p-0">
        <div className="hidden md:flex p-4 bg-ink/5 items-center justify-between px-8 border-b-2 border-ink/5">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink/30 w-1/3">Evento</span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink/30 text-center w-1/3">Sala</span>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-ink/30 text-right w-1/3">Resultado</span>
        </div>
        <div className="flex items-center justify-center p-8 text-ink/20">
          <p className="text-sm font-bold uppercase tracking-widest">Sin actividad aún</p>
        </div>
      </Card>
    </section>
  );
};
