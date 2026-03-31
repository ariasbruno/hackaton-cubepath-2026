import React from 'react';
import { Avatar } from '../../ui/Avatar';
import LinkIcon from '../../icons/link';
import GavelIcon from '../../icons/gavel';

interface PlayerVoteCardProps {
  player: any;
  isMe: boolean;
  isSelected: boolean;
  onSelect: (id: string) => void;
  mode?: 'LINK' | 'ACCUSE' | 'VOTE';
}

export const PlayerVoteCard: React.FC<PlayerVoteCardProps> = ({ player, isMe, isSelected, onSelect, mode = 'VOTE' }) => {
  const isDead = !player.isAlive;
  const isLink = mode === 'LINK';
  const activeBg = isLink ? 'bg-secondary-muted' : 'bg-danger-muted';
  const activeBorder = isLink ? 'border-secondary' : 'border-danger';
  const activeBadgeBg = isLink ? 'bg-secondary' : 'bg-danger';

  if (isMe || isDead) {
    return (
      <div className="opacity-30 grayscale p-5 flex flex-col items-center gap-3">
        <Avatar
          avatarId={isDead ? '💀' : (player.avatar || 'noto--bear')}
          bgColor={player.color || '#FFD166'}
          size="lg"
          className="border-white shadow-hard-sm"
        />
        <div className="text-center">
          <h3 className="font-display text-lg tracking-tight leading-none text-ink/60">
            {isMe ? 'Tú' : player.nickname}
          </h3>
          <p className="text-[8px] font-bold uppercase opacity-100 mt-1">
            {isDead ? 'Fuera' : 'Inmune'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <label className="block relative cursor-pointer group">
      <input
        type="checkbox"
        name="vote"
        className="peer hidden"
        checked={isSelected}
        onChange={() => onSelect(player.id)}
      />
      <div className={`bg-white p-5 rounded-card border-4 shadow-hard transition-all paper-card flex flex-col items-center gap-3 ${isSelected ? `${activeBorder} ${activeBg}` : 'border-ink/5'}`}>
        <Avatar
          avatarId={player.avatar || 'noto--bear'}
          bgColor={player.color || '#FFD166'}
          size="lg"
          className={`border-white shadow-hard transition-transform group-hover:scale-105 ${isSelected ? (isLink ? 'bg-secondary/20' : 'bg-danger/20') : ''}`}
        />
        <div className="text-center">
          <h3 className="font-display text-lg tracking-tight leading-none">{player.nickname}</h3>
        </div>
      </div>
      {/* Selection Badge */}
      <div className={`absolute -top-2 -right-2 w-8 h-8 ${activeBadgeBg} text-white rounded-full flex items-center justify-center border-4 border-white shadow-hard-sm transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
        {isLink ? <LinkIcon className="w-4 h-4" /> : <GavelIcon className="w-4 h-4" />}
      </div>
    </label>
  );
};
