import React from 'react';
import { Avatar } from '../../ui/Avatar';
import { Button } from '../../ui/Button';
import CloseIcon from '../../icons/close';
import VerifiedIcon from '../../icons/verified';

interface ConclusionViewProps {
  currentPlayer: any;
  players: any[];
  winnerTeam: string;
  isImpostorWin: boolean;
  isAgenteWin: boolean;
  isCercanasMode?: boolean;
  onContinue: () => void;
}

export const ConclusionView: React.FC<ConclusionViewProps> = ({
  currentPlayer,
  players,
  isImpostorWin,
  isAgenteWin,
  isCercanasMode,
  onContinue,
}) => {
  if (!currentPlayer) return null;

  const myRole = currentPlayer.role;
  const isImpostor = myRole === 'IMPOSTOR' || myRole === 'INFILTRADO' || myRole === 'VINCULADO';
  const isAgente = myRole === 'AGENTE' || myRole === 'DISPERSO';

  // Detailed breakdown simulation based on server ScoringRules
  const breakdown = [];
  if (isImpostorWin && isImpostor) {
    if (myRole === 'VINCULADO') {
      breakdown.push({ label: 'Vínculo Logrado', value: 60 });
    } else {
      breakdown.push({ label: isCercanasMode ? 'Misión Infiltrado' : 'Misión Impostor', value: 50 });
    }
    if (currentPlayer.isAlive) breakdown.push({ label: 'Supervivencia', value: 20 });
  } else if (isAgenteWin && isAgente) {
    breakdown.push({ label: myRole === 'DISPERSO' ? 'Caos Controlado' : 'Misión Agente', value: 25 });
  }

  if (currentPlayer.hasVoted) {
    if (currentPlayer.votedFor === null && !isCercanasMode) breakdown.push({ label: 'Voto Abstenido', value: 5 });
    else {
      if (myRole === 'DISPERSO' && currentPlayer.votedAction === 'ACCUSE') {
        const vinculados = players.filter(p => p.role === 'VINCULADO');
        const correct = currentPlayer.votedTargets?.length === 2 && 
                         currentPlayer.votedTargets.every((id: string) => vinculados.some((v: any) => v.id === id));
        if (correct) breakdown.push({ label: 'Acusación Correcta', value: 30 });
      } else if (myRole === 'VINCULADO' && currentPlayer.votedAction === 'LINK') {
        const vinculados = players.filter(p => p.role === 'VINCULADO');
        const correct = vinculados.some((v: any) => v.id === currentPlayer.votedFor && v.id !== currentPlayer.id);
        if (correct) breakdown.push({ label: 'Enlace Éxito', value: 40 });
      } else {
        const target = players.find((pl: any) => pl.id === currentPlayer.votedFor);
        const isTargetImpostor = target?.role === 'IMPOSTOR' || target?.role === 'INFILTRADO';
        if (isTargetImpostor) breakdown.push({ label: 'Voto Certero', value: 10 });
        else if (isAgente) breakdown.push({ label: 'Error de Juicio', value: -5 });
      }
    }
  }

  const didIWin = (isImpostorWin && isImpostor) || (isAgenteWin && isAgente);

  const bgClass = didIWin ? 'bg-accent' : 'bg-danger';
  const badgeText = didIWin ? (isAgenteWin ? 'MISIÓN ÉXITO' : 'VICTORIA') : 'DERROTA';

  const impostorName = myRole === 'VINCULADO' ? 'VÍNCULO' : (isCercanasMode ? 'INFILTRADO' : 'IMPOSTOR');
  const title = didIWin
    ? (isImpostorWin ? `¡EL ${impostorName} HA ENGAÑADO A TODOS!` : '¡VICTORIA LOGRADA!')
    : (isImpostorWin ? `¡EL ${impostorName} NOS HA ENGAÑADO!` : '¡MISIÓN FALLIDA!');

  return (
    <div className={`h-full w-full overflow-y-auto no-scrollbar animate-fade-in text-white pattern-checkers ${bgClass}`}>
      <div className="min-h-full flex flex-col p-6 py-12 mx-auto w-full max-w-sm">
        <div className="my-auto w-full flex flex-col items-center">
          <main className="flex-1 flex flex-col items-center justify-center space-y-12 w-full animate-fade-in py-8">
            <h1 className="font-display text-4xl md:text-5xl uppercase tracking-widest drop-shadow-lg leading-tight -rotate-2 text-center">
              {title}
            </h1>

            <div className="bg-white w-full paper-tear shadow-hard-lg p-8 pb-16 relative text-ink transition-transform hover:scale-[1.01]">
              <div className={`absolute -top-6 left-1/2 -translate-x-1/2 ${bgClass} text-white px-8 py-2 rounded-full font-display text-xl shadow-hard border-4 border-white uppercase whitespace-nowrap`}>
                {badgeText}
              </div>

              <div className="flex flex-col items-center mt-6">
                <div className="relative mb-6">
                  <Avatar
                    avatarId={currentPlayer.avatar || 'noto--bear'}
                    bgColor={currentPlayer.color || '#FFD166'}
                    size="xl"
                    className={`${!didIWin ? 'grayscale' : ''} border-ink shadow-hard-lg`}
                  />
                  {!didIWin && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <CloseIcon className="w-9 h-9 text-danger scale-[2.5]" />
                    </div>
                  )}
                  {didIWin && (
                    <div className="absolute -bottom-2 -right-2 bg-white text-accent w-10 h-10 rounded-full border-4 border-accent flex items-center justify-center shadow-hard-sm">
                      <VerifiedIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <h2 className="font-display text-3xl tracking-tight text-ink">{currentPlayer.nickname}</h2>
                <p className="text-ink/40 font-bold uppercase tracking-widest text-[10px] mb-8">
                  {isImpostor 
                    ? (isCercanasMode ? 'Infiltrado Silencioso' : 'El Genio del Engaño') 
                    : 'Agente del Orden'}
                </p>

                <div className="w-full space-y-3">
                  {breakdown.length > 0 ? breakdown.map((item, i) => (
                    <div key={i} className={`flex justify-between items-center ${didIWin ? 'bg-accent-muted' : 'bg-danger-muted'} p-4 rounded-btn border-2 ${didIWin ? 'border-accent/10' : 'border-danger/10'} shadow-hard-sm`}>
                      <span className={`font-extrabold uppercase tracking-widest text-[10px] ${didIWin ? 'text-accent' : 'text-danger'}`}>{item.label}</span>
                      <span className={`font-display text-2xl ${didIWin ? 'text-accent' : 'text-danger'}`}>{item.value > 0 ? `+${item.value}` : item.value}</span>
                    </div>
                  )) : (
                    <div className={`flex justify-between items-center ${didIWin ? 'bg-accent-muted' : 'bg-danger-muted'} p-4 rounded-btn border-2 ${didIWin ? 'border-accent/10' : 'border-danger/10'} shadow-hard-sm`}>
                      <span className={`font-extrabold uppercase tracking-widest text-[10px] ${didIWin ? 'text-accent' : 'text-danger'}`}>Participación</span>
                      <span className={`font-display text-2xl ${didIWin ? 'text-accent' : 'text-danger'}`}>+0</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <Button variant="paper" size="xl" onClick={onContinue} className="text-ink! shadow-hard-lg">
                Continuar
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
