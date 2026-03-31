import React from 'react';

interface RevealCardProps {
  isRevealed: boolean;
  role: string | 'EMPATE';
  isImpostor: boolean;
  isCercanasMode?: boolean;
}

export const RevealCard: React.FC<RevealCardProps> = ({ isRevealed, role, isImpostor }) => {
  return (
    <div 
      className={`relative w-full max-w-sm mx-auto my-12 transform -rotate-2 z-30 transition-all duration-1000 ${isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95 translate-y-12'}`}
    >
      {/* Background Glow */}
      <div className={`absolute -inset-2 blur-2xl opacity-20 rounded-4xl pointer-events-none ${isImpostor ? 'bg-danger' : 'bg-primary'}`}></div>

      <div className="bg-white border-8 border-ink rounded-4xl p-1 shadow-hard-xl overflow-hidden">
        {/* Header Strip */}
        <div className={`h-12 flex items-center px-6 justify-between ${isImpostor ? 'bg-danger' : 'bg-ink'}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-mono text-[10px] text-white font-black uppercase tracking-widest">
              Identity Protocol: 0x{Math.floor(Math.random() * 1000)}
            </span>
          </div>
          <div className="w-4 h-4 bg-white/20 rounded-sm"></div>
        </div>

        <div className="bg-paper p-8 flex flex-col items-center justify-center relative">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none pattern-grid-sm"></div>

          <p className="font-mono text-[10px] text-ink/40 uppercase tracking-[0.4em] mb-4 relative z-10">Analizando Sujeto...</p>
          
          <div className="relative z-10 py-4 flex flex-col items-center">
            <span className={`font-mono text-[10px] font-black uppercase mb-2 ${isImpostor ? 'text-danger' : 'text-primary'}`}>
              {isImpostor ? '[ AMENAZA IDENTIFICADA ]' : '[ SUJETO AUTORIZADO ]'}
            </span>
            <h1 className={`font-display text-6xl md:text-7xl tracking-tighter uppercase drop-shadow-sm animate-[stamp_0.3s_ease-out_forwards] ${isImpostor ? 'text-danger italic' : 'text-ink'}`}>
              {role}
            </h1>
          </div>

          <div className="w-full h-1 bg-ink/10 my-6 rounded-full overflow-hidden relative">
            <div className={`h-full animate-progress-fast ${isImpostor ? 'bg-danger' : 'bg-primary'}`}></div>
          </div>

          <div className="flex gap-4 w-full">
            <div className="flex-1 bg-ink/5 rounded-xl p-3 border-2 border-ink/5">
              <div className="font-mono text-[8px] uppercase text-ink/40 mb-1">Confianza</div>
              <div className="font-display text-xl text-ink">99.8%</div>
            </div>
            <div className="flex-1 bg-ink/5 rounded-xl p-3 border-2 border-ink/5">
              <div className="font-mono text-[8px] uppercase text-ink/40 mb-1">Origen</div>
              <div className="font-display text-xl text-ink">Sector-01</div>
            </div>
          </div>
        </div>
        
        {/* Footer Bar */}
        <div className="bg-ink/5 h-8 flex items-center px-6 justify-center">
          <span className="font-mono text-[8px] text-ink/30 uppercase tracking-[0.5em]">Confirmación de Rol Completada</span>
        </div>
      </div>

      {/* Side Decorative Tape */}
      <div className="absolute -top-4 -left-4 w-24 h-8 bg-black/10 backdrop-blur-md transform -rotate-45 z-0 border border-white/20"></div>
    </div>
  );
};

