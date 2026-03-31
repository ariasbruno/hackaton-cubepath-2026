// @ts-nocheck
import React from 'react';
import { Avatar } from '../../components/ui/Avatar';

const MOCK_PLAYERS = [
  { id: '1', nickname: 'Félix', avatar: 'noto--cat-face', bgColor: '#FF8C42' },
  { id: '2', nickname: 'Ana', avatar: 'noto--fox', bgColor: '#4D9DE0' },
];

export const RevealCaosReveal2Prototype: React.FC = () => {
  return (
    <>
      <style>{`
        @keyframes spotlight {
            0% { opacity: 0; transform: scale(0.8); filter: blur(10px); }
            100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes reveal-bg-red {
            0% { background-color: #2B2D42; }
            100% { background-color: #E63946; }
        }
        @keyframes shake-hit {
            0% { transform: translate(0, 0); }
            10% { transform: translate(-15px, -15px); }
            30% { transform: translate(15px, 15px); }
            50% { transform: translate(-15px, 15px); }
            70% { transform: translate(15px, -15px); }
            100% { transform: translate(0, 0); }
        }
        @keyframes uncover {
            0% { filter: blur(15px) grayscale(1); opacity: 0.5; }
            100% { filter: blur(0) grayscale(0); opacity: 1; }
        }
        @keyframes question-out {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(3); opacity: 0; }
        }
        @keyframes name-in {
            0% { transform: translateY(10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes stamp {
            0% { transform: scale(5); opacity: 0; }
            100% { transform: scale(1) rotate(-5deg); opacity: 1; }
        }
        @keyframes target-pulse {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 0.4; }
            100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes shake-extreme {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-10px, -10px); }
            20% { transform: translate(10px, 10px); }
            30% { transform: translate(-10px, 10px); }
            40% { transform: translate(10px, -10px); }
        }
        @keyframes fade-out {
            0% { opacity: 1; }
            100% { opacity: 0; }
        }

        .animate-spotlight { animation: spotlight 1s ease-out forwards; }
        .scene-bg { animation: reveal-bg-red 0.4s 3s forwards; background-color: #2B2D42; }
        .hit-shake { animation: shake-hit 0.3s 3s ease-in-out; }
        .avatar-hidden { filter: blur(15px) grayscale(1); opacity: 0.5; }
        .avatar-reveal { animation: uncover 0.4s 3s forwards; }
        .question-mark { animation: question-out 0.4s 3s forwards; }
        .name-reveal { opacity: 0; animation: name-in 0.4s 3.2s forwards; }
        .stamp-reveal { opacity: 0; animation: stamp 0.4s 4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .word-reveal { opacity: 0; animation: name-in 0.5s 4.5s forwards; }
        .animate-target { animation: target-pulse 1.5s infinite; }
        .animate-shake-hard { animation: shake-extreme 0.15s 2.5s 6; }
        .pattern-checkers {
            background-image: repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 25px, transparent 25px, transparent 50px, rgba(0, 0, 0, 0.1) 50px, rgba(0, 0, 0, 0.1) 75px, transparent 75px, transparent 100px);
        }
        .delay-1 { animation-delay: 1s; }
      `}</style>
      <div className="scene-bg text-white font-sans min-h-screen w-screen flex flex-col items-center justify-center overflow-hidden relative">
        <div className="absolute inset-0 pattern-checkers opacity-20 pointer-events-none"></div>

        <main className="relative z-10 flex flex-col items-center gap-12 w-full max-w-lg p-6 hit-shake">
          {/* Fase 1: El Título */}
          <div className="text-center space-y-2 relative">
            <div style={{ animation: 'fade-out 0.3s 3s forwards' }}>
              <p className="font-mono text-xs md:text-sm uppercase tracking-[0.4em] text-danger animate-pulse">
                Analizando acusación...
              </p>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter opacity-0 animate-spotlight delay-1">
              OBJETIVOS FIJADOS
            </h1>
            <div className="stamp-reveal absolute top-0 w-[110vw] max-w-xl left-1/2 -translate-x-1/2 flex justify-center">
              <div className="whitespace-nowrap bg-white text-danger px-8 py-3 border-4 border-ink/5 shadow-[8px_8px_0px_rgba(43,45,66,0.3)] rounded-2xl rotate-[-5deg]">
                <p className="font-display font-black text-3xl md:text-4xl uppercase leading-none">
                  ¡VÍNCULO CAZADO!
                </p>
              </div>
            </div>
          </div>

          {/* Fase 2: Revelación de Jugadores */}
          <div className="w-full flex items-center justify-center gap-30 md:gap-30 relative animate-shake-hard">
            {/* Jugador 1 */}
            <div className="flex flex-col animate-spotlight items-center gap-4">
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                <div className="absolute -inset-4" style={{ animation: 'fade-out 0.3s 3s forwards' }}>
                  <div className="absolute inset-0 border-4 border-danger rounded-full border-dashed animate-target" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-6xl font-display text-white z-20 question-mark font-bold drop-shadow-lg">
                  ?
                </div>
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white/10 border-4 border-ink shadow-hard avatar-hidden avatar-reveal relative z-10 flex items-center justify-center" style={{ backgroundColor: MOCK_PLAYERS[0].bgColor }}>
                  <Avatar avatarId={MOCK_PLAYERS[0].avatar} bgColor="transparent" size="xl" />
                </div>
              </div>
              <p className="font-display font-bold text-lg md:text-xl uppercase tracking-widest name-reveal">
                {MOCK_PLAYERS[0].nickname}
              </p>
            </div>

            {/* Jugador 2 */}
            <div className="flex flex-col animate-spotlight items-center gap-4">
              <div className="relative w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
                <div className="absolute -inset-4" style={{ animation: 'fade-out 0.3s 3s forwards' }}>
                  <div className="absolute inset-0 border-4 border-danger rounded-full border-dashed animate-target" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-6xl font-display text-white z-20 question-mark font-bold drop-shadow-lg">
                  ?
                </div>
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-white/10 border-4 border-ink shadow-hard avatar-hidden avatar-reveal relative z-10 flex items-center justify-center" style={{ backgroundColor: MOCK_PLAYERS[1].bgColor }}>
                  <Avatar avatarId={MOCK_PLAYERS[1].avatar} bgColor="transparent" size="xl" />
                </div>
              </div>
              <p className="font-display font-bold text-lg md:text-xl uppercase tracking-widest name-reveal">
                {MOCK_PLAYERS[1].nickname}
              </p>
            </div>
          </div>

          {/* Fase 3: Sello y Palabra */}
          <div className="flex flex-col items-center gap-8 mt-2">
            <div className="word-reveal">
              <div className="bg-white text-purple px-10 py-4 border-4 border-ink/5 shadow-hard rounded-2xl rotate-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-purple/40 mb-1 text-center">
                  Palabra Compartida
                </p>
                <p className="font-display font-black text-4xl md:text-5xl uppercase leading-none text-purple">
                  RAYO
                </p>
              </div>
            </div>
          </div>

          <p 
            className="text-sm md:text-base font-medium text-white/60 leading-relaxed px-8 pt-8 text-center opacity-0" 
            style={{ animation: 'name-in 0.5s 5s forwards' }}
          >
            Los Dispersos han triunfado en el Caos. <br />
            La conexión fue destruida.
          </p>

          <div 
            className="pt-8 opacity-0" 
            style={{ animation: 'name-in 0.5s 5.5s forwards' }}
          >
            <div className="flex items-center justify-center gap-3 text-white">
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <p className="font-mono uppercase tracking-[0.3em] text-[10px] font-black drop-shadow-md">Finalizando juego...</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};
