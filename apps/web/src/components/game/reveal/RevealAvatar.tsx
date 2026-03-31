import React from 'react';
import { Avatar } from '../../ui/Avatar';

interface RevealAvatarProps {
  targetPlayer: any;
}

export const RevealAvatar: React.FC<RevealAvatarProps> = ({ targetPlayer }) => {
  return (
    <div className="relative mb-12 z-20 group">
      {/* Visual Identity Ring */}
      <div className={`absolute -inset-4 rounded-full border-4 border-dashed border-ink/10 animate-[spin_10s_linear_infinite] pointer-events-none ${!targetPlayer ? 'opacity-20' : 'opacity-100'}`}></div>

      {targetPlayer && (
        <div className="absolute -top-6 -right-6 z-40 animate-[stamp_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
          <div className="bg-danger text-white px-4 py-1.5 border-4 border-white shadow-hard transform rotate-12 flex flex-col items-center">
            <span className="font-mono text-[8px] font-black tracking-widest uppercase leading-none">Status</span>
            <span className="font-display text-lg font-black uppercase tracking-tighter leading-none">Eliminado</span>
          </div>
        </div>
      )}

      <div
        className={`w-52 h-52 rounded-4xl border-8 border-white shadow-hard-xl flex items-center justify-center overflow-hidden relative transition-all duration-500 scale-110 ${targetPlayer ? 'grayscale-[0.4] brightness-90 translate-y-2' : ''}`}
        style={{ backgroundColor: targetPlayer?.color || '#334155' }}
      >
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)] rounded-4xl pointer-events-none z-10"></div>
        {targetPlayer ? (
          <Avatar
            avatarId={targetPlayer.avatar}
            bgColor={targetPlayer.color || '#FFD166'}
            size="xl"
            className="scale-[2.2] border-none shadow-none"
          />
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-white/20 text-8xl">groups</span>
            <span className="font-display text-2xl text-white/10 uppercase tracking-widest italic font-black">Empate</span>
          </div>
        )}
      </div>

      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-ink text-white px-10 py-3 border-b-4 border-slate-700 shadow-hard whitespace-nowrap z-30 rounded-2xl">
        <span className="font-display text-2xl uppercase italic tracking-tighter">{targetPlayer?.nickname || 'Sin Selección'}</span>
      </div>
    </div>
  );
};

