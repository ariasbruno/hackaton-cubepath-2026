import React, { useState, useEffect } from 'react';
import { Avatar } from '../../ui/Avatar';

interface TraditionalRevealProps {
  roomState: {
    players: any[];
    lastEliminatedId?: string;
    settings?: {
      mode: 'TRADICIONAL' | 'CERCANAS';
    };
    secretWord?: string;
  };
}

export const TraditionalReveal: React.FC<TraditionalRevealProps> = ({ roomState }) => {
  const [stage, setStage] = useState<'suspense' | 'reveal'>('suspense');
  
  const targetPlayer = roomState.players.find(p => p.id === roomState.lastEliminatedId);
  const isCercanas = roomState.settings?.mode === 'CERCANAS';
  const roleLabel = isCercanas ? 'INFILTRADO' : 'IMPOSTOR';
  const isImpostor = targetPlayer && (targetPlayer.role === 'IMPOSTOR' || targetPlayer.role === 'INFILTRADO');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('reveal');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden text-white font-body ${
      stage === 'suspense' 
        ? 'bg-[#2B2D42]' 
        : (targetPlayer 
            ? (isImpostor ? 'animate-reveal-bg-green' : 'animate-reveal-bg-red') 
            : 'bg-slate-800')
    }`}>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 pattern-checkers opacity-20" />

      <main className={`relative z-10 flex flex-col items-center gap-12 w-full max-w-lg p-6 ${
        stage === 'reveal' ? 'animate-[shake-hit_0.3s_ease-in-out_forwards]' : ''
      }`}>

        {/* Phase 1: The Title & Status */}
        <div className="text-center space-y-2 relative">
          <p className="font-display text-lg uppercase tracking-[0.4em] text-danger animate-pulse">
            {stage === 'suspense' ? 'Analizando acusación...' : ''}
          </p>
          
          <h1 className={`font-display text-5xl uppercase tracking-tighter opacity-0 ${
            stage === 'suspense' ? 'animate-spotlight delay-[1s]' : 'opacity-0'
          }`}>
            OBJETIVO FIJADO
          </h1>

          {/* Reveal Stamp */}
          {stage === 'reveal' && (
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-full flex justify-center animate-[stamp_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
              <div className={`bg-white px-10 py-4 border-4 border-ink/5 shadow-hard-lg rounded-2xl rotate-[-5deg] ${
                targetPlayer ? (isImpostor ? 'text-[#06D6A0]' : 'text-danger') : 'text-slate-800'
              }`}>
                <p className="font-display text-4xl uppercase leading-none">
                  {targetPlayer ? (isImpostor ? `¡${roleLabel} ENCONTRADO!` : '¡ERROR TÁCTICO!') : '¡EMPATE TÉCNICO!'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Phase 2: Central Target / Avatar */}
        <div className={`w-full flex items-center justify-center gap-12 relative ${
          stage === 'suspense' ? 'animate-shake-hard' : ''
        }`}>
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
              
              {/* Target Circle (Disappears at 3s) */}
              <div 
                className="absolute -inset-4" 
                style={{ animation: stage === 'reveal' ? 'fade-out 0.3s forwards' : 'target-pulse 1.5s infinite' }}
              >
                <div className="absolute inset-0 border-4 border-danger rounded-full border-dashed" />
              </div>

              {/* Question Mark placeholder */}
              <div className={`absolute inset-0 flex items-center justify-center text-6xl font-display text-white z-20 ${
                stage === 'reveal' ? 'animate-question-out' : 'opacity-80'
              }`}>
                ?
              </div>

              {/* Avatar reveal element (Only visible in reveal stage) */}
              <div 
                className={`w-28 h-28 rounded-full overflow-hidden border-4 border-ink shadow-hard relative z-10 flex items-center justify-center transition-all duration-700 ${
                  stage === 'reveal' ? 'filter blur(0) grayscale(0) opacity-100 scale-110' : 'opacity-0 scale-50'
                }`}
                style={{ backgroundColor: targetPlayer?.color || '#334155' }}
              >
                {targetPlayer ? (
                  <Avatar avatarId={targetPlayer.avatar} bgColor="transparent" size="xl" />
                ) : (
                  <span className="material-symbols-outlined text-5xl">groups</span>
                )}
              </div>
            </div>

            <div className={`flex flex-col items-center transition-all duration-400 delay-[0.2s] ${
              stage === 'reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <p className="font-display text-xl uppercase tracking-widest leading-none">
                {targetPlayer?.nickname || 'Múltiples Objetivos'}
              </p>
            </div>
          </div>
        </div>

        {/* Phase 3: Bottom Narrative Text */}
        <div className="flex flex-col items-center gap-8 w-full">
          <p className={`text-sm md:text-base font-medium text-white/80 leading-relaxed px-8 text-center transition-all duration-700 delay-[2s] ${
            stage === 'reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            {targetPlayer 
              ? (isImpostor 
                 ? <>La amenaza ha sido neutralizada. <br /> El {roleLabel.toLowerCase()} fue descubierto.</> 
                 : <>Un aliado ha caído víctima de la confusión. <br /> La sospecha se mantiene en el aire.</>)
              : <>No se alcanzó un consenso suficiente. <br /> Los sujetos permanecen bajo vigilancia.</>}
          </p>

          <div className={`flex items-center justify-center gap-3 text-white transition-all duration-700 delay-[2.5s] ${
            stage === 'reveal' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            <p className="font-mono uppercase tracking-[0.3em] text-[10px] font-black drop-shadow-md">
              Finalizando juego...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
