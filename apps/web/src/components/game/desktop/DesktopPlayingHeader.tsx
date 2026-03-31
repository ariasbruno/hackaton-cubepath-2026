import React from 'react';
import TimerIcon from '../../icons/timer';
import ForumIcon from '../../icons/forum';
import CheckCircleIcon from '../../icons/check-circle';
import RadioButtonUncheckedIcon from '../../icons/radio-button-unchecked';
import { GameEvents } from '@impostor/shared';
import { wsClient } from '../../../services/ws';

interface DesktopPlayingHeaderProps {
  isClues: boolean;
  isDiscussing: boolean;
  currentRound: number;
  secondsLeft: number;
  formatTime: (s: number) => string;
  turnPlayer: any;
  isMyTurn: boolean;
  timerPercentage: number;
  skipVotes: string[];
  playerId: string;
}

export const DesktopPlayingHeader: React.FC<DesktopPlayingHeaderProps> = ({
  isClues,
  isDiscussing,
  currentRound,
  secondsLeft,
  formatTime,
  turnPlayer,
  isMyTurn,
  timerPercentage,
  skipVotes,
  playerId,
}) => {
  return (
    <header className="hidden md:flex bg-white rounded-3xl border-2 border-ink/5 p-4 px-6 shadow-hard-sm items-center justify-between w-full relative z-30">
      
      {/* Left: Phase Info (Replaces App Branding) */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            {isDiscussing && (
               <div className="w-8 h-8 bg-danger-muted text-danger rounded-full flex items-center justify-center border-2 border-danger shadow-hard-sm">
                 <ForumIcon className="w-5 h-5" />
               </div>
            )}
            <span className={`font-display text-2xl leading-none uppercase tracking-tight ${isDiscussing ? 'text-danger' : 'text-ink'}`}>
              {isClues ? `Ronda ${currentRound || 1}` : '¡Debate!'}
            </span>
          </div>
          <span className={`text-[10px] font-extrabold uppercase tracking-[0.2em] mt-1 ${isDiscussing ? 'text-danger/60' : 'text-secondary'}`}>
            {isClues ? 'Fase de Pistas' : '¿Quién es el impostor?'}
          </span>
        </div>
      </div>

      {/* Right: Timers and Turns (Copied from Prototype) */}
      <div className="flex items-center gap-8">
        
        {/* Skip Voting Option */}
        {isDiscussing && (
          <div className="flex flex-col items-center mr-4">
             <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1">
               Saltar a Votación
             </span>
             <button
               onClick={() => wsClient.send(GameEvents.SKIP_DISCUSSION, {})}
               className={`flex items-center gap-2 px-5 py-2.5 rounded-full border-2 transition-all shadow-hard-sm ${skipVotes?.includes(playerId)
                   ? 'bg-secondary text-white border-secondary'
                   : 'bg-paper text-secondary border-secondary/20 hover:bg-secondary/5'
                 }`}
             >
               {skipVotes?.includes(playerId) ? <CheckCircleIcon className="w-5 h-5" /> : <RadioButtonUncheckedIcon className="w-5 h-5" />}
               <span className="text-xs font-bold uppercase tracking-widest leading-none">
                 {skipVotes?.length || 0}
               </span>
             </button>
          </div>
        )}

        {/* Global Timer */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1">
            Tiempo Restante
          </span>
          <div className={`px-6 py-2 rounded-full border-2 flex items-center gap-3 shadow-hard-sm ${isDiscussing ? 'bg-danger-muted border-danger text-danger' : 'bg-secondary-muted border-secondary text-secondary'}`}>
            <TimerIcon className="w-5 h-5" />
            <span className={`font-mono font-black text-lg leading-none ${isDiscussing ? 'text-danger' : 'text-secondary'}`}>
              {formatTime(secondsLeft)}
            </span>
          </div>
        </div>

        {/* Turn Progress */}
        {isClues && turnPlayer && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mb-1">
              Turno de <span className="text-secondary">{isMyTurn ? 'Ti' : turnPlayer.nickname}</span>
            </span>
            <div className="w-40 h-3 bg-ink/5 rounded-full overflow-hidden border border-ink/10 shadow-[inset_4px_4px_0px_rgba(0,0,0,0.1)]">
              <div
                className={`h-full transition-all duration-500 rounded-full ${isMyTurn ? 'bg-primary' : 'bg-secondary'}`}
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
