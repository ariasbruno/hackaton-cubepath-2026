import React, { useState, useEffect } from 'react';
import { Avatar } from '../../ui/Avatar';

interface CaosFoundRevealProps {
  players: any[];
  lastEliminatedIds: string[];
  secretWord: string;
}

export const CaosFoundReveal: React.FC<CaosFoundRevealProps> = ({ players, lastEliminatedIds, secretWord }) => {
  const [stage, setStage] = useState<'suspense' | 'reveal'>('suspense');
  const [glitchText, setGlitchText] = useState('?');
  const exposedPlayers = players.filter(p => lastEliminatedIds.includes(p.id));

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
    <div className={`h-full w-full fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000 ${stage === 'suspense' ? 'bg-[#0a0a0c]' : 'bg-[#7f1d1d]'
      }`}>

      {/* Techno-Glitch Scanline Overlay (Standardized) */}
      {stage === 'suspense' && (
        <div className="absolute inset-x-0 h-[2px] bg-indigo-500/30 blur-[1px] z-10 pointer-events-none animate-scanline"></div>
      )}

      {/* Dynamic Background Patterns (Standardized) */}
      <div className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000 ${stage === 'suspense' ? 'pattern-dots bg-indigo-500/20' : 'pattern-checkers-danger'
        }`}></div>

      {/* Cinematic Spotlight (Standardized) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[60%] blur-[120px] transition-all duration-1000 ${stage === 'suspense' ? 'bg-indigo-600/30 scale-100' : 'bg-red-500/40 scale-125 opacity-100'
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

        {/* Reveal Title & Stamp (Distinct Victory/Defeat) */}
        {stage === 'reveal' && (
          <div className="relative mb-12">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 animate-[stamp_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
              <div className="bg-white text-red-800 px-6 py-2 border-4 border-red-800 shadow-hard transform -rotate-3">
                <span className="font-display text-3xl md:text-4xl uppercase italic tracking-tighter">VÍNCULO EXPUESTO</span>
              </div>
            </div>
            <h1 className="font-display text-7xl md:text-8xl text-white uppercase tracking-tighter italic leading-[0.8] drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] pt-6">
              ¡CAZADOS!
            </h1>
          </div>
        )}

        {/* Exposed Players Roster */}
        <div className="grid grid-cols-2 gap-12 relative py-12 w-full max-w-sm">
          {exposedPlayers.map((partner, idx) => (
            <div key={partner.id} className="flex flex-col items-center gap-4 group">
              <div className={`relative transition-all duration-700 ${stage === 'reveal' ? 'animate-[uncover_0.6s_ease-out_forwards]' : 'scale-90 opacity-0'}`} style={stage === 'reveal' ? { animationDelay: `${idx * 0.2}s`, animationFillMode: 'forwards' } : {}}>
                {stage === 'suspense' ? (
                  <div className="w-24 h-24 rounded-lg bg-indigo-500/5 border-2 border-indigo-500/40 flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]">
                    <div className="absolute inset-0 bg-linear-to-b from-indigo-500/10 to-transparent"></div>
                    <span className="font-display text-5xl text-indigo-400/80 animate-glitch">{glitchText}</span>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-indigo-500/30 animate-scanline"></div>
                  </div>
                ) : (
                  <Avatar
                    avatarId={partner?.avatar || (idx === 0 ? '1' : '2')}
                    bgColor={partner?.color || '#FF4D4D'}
                    size="xl"
                    borderColor="border-white"
                    className="shadow-hard scale-110 grayscale-[0.5] hover:grayscale-0 transition-all duration-300"
                    badge={
                      <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-[shake-hit_1s_infinite]">
                        <span className="material-symbols-outlined text-white text-xl">close</span>
                      </div>
                    }
                  />
                )}
              </div>
              <div className={`h-8 transition-all duration-300 ${stage === 'reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h3 className="font-display text-xl text-white uppercase tracking-wider line-clamp-1">{partner?.nickname || '---'}</h3>
              </div>
            </div>
          ))}

          {/* Connection Visual (Broken Link Effect) */}
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-20 flex items-center justify-center pointer-events-none">
            <div className={`h-[4px] bg-linear-to-r from-transparent via-red-300/40 to-transparent transition-all duration-1000 ${stage === 'reveal' ? 'w-full opacity-100 blur-[1px]' : 'w-0 opacity-0'}`}></div>
            <div className={`absolute material-symbols-outlined text-red-300 text-3xl transition-all duration-700 ${stage === 'reveal' ? 'scale-125 rotate-45 opacity-100' : 'scale-0 rotate-180 opacity-0'}`}>link_off</div>
          </div>
        </div>

        {/* Secret Word Card: The Exposure (Distinct) */}
        <div className={`w-full transition-all duration-1000 delay-500 ${stage === 'reveal' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
          <div className="bg-white/10 backdrop-blur-xl rounded-4xl p-10 border-4 border-white/20 shadow-hard-xl relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10">
              <span className="material-symbols-outlined text-9xl text-white">warning</span>
            </div>
            <p className="text-[11px] uppercase font-black tracking-[0.4em] text-white/60 leading-none mb-6">Su Palabra Clave era</p>
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl font-display font-bold uppercase italic tracking-widest text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
                {secretWord}
              </h2>
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-red-600 rounded-full animate-[line-draw_0.8s_ease-out_1.2s_forwards] opacity-0"></div>
            </div>
            
            {/* Warning Message */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <p className="text-[10px] text-red-300/80 font-mono tracking-widest uppercase">Brecha de Seguridad Detectada</p>
            </div>
          </div>
        </div>

        {/* Transition Footer (Simple status, no button) */}
        <div className={`mt-auto pt-16 transition-opacity duration-1000 ${stage === 'reveal' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-3 text-white/50">
            <div className="w-4 h-4 border-2 border-white/30 border-t-red-500 rounded-full animate-spin" />
            <p className="font-mono uppercase tracking-[0.3em] text-[10px] font-black">Finalizando Cacería...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

