import React, { useState, useEffect } from 'react';

interface CaosNotFoundRevealProps {
  // No players revealed in a tie
}

export const CaosNotFoundReveal: React.FC<CaosNotFoundRevealProps> = () => {
  const [stage, setStage] = useState<'suspense' | 'reveal'>('suspense');
  const [glitchText, setGlitchText] = useState('?');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('reveal');
    }, 3000);

    // Standardized Glitch effect for placeholders during suspense
    const glitchInterval = setInterval(() => {
      if (stage === 'suspense') {
        const chars = '?!01X#&@';
        setGlitchText(chars[Math.floor(Math.random() * chars.length)]);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      clearInterval(glitchInterval);
    };
  }, [stage]);

  return (
    <div className={`h-full w-full fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000 ${stage === 'suspense' ? 'bg-[#0a0a0c]' : 'bg-[#0f172a]'
      }`}>

      {/* Techno-Glitch Scanline Overlay (Standardized) */}
      {stage === 'suspense' && (
        <div className="absolute inset-x-0 h-[2px] bg-indigo-500/30 blur-[1px] z-10 pointer-events-none animate-scanline"></div>
      )}

      {/* Dynamic Background Patterns (Standardized) */}
      <div className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000 ${stage === 'suspense' ? 'pattern-dots bg-indigo-500/20' : 'pattern-hexagons bg-slate-500/10'
        }`}></div>

      {/* Cinematic Spotlight (Standardized) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[60%] blur-[120px] transition-all duration-1000 ${stage === 'suspense' ? 'bg-indigo-600/30 scale-100' : 'bg-blue-900/40 scale-125 opacity-100'
        }`}></div>

      <main className={`relative z-50 flex flex-col items-center w-full max-w-lg px-6 text-center ${stage === 'reveal' ? 'animate-[shake-hit_0.5s_ease-in-out]' : ''
        }`}>

        {/* Suspense Header: Techno Grade (Standardized) */}
        {stage === 'suspense' && (
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/30 backdrop-blur-md animate-glitch">
              <span className="material-symbols-outlined text-indigo-400 text-lg animate-spin">bolt</span>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-300">Crackeando Señal...</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tighter italic opacity-90 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              Accediendo <br /> Al Vínculo
            </h1>
          </div>
        )}

        {/* Reveal Title & Stamp (Distinct Tie) */}
        {stage === 'reveal' && (
          <div className="relative mb-12">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 animate-[stamp_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
              <div className="bg-white text-slate-800 px-6 py-2 border-4 border-slate-800 shadow-hard transform -rotate-2">
                <span className="font-display text-3xl md:text-4xl uppercase italic tracking-tighter">SIN RASTROS</span>
              </div>
            </div>
            <h1 className="font-display text-7xl md:text-8xl text-white uppercase tracking-tighter italic leading-[0.8] drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] pt-6">
              ¡EMPATE!
            </h1>
          </div>
        )}

        {/* Mystery Roster (Classified) */}
        <div className="grid grid-cols-2 gap-12 relative py-12 w-full max-w-sm">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col items-center gap-4">
              <div className={`relative transition-all duration-700 ${stage === 'reveal' ? 'animate-[uncover_0.6s_ease-out_forwards]' : 'scale-90'}`}>
                {stage === 'suspense' ? (
                  <div className="w-24 h-24 rounded-lg bg-indigo-500/5 border-2 border-indigo-500/40 flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]">
                    <div className="absolute inset-0 bg-linear-to-b from-indigo-500/10 to-transparent"></div>
                    <span className="font-display text-5xl text-indigo-400/80 animate-glitch">{glitchText}</span>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-indigo-500/30 animate-scanline"></div>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg border-4 border-dashed border-white/20 bg-white/5 flex items-center justify-center relative overflow-hidden shadow-hard-lg">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="material-symbols-outlined text-[60px] text-white">person</span>
                    </div>
                    <span className="font-display text-5xl text-white/30 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">?</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Connection Visual (Mystery) */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-20 flex items-center justify-center pointer-events-none">
            <div className={`h-[2px] bg-linear-to-r from-transparent via-white/20 to-transparent transition-all duration-1000 ${stage === 'reveal' ? 'w-full opacity-100 blur-[1px]' : 'w-0 opacity-0'}`}></div>
          </div>
        </div>

        {/* Message Card: Classified Info */}
        <div className={`w-full transition-all duration-1000 delay-300 ${stage === 'reveal' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
          <div className="max-w-xs mx-auto p-12 border-4 border-white/10 rounded-[3rem] bg-white/5 backdrop-blur-xl relative shadow-hard-xl">
            {/* Visual Fix: Icon container now correctly positioned without clipping */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#0f172a] border-4 border-white/10 rounded-2xl flex items-center justify-center rotate-3 shadow-hard">
              <span className="material-symbols-outlined text-white text-3xl">visibility_off</span>
            </div>
            
            {/* Accent Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-500/40 rounded-full"></div>

            <p className="text-white/80 font-display text-base md:text-lg uppercase tracking-[0.2em] leading-relaxed italic drop-shadow-sm">
              Nadie ha logrado exponer el vínculo. La pareja sobrevive un turno más.
            </p>
          </div>
        </div>

        {/* Transition Footer (Button Removed) */}
        <div className={`mt-auto pt-24 pb-8 transition-all duration-1000 delay-700 ${stage === 'reveal' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-90'}`}>
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center justify-center gap-3 px-6 py-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
              <span className="font-mono text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Esperando Jugadores...</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


