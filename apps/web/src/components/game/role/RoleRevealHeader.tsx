import React from 'react';

interface RoleRevealHeaderProps {
  nickname: string | undefined;
  role?: string;
  showMystery?: boolean;
}

export const RoleRevealHeader: React.FC<RoleRevealHeaderProps> = ({ nickname, showMystery, role }) => {
  if (role === 'VINCULADO' || role === 'DISPERSO') {
    return (
      <div className="relative w-full px-4 text-center">
        <div className="absolute inset-0 bg-purple-500/20 blur-3xl rounded-full scale-110 animate-pulse"></div>
        <h1 className="font-display font-bold text-4xl md:text-5xl drop-shadow-2xl leading-tight -rotate-2 uppercase tracking-tight text-white italic">
           ¡ENTRA AL<br />CAOS!<br />
        </h1>
      </div>
    );
  }

  if (showMystery) {
    return (
      <div className="relative w-full px-4 text-center">
        <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full scale-110 animate-pulse"></div>
        <h1 className="font-display font-bold text-4xl md:text-5xl drop-shadow-lg leading-tight -rotate-2 uppercase tracking-tight text-white">
          ¡ERES UN<br />AGENTE!<br />
          <span className="text-2xl md:text-3xl opacity-80 italic">...¿O NO?</span>
        </h1>
      </div>
    );
  }

  return (
    <div className="space-y-3 text-center w-full">
      <h1 className="font-display text-3xl uppercase tracking-tighter text-ink/40">
        Hola, <span className="text-ink">{nickname?.toUpperCase()}</span>
      </h1>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/20">
        Toca la carta para ver tu rol
      </p>
    </div>
  );
};
