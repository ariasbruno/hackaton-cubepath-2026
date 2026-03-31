import React from 'react';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import WorkspacePremiumIcon from '../icons/workspace-premium';
import HelpIcon from '../icons/help';
import EditIcon from '../icons/edit';
import BoltIcon from '../icons/bolt';
import SkullIcon from '../icons/skull';
import StarIcon from '../icons/stars';
import LockIcon from '../icons/lock';

interface ProfileHeroProps {
  nickname: string | null;
  avatar: string | null;
  color: string | null;
  totalScore: number;
  globalRank: number | null;
  isRegistered: boolean;
  onEdit: () => void;
}

// Static badge definitions (future: drive from real data)
const BADGES = [
  { bg: 'bg-accent-muted', border: 'border-accent/20', text: 'text-accent', icon: StarIcon, rotate: 'rotate-3', title: 'Primer Ganador' },
  { bg: 'bg-purple-muted', border: 'border-purple/20', text: 'text-purple', icon: BoltIcon, rotate: '-rotate-2', title: 'Maestro del Caos' },
  { bg: 'bg-danger-muted', border: 'border-danger/20', text: 'text-danger', icon: SkullIcon, rotate: 'rotate-6', title: 'Impostor Letal' },
  { bg: 'bg-paper', border: 'border-ink/5 border-dashed', text: 'text-ink/10', icon: LockIcon, rotate: '', title: 'Bloqueado' },
];

export const ProfileHero: React.FC<ProfileHeroProps> = ({
  nickname,
  avatar,
  color,
  totalScore,
  globalRank,
  isRegistered,
  onEdit,
}) => {
  return (
    <>
      {/* ── Identity card ── */}
      <section className="relative">
        <Card variant="paper" borderWidth="thick" className="shadow-hard-lg flex flex-col items-center text-center relative overflow-hidden">
          {!isRegistered && (
            <div className="absolute top-4 right-4 z-30">
              <div className="bg-ink text-white text-[8px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-hard-sm">
                Invitado
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-primary/5 pattern-dots opacity-20" />

          {/* Avatar — larger on desktop */}
          <div className="relative mb-4 md:mb-8">
            <Avatar
              avatarId={avatar || 'noto--bear'}
              size="xl"
              bgColor={color || '#FFD166'}
              borderColor="border-white"
              className="md:w-48! md:h-48! md:text-[120px]!"
              badge={
                <div className={`${isRegistered ? 'bg-yellow' : 'bg-ink/10'} text-ink p-2 md:p-4 rounded-full shadow-hard border-2 md:border-4 border-white rotate-12`}>
                  {isRegistered ? <WorkspacePremiumIcon className="w-6 h-6 md:w-8 md:h-8" /> : <HelpIcon className="w-6 h-6 md:w-8 md:h-8" />}
                </div>
              }
            />
          </div>

          {/* Name + edit */}
          <div className="relative w-full group">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className={`font-display text-3xl md:text-5xl text-ink ${!isRegistered ? 'opacity-50 italic' : ''}`}>
                {nickname || 'Invitado'}
              </h2>
              <button
                onClick={onEdit}
                className="text-ink/20 hover:text-primary transition-colors"
              >
                <EditIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-ink/30">
              {isRegistered ? 'Miembro de la Agencia' : 'Perfil no configurado'}
            </p>
          </div>

          {/* Score + Rank */}
          <div className="mt-6 md:mt-8 grid grid-cols-2 gap-4 md:gap-6 w-full relative">
            <div className="bg-primary-muted p-3 md:p-6 rounded-btn border-2 md:border-4 border-primary/10 shadow-hard-sm transition-all hover:bg-white">
              <p className="text-[8px] md:text-[10px] font-extrabold text-primary uppercase tracking-widest leading-tight mb-1">
                Puntos Totales
              </p>
              <p className="font-display text-2xl md:text-4xl text-primary leading-none">
                {totalScore.toLocaleString()}
              </p>
            </div>
            <div className="bg-secondary-muted p-3 md:p-6 rounded-btn border-2 md:border-4 border-secondary/10 shadow-hard-sm transition-all hover:bg-white">
              <p className="text-[8px] md:text-[10px] font-extrabold text-secondary uppercase tracking-widest leading-tight mb-1">
                Global Rank
              </p>
              <p className="font-display text-2xl md:text-4xl text-secondary leading-none">
                {globalRank ? `#${globalRank}` : '—'}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* ── Badges card (shown separately to match desktop layout) ── */}
      <section className="bg-white p-6 md:p-8 rounded-card border-4 border-ink/5 shadow-hard space-y-4 md:space-y-6">
        <h3 className="font-display text-lg md:text-xl uppercase tracking-tight text-ink/40">Insignias</h3>
        <div className="flex flex-wrap gap-3 md:gap-4">
          {BADGES.map((b, i) => (
            <div
              key={i}
              title={b.title}
              className={`w-14 h-14 md:w-16 md:h-16 ${b.bg} rounded-2xl border-2 ${b.border} flex items-center justify-center ${b.text} shadow-sm ${b.rotate}`}
            >
              <b.icon className="w-7 h-7 md:w-8 md:h-8" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
