import React from 'react';
import { GameEvents } from '@impostor/shared';
import { wsClient } from '../../services/ws';
import ForumIcon from '../icons/forum';
import TimerIcon from '../icons/timer';
import CheckCircleIcon from '../icons/check-circle';
import RadioButtonUncheckedIcon from '../icons/radio-button-unchecked';

interface PlayingHeaderProps {
  isClues: boolean;
  isDiscussing: boolean;
  currentRound: number;
  secondsLeft: number;
  formatTime: (s: number) => string;
  skipVotes: string[];
  playerId: string;
}

export const PlayingHeader: React.FC<PlayingHeaderProps> = ({
  isClues, isDiscussing, currentRound, secondsLeft, formatTime, skipVotes, playerId
}) => (
  <header className="p-6 bg-white border-b border-ink/5 flex items-center justify-between shadow-[0_4px_20px_rgba(43,45,66,0.05)] sticky top-0 z-30">
    <div className="flex items-center gap-3">
      {isDiscussing && (
        <div className="w-10 h-10 bg-danger/10 text-danger rounded-full flex items-center justify-center">
          <ForumIcon className="w-6 h-6" />
        </div>
      )}
      <div className="flex flex-col">
        <span className={`font-display text-xl leading-none uppercase ${isDiscussing ? 'text-danger' : 'text-primary'}`}>
          {isClues ? `Ronda ${currentRound || 1}` : '¡Debate!'}
        </span>
        <span className="text-[10px] font-extrabold uppercase opacity-40 tracking-[0.2em] mt-1">
          {isClues ? 'Fase de Pistas' : '¿Quién es el impostor?'}
        </span>
      </div>
    </div>

    <div className="flex items-center gap-3">
      {isDiscussing && (
        <div className="flex items-center gap-3 mr-2">
          <button
            onClick={() => wsClient.send(GameEvents.SKIP_DISCUSSION, {})}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all ${skipVotes?.includes(playerId)
                ? 'bg-secondary text-white border-secondary'
                : 'bg-paper text-secondary border-secondary/20'
              }`}
          >
            {skipVotes?.includes(playerId) ? <CheckCircleIcon className="w-4 h-4" /> : <RadioButtonUncheckedIcon className="w-4 h-4" />}
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
              {skipVotes?.length || 0}
            </span>
          </button>
        </div>
      )}
      <div className={`${isDiscussing ? 'bg-danger-muted border-danger/10' : 'bg-secondary-muted border-secondary/10'} px-4 py-2 rounded-full border-2 flex items-center gap-2`}>
        <TimerIcon className={`w-4 h-4 ${isDiscussing ? 'text-danger' : 'text-secondary'}`} />
        <span className={`font-mono font-bold text-sm ${isDiscussing ? 'text-danger' : 'text-secondary'}`}>
          {formatTime(secondsLeft)}
        </span>
      </div>
    </div>
  </header>
);
