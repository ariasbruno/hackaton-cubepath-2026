import React from 'react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import VerifiedIcon from '../icons/verified';
import WorkspacePremiumIcon from '../icons/workspace-premium';
import TheaterComedyIcon from '../icons/theater-comedy';
import AnalyticsIcon from '../icons/analytics';
import type { WinnerSide, GameMode } from '@impostor/shared';

interface LocalResultsProps {
  winner: WinnerSide | null;
  mode: GameMode;
  impostorName: string | undefined;
  impostorAvatarId: string | undefined;
  impostorAvatarColor: string | undefined;
  secretWord: string;
  onReset: () => void;
  onExit: () => void;
}

export const LocalResults: React.FC<LocalResultsProps> = ({
  winner,
  mode,
  impostorName,
  impostorAvatarId,
  impostorAvatarColor,
  secretWord,
  onReset,
  onExit
}) => {
  const isAgentesWin = winner === 'AGENTES';
  const isInfiltradoWin = winner === 'IMPOSTORES' && mode === 'CERCANAS';

  // Config based on winner
  const config = {
    bg: isAgentesWin ? 'bg-accent' : isInfiltradoWin ? 'bg-secondary' : 'bg-danger',
    title: isAgentesWin ? '¡VICTORIA\nLOGRADA!' : isInfiltradoWin ? '¡EL ENGAÑO\nFUE TOTAL!' : '¡ENGAÑO\nMAESTRO!',
    tagline: isAgentesWin ? 'Los Agentes ganan la partida' : isInfiltradoWin ? 'Modo Cercanas: Victoria Infiltrada' : 'Modo Tradicional: Victoria Impostor',
    badgeText: isAgentesWin ? 'Buen Trabajo' : isInfiltradoWin ? 'Mimetismo' : 'Victoria',
    icon: isAgentesWin ? WorkspacePremiumIcon : isInfiltradoWin ? TheaterComedyIcon : AnalyticsIcon,
    mainLabel: isAgentesWin ? 'Misión Éxito' : impostorName?.toUpperCase() || 'IMPOSTOR',
    subLabel: isAgentesWin ? 'El Impostor fue neutralizado' : isInfiltradoWin ? 'Maestra del Engaño Semántico' : 'El Genio del Engaño',
    buttonColor: isAgentesWin ? 'text-accent' : isInfiltradoWin ? 'text-secondary' : 'text-danger',
    pattern: 'pattern-checkers-danger'
  };

  const IconComponent = config.icon;

  return (
    <div className={`w-full flex-1 flex flex-col text-center text-white relative overflow-x-hidden ${config.bg} ${config.pattern}`}>
      
      {/* Confetti for Agentes */}
      {isAgentesWin && (
        <div className="fixed inset-0 pointer-events-none z-0">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="animate-confetti absolute" 
              style={{ 
                left: `${Math.random() * 100}%`, 
                backgroundColor: i % 2 === 0 ? 'white' : '#FF8C42',
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                animationDelay: `${Math.random() * 3}s`,
                top: '-20px'
              }}
            />
          ))}
        </div>
      )}

      {/* Wrapping content in a flex-1 to allow pushing footer down, but not restricting height */}
      <main className="flex-1 flex flex-col items-center justify-center space-y-10 animate-fade-in relative z-10 w-full py-12 max-w-2xl mx-auto px-4 sm:px-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="font-display text-5xl md:text-6xl drop-shadow-xl leading-tight -rotate-2 uppercase whitespace-pre-line">
            {config.title}
          </h1>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/60">
            {config.tagline}
          </p>
        </div>

        {/* Result Card Section */}
        <div className="bg-white text-ink w-full p-8 pb-16 rounded-card border-4 border-ink/5 shadow-hard-lg paper-tear relative">
          
          {/* Top Badge */}
          <div className={`absolute -top-7 left-1/2 -translate-x-1/2 ${config.bg} text-white px-8 py-2 rounded-full font-display text-xl shadow-hard border-2 border-white uppercase z-50 whitespace-nowrap`}>
            {config.badgeText}
          </div>
          
          <div className="flex flex-col items-center mt-6">
            {/* Visual Icon/Avatar Circle */}
            <div className={`w-36 h-36 rounded-full flex items-center justify-center mb-6 relative overflow-hidden ${isAgentesWin ? config.bg + ' bg-opacity-20 border-4 border-white shadow-hard' : ''}`}>
              {isAgentesWin ? (
                <>
                  <div className={`absolute inset-0 ${config.bg} bg-opacity-10 animate-pulse`}></div>
                  <IconComponent className={`w-18 h-18 ${config.buttonColor.replace('text-', 'text-')}`} />
                </>
              ) : (
                <Avatar 
                  avatarId={impostorAvatarId || 'noto--bear'} 
                  bgColor={impostorAvatarColor}
                  size="full" 
                />
              )}
            </div>
            
            <h2 className="font-display text-4xl mb-1 uppercase tracking-tight text-ink leading-none">
              {config.mainLabel}
            </h2>
            <p className="text-ink/40 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-10">
              {config.subLabel}
            </p>
            
            {/* Secret Word Reveal */}
            <div className="w-full">
              <div className="bg-paper p-6 rounded-btn border-4 border-ink/5 shadow-inner-hard relative">
                <p className="text-ink/30 font-extrabold uppercase tracking-[0.3em] text-[8px] mb-2">
                  Palabra Secreta Revelada
                </p>
                <div className="flex flex-col items-center">
                  <span className="font-display text-3xl uppercase tracking-widest text-ink/80 drop-shadow-sm">
                    {secretWord}
                  </span>
                  <div className={`h-1.5 w-16 ${config.bg} bg-opacity-30 mt-2 rounded-full`} />
                </div>
              </div>

              {isAgentesWin && (
                <div className="flex items-center justify-center gap-2 text-accent font-extrabold uppercase text-[10px] tracking-widest mt-4">
                <Avatar
                  avatarId={impostorAvatarId || 'noto--bear'}
                  bgColor={impostorAvatarColor || '#FF6B6B'}
                  size="xl"
                  className="w-18 h-18"
                />
                  <VerifiedIcon className="w-4 h-4" />
                  Misión Correcta
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER ACTIONS */}
      <footer className="w-full mt-8 pb-10 relative z-10 max-w-2xl mx-auto px-4 sm:px-8 flex flex-col gap-3">
        <Button
          onClick={onReset}
          variant="accent"
          size="xl"
          fullWidth
          className="py-10 shadow-hard-lg hover:translate-y-1 transition-all uppercase tracking-widest text-center"
        >
          <span className="font-display text-2xl">Volver al Lobby</span>
        </Button>
        <button
          onClick={onExit}
          className="w-full py-4 text-xs font-black uppercase tracking-[0.4em] text-white/30 hover:text-white/60 transition-all"
        >
          Salir al Menú Principal
        </button>
      </footer>
    </div>
  );
};
