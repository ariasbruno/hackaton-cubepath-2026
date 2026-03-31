import React, { useState, useEffect } from 'react';
import { wsClient } from '../../services/ws';
import { GameEvents } from '@impostor/shared';
import { RoleRevealHeader } from '../../components/game/role/RoleRevealHeader';
import { FlipCard } from '../../components/game/role/FlipCard';
import { ReadyStatus } from '../../components/game/role/ReadyStatus';
import { ReadyButton } from '../../components/game/role/ReadyButton';

import SkullIcon from '../../components/icons/skull';
import VisibilityOffIcon from '../../components/icons/visibility-off';
import BoltIcon from '../../components/icons/bolt';
import PersonIcon from '../../components/icons/person';

interface RoleRevealProps {
  player: any;
  timerEndAt?: number;
  room?: any;
}

const getRoleTheme = (role: string) => {
  switch (role) {
    case 'IMPOSTOR':
      return {
        color: 'danger',
        borderColor: 'border-danger',
        textColor: 'text-danger',
        bgColor: 'bg-danger/10',
        title: 'IMPOSTOR',
        icon: SkullIcon,
        description: 'No conoces la palabra. ¡Finge!'
      };
    case 'INFILTRADO':
      return {
        color: 'accent',
        borderColor: 'border-accent',
        textColor: 'text-accent',
        bgColor: 'bg-accent/10',
        title: 'INFILTRADO',
        icon: VisibilityOffIcon,
        description: 'Tu palabra es parecida, pero DIFERENTE'
      };
    case 'VINCULADO':
    case 'DISPERSO':
      return {
        color: 'purple',
        borderColor: 'border-purple',
        textColor: 'text-purple',
        bgColor: 'bg-purple/10',
        title: role === 'VINCULADO' ? 'VINCULADO' : 'DISPERSO',
        icon: BoltIcon,
        description: role === 'VINCULADO' ? 'Encuentra a tu pareja' : 'Descubre a los vinculados'
      };
    default:
      return {
        color: 'accent',
        borderColor: 'border-accent',
        textColor: 'text-accent',
        bgColor: 'bg-accent/10',
        title: 'AGENTE',
        icon: PersonIcon,
        description: 'Encuentra al impostor'
      };
  }
};

export const RoleReveal: React.FC<RoleRevealProps> = ({ player, timerEndAt, room }) => {
  const [flipped, setFlipped] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15);

  const role = player?.role;
  const word = player?.word;
  const isImpostor = role === 'IMPOSTOR';

  useEffect(() => {
    if (!timerEndAt) return;
    const interval = setInterval(() => {
      const left = Math.max(0, Math.round((timerEndAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, [timerEndAt]);

  const totalPlayers = room?.players?.length || 0;
  const readyPlayers = room?.players?.filter((p: any) => p.isReady).length || 0;

  const handleConfirm = () => {
    setConfirmed(true);
    wsClient.send(GameEvents.CONFIRM_ROLE, {});
  };

  const theme = getRoleTheme(role);
  const timerDuration = 15;
  const progress = (secondsLeft / timerDuration) * 100;

  const isCercanasMode = room?.settings?.mode === 'CERCANAS';
  const isCaosMode = room?.settings?.mode === 'CAOS';
  const showMysteryTheme = (isCercanasMode && (role === 'AGENTE' || role === 'INFILTRADO')) || isCaosMode;

  // For Cercanas and Caos mode, we override the theme to not reveal the role immediately
  const displayTheme = (isCercanasMode && (role === 'AGENTE' || role === 'INFILTRADO')) ? getRoleTheme('AGENTE') : theme;
  
  const bgClass = isCaosMode ? 'bg-[#4C1D95] text-white' : (showMysteryTheme ? 'bg-accent text-white' : 'bg-paper text-ink');
  const selectionClass = showMysteryTheme ? 'selection:bg-white selection:text-accent' : 'selection:bg-primary selection:text-white';

  return (
    <div className={`h-full w-full ${bgClass} pattern-dots relative overflow-y-auto no-scrollbar flex flex-col items-center ${selectionClass}`}>
      <div className="min-h-full flex flex-col p-6 w-full max-sm:max-w-xs sm:max-w-sm">
        <div className="my-auto w-full flex flex-col items-center">
          <main className="flex flex-col items-center justify-center space-y-12 w-full animate-fade-in py-16">
            <RoleRevealHeader nickname={player?.nickname} showMystery={isCercanasMode && (role === 'AGENTE' || role === 'INFILTRADO')} role={role} />

            <FlipCard 
              word={word}
              theme={displayTheme}
              isImpostor={isImpostor}
              flipped={flipped}
              onFlip={() => setFlipped(!flipped)}
            />

            {isCaosMode && (
              <div className="text-center px-4 -mt-4 mb-2 animate-fade-in delay-300">
                <p className="text-[11px] font-bold text-white/50 uppercase tracking-widest leading-relaxed">
                  REGLA: En este modo NO hay impostor. Encuentra a tu pareja (tiene tu misma palabra) o acusa a la pareja correcta para ganar.
                </p>
              </div>
            )}

            <ReadyStatus 
              confirmed={confirmed} 
              progress={progress} 
              isInfiltrado={showMysteryTheme}
              hideBar={showMysteryTheme}
            />
          </main>

          {showMysteryTheme && !isCaosMode && (
            <div className="w-full max-w-xs space-y-4 mb-12">
              <p className="text-white font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse text-center">Analizando huella semántica...</p>
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          )}

          <ReadyButton 
            onConfirm={handleConfirm}
            confirmed={confirmed}
            readyPlayers={readyPlayers}
            totalPlayers={totalPlayers}
            isInfiltrado={showMysteryTheme}
          />
        </div>
      </div>
    </div>
  );
};
