import React, { useState, useEffect } from 'react';
import { Avatar } from '../../ui/Avatar';

interface CaosPartnersWonRevealProps {
  players: any[];
  vinculadoIds: string[];
  secretWord: string;
}

export const CaosPartnersWonReveal: React.FC<CaosPartnersWonRevealProps> = ({ players, vinculadoIds, secretWord }) => {
  const [stage, setStage] = useState<'suspense' | 'reveal'>('suspense');
  const [glitchText, setGlitchText] = useState('?');
  const partners = players.filter(p => vinculadoIds.includes(p.id));

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
    <div className={`h-full w-full fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000 ${stage === 'suspense' ? 'bg-[#0a0a0c]' : 'bg-[#064e3b]'
      }`}>

      {/* Techno-Glitch Scanline Overlay (Standardized) */}
      {stage === 'suspense' && (
        <div className="absolute inset-x-0 h-[2px] bg-indigo-500/30 blur-[1px] z-10 pointer-events-none animate-scanline"></div>
      )}

      {/* Dynamic Background Patterns (Standardized) */}
      <div className={`absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-1000 ${stage === 'suspense' ? 'pattern-dots bg-indigo-500/20' : 'pattern-checkers bg-white/10'
        }`}></div>

      {/* Cinematic Spotlight (Standardized) */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[60%] blur-[120px] transition-all duration-1000 ${stage === 'suspense' ? 'bg-indigo-600/30 scale-100' : 'bg-emerald-400/40 scale-125 opacity-100'
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

        {/* Reveal Title & Stamp (Distinct Victory) */}
        {stage === 'reveal' && (
          <div className="relative mb-12">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 animate-[stamp_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
              <div className="bg-white text-emerald-800 px-6 py-2 border-4 border-emerald-800 shadow-hard transform rotate-3">
                <span className="font-display text-3xl md:text-4xl uppercase italic tracking-tighter">ALMAS UNIDAS</span>
              </div>
            </div>
            <h1 className="font-display text-7xl md:text-8xl text-white uppercase tracking-tighter italic leading-[0.8] drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] pt-6">
              ¡VICTORIA!
            </h1>
          </div>
        )}

        {/* Partners Roster */}
        <div className="grid grid-cols-2 gap-12 relative py-12 w-full max-w-sm">
          {/* Partner 1 */}
          <div className="flex flex-col items-center gap-4 group">
            <div className={`relative transition-all duration-700 ${stage === 'reveal' ? 'animate-[uncover_0.6s_ease-out_forwards]' : 'scale-90'}`}>
              {stage === 'suspense' ? (
                <div className="w-24 h-24 rounded-lg bg-indigo-500/5 border-2 border-indigo-500/40 flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]">
                  <div className="absolute inset-0 bg-linear-to-b from-indigo-500/10 to-transparent"></div>
                  <span className="font-display text-5xl text-indigo-400/80 animate-glitch">{glitchText}</span>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-indigo-500/30 animate-scanline"></div>
                </div>
              ) : (
                <Avatar
                  avatarId={partners[0]?.avatar || '3'}
                  bgColor={partners[0]?.color || '#FFD700'}
                  size="xl"
                  borderColor="border-white"
                  className="shadow-hard scale-110"
                  badge={
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                      <span className="material-symbols-outlined text-white text-xl">favorite</span>
                    </div>
                  }
                />
              )}
            </div>
            <div className={`h-8 transition-all duration-300 ${stage === 'reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="font-display text-xl text-white uppercase tracking-wider">{partners[0]?.nickname || '---'}</h3>
            </div>
          </div>

          {/* Connection Visual */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-20 flex items-center justify-center pointer-events-none">
            <div className={`h-[4px] bg-linear-to-r from-transparent via-emerald-400/60 to-transparent transition-all duration-1000 ${stage === 'reveal' ? 'w-full opacity-100 blur-[1px]' : 'w-0 opacity-0'}`}></div>
            <div className={`absolute material-symbols-outlined text-emerald-300 text-2xl transition-all duration-700 ${stage === 'reveal' ? 'scale-125 rotate-0 opacity-100' : 'scale-0 rotate-180 opacity-0'}`}>link</div>
          </div>

          {/* Partner 2 */}
          <div className="flex flex-col items-center gap-4 group">
            <div className={`relative transition-all duration-700 ${stage === 'reveal' ? 'animate-[uncover_0.6s_ease-out_0.2s_forwards] opacity-0' : 'scale-90'}`} style={stage === 'reveal' ? { animationFillMode: 'forwards' } : {}}>
              {stage === 'suspense' ? (
                <div className="w-24 h-24 rounded-lg bg-indigo-500/5 border-2 border-indigo-500/40 flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_20px_rgba(99,102,241,0.2)]">
                  <div className="absolute inset-0 bg-linear-to-b from-indigo-500/10 to-transparent"></div>
                  <span className="font-display text-5xl text-indigo-400/80 animate-glitch delay-100">{glitchText}</span>
                  <div className="absolute bottom-0 left-0 w-full h-px bg-indigo-500/30 animate-scanline"></div>
                </div>
              ) : (
                <Avatar
                  avatarId={partners[1]?.avatar || '4'}
                  bgColor={partners[1]?.color || '#00CED1'}
                  size="xl"
                  borderColor="border-white"
                  className="shadow-hard scale-110"
                  badge={
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-lg animate-bounce">
                      <span className="material-symbols-outlined text-white text-xl">favorite</span>
                    </div>
                  }
                />
              )}
            </div>
            <div className={`h-8 transition-all duration-300 ${stage === 'reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h3 className="font-display text-xl text-white uppercase tracking-wider">{partners[1]?.nickname || '---'}</h3>
            </div>
          </div>
        </div>

        {/* Word Card: Shared Success (Distinct Victory) */}
        <div className={`w-full transition-all duration-1000 delay-500 ${stage === 'reveal' ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}>
          <div className="bg-white/10 backdrop-blur-xl rounded-4xl p-8 border-4 border-white/20 shadow-hard-xl relative overflow-hidden">
            <div className="absolute -top-4 -right-4 p-4 opacity-10">
              <span className="material-symbols-outlined text-9xl text-white">groups</span>
            </div>
            <p className="text-[10px] uppercase font-black tracking-[0.4em] text-white/60 leading-none mb-6">Se comunicaron mediante</p>
            <div className="relative inline-block">
              <h2 className="text-5xl md:text-6xl font-display font-bold uppercase italic tracking-widest text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
                {secretWord}
              </h2>
              <div className="absolute -bottom-2 left-0 w-full h-1.5 bg-emerald-400 rounded-full animate-[line-draw_0.8s_ease-out_1.2s_forwards] opacity-0"></div>
            </div>
          </div>
        </div>

        {/* Transition Footer */}
        <div className={`mt-auto pt-12 transition-opacity duration-1000 ${stage === 'reveal' ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-3 text-white/50">
            <div className="w-4 h-4 border-2 border-white/30 border-t-emerald-400 rounded-full animate-spin" />
            <p className="font-mono uppercase tracking-[0.3em] text-[10px] font-black">Sincronización Perfecta...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

