import React from 'react';
import { Avatar } from '../../ui/Avatar';
import WorkspacePremiumIcon from '../../icons/workspace-premium';

interface PlayerScoreItemProps {
  player: any;
  rank: number;
  isMe: boolean;
  isWinner?: boolean;
  roleLabel: string;
  roleColor: string;
}

export const PlayerScoreItem: React.FC<PlayerScoreItemProps> = ({
  player,
  rank,
  isMe,
  isWinner = false,
  roleLabel,
  roleColor,
}) => {
  if (isWinner) {
    return (
      <div className="bg-white p-5 rounded-card border-4 border-primary shadow-hard-lg flex items-center gap-4 relative mt-4 animate-fade-in">
        <div className="absolute -top-5 -left-2 bg-yellow text-ink p-2 rounded-full shadow-hard-sm border-2 border-white -rotate-12">
          <WorkspacePremiumIcon className="w-6 h-6" />
        </div>
        <Avatar
          avatarId={player.avatar || 'noto--bear'}
          bgColor={player.color || '#FFD166'}
          size="lg"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-display text-xl tracking-tight ${isMe ? 'text-primary' : 'text-ink'}`}>{player.nickname}</h3>
            {isMe && (
              <span className="bg-primary/10 text-primary text-[8px] font-bold px-2 py-0.5 rounded-full uppercase">Tú</span>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40 mt-1">
            {roleLabel}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl text-primary leading-none">
            +{player.lastMatchPoints || 0}
          </p>
          <p className="text-[8px] font-extrabold uppercase tracking-tighter text-ink/30 mt-1">
            Total: {player.pointsEarned || 0}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white p-4 rounded-card border-2 border-ink/5 shadow-hard flex items-center gap-4 animate-fade-in ${!player.isAlive ? 'opacity-60' : ''}`}
      style={{ animationDelay: `${(rank - 1) * 0.1}s` }}
    >
      <div className="w-8 h-8 flex items-center justify-center font-display text-lg text-ink/20">
        {rank}
      </div>
      <Avatar
        avatarId={player.avatar || 'noto--bear'}
        bgColor={player.color || '#FFD166'}
        size="md"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className={`font-display text-lg tracking-tight ${isMe ? 'text-primary' : 'text-ink'}`}>
            {player.nickname}
          </h3>
          {isMe && <span className="bg-primary/10 text-primary text-[6px] font-bold px-1.5 py-0.5 rounded-full uppercase">Tú</span>}
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink/40">
          {roleLabel}
        </p>
      </div>
      <div className="text-right">
        <p className={`font-display text-xl text-${roleColor} leading-none`}>
          +{player.lastMatchPoints || 0}
        </p>
        <p className="text-[8px] font-extrabold uppercase tracking-tighter text-ink/30 mt-1">
          Total: {player.pointsEarned || 0}
        </p>
      </div>
    </div>
  );
};
