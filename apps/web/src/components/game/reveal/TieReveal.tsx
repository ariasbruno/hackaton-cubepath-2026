import React from 'react';

export const TieReveal: React.FC = () => {
  return (
    <div className="h-full w-full bg-slate-900 pattern-grid-lg relative overflow-hidden flex flex-col items-center justify-center animate-fade-in">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 bg-scanline opacity-[0.03] pointer-events-none z-10"></div>

      <div className="max-w-md w-full p-8 flex flex-col items-center text-center space-y-12 z-20">
        {/* Central Iconography */}
        <div className="relative">
          <div className="w-40 h-40 bg-white rounded-4xl shadow-hard-xl flex items-center justify-center border-8 border-ink transform -rotate-3 animate-[shake-hit_0.5s_ease-in-out_infinite] [animation-duration:10s]">
            <span className="material-symbols-outlined text-8xl text-ink">groups_3</span>
          </div>
          
          {/* Classified Stamp */}
          <div className="absolute -bottom-6 -right-10 animate-[stamp_0.4s_ease-out_forwards]">
            <div className="bg-ink text-white px-6 py-2 border-4 border-white shadow-hard transform rotate-12 flex flex-col items-center">
              <span className="font-display text-2xl font-black uppercase tracking-tighter leading-none italic">Indeterminado</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="inline-block bg-primary text-ink px-6 py-2 border-4 border-ink shadow-hard transform -rotate-1 rounded-xl">
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase font-black">Reporte: Empate Técnico</h2>
          </div>
          
          <h1 className="font-display text-5xl text-white leading-tight uppercase tracking-tighter drop-shadow-[0_4px_0_var(--color-ink)]">
            Votación <br /> Sin Consenso
          </h1>
          
          <p className="font-body text-slate-400 text-lg max-w-[320px] mx-auto leading-relaxed">
            La inteligencia está dividida. <br />
            No se ha logrado identificar una amenaza con la mayoría necesaria.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border-4 border-white/10 p-8 rounded-[40px] shadow-hard-xl w-full transform rotate-1 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/20">
            <div className="h-full bg-primary animate-progress-fast"></div>
          </div>
          
          <div className="flex flex-col gap-4 text-white">
            <div className="flex items-center justify-between opacity-60">
              <span className="font-mono text-[10px] uppercase tracking-widest">Protocolo</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Standby</span>
            </div>
            <div className="h-[2px] bg-white/10 w-full"></div>
            <p className="font-display text-2xl italic tracking-tighter uppercase text-primary">Todos los sujetos permanecen</p>
          </div>
        </div>

        {/* Transition Progress */}
        <div className="pt-4 opacity-40">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
              ))}
            </div>
            <p className="font-mono uppercase tracking-[0.3em] text-[10px] font-black text-white">Siguiente Fase en breve...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

