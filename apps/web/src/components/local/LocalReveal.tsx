import React from 'react';
import { PLAYER_ROLES } from '@impostor/shared';
import { Button } from '../ui/Button';
import SkullIcon from '../icons/skull';
import SearchIcon from '../icons/search';
import { Avatar } from '../ui/Avatar';
import { type LocalPlayer } from '../../store/useLocalGameStore';
import GhostIcon from '../icons/ghost';

interface LocalRevealProps {
  votedPlayer: LocalPlayer;
  agentsWord: string;
  onContinue: () => void;
}

export const LocalReveal: React.FC<LocalRevealProps> = ({
  votedPlayer,
  agentsWord,
  onContinue
}) => {
  const isCorrect = votedPlayer.role === PLAYER_ROLES.IMPOSTOR || votedPlayer.role === PLAYER_ROLES.INFILTRADO;
  const roleRecord = votedPlayer.role === PLAYER_ROLES.INFILTRADO ? 'Infiltrada' : votedPlayer.role === PLAYER_ROLES.IMPOSTOR ? 'el Impostor' : 'un Agente Inocente';

  const config = {
    bg: isCorrect
      ? (votedPlayer.role === PLAYER_ROLES.INFILTRADO ? 'bg-secondary' : 'bg-accent')
      : 'bg-ink',
    title: isCorrect
      ? (votedPlayer.role === PLAYER_ROLES.INFILTRADO ? '¡SUTILEZA\nEXPUESTA!' : '¡JUSTICIA\nHECHA!')
      : '¡ERROR\nFATAL!',
    tagline: isCorrect ? 'Veredicto Grupal: Confirmado' : 'Veredicto Grupal: Fallido',
    buttonText: isCorrect ? 'Ver Victoria' : 'Siguiente Ronda',
    pattern: 'pattern-checkers'
  };

  return (
    <div className={`flex-1 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden ${config.bg} ${config.pattern}`}>
      {/* 1. Success Atmosphere */}
      {isCorrect && votedPlayer.role === PLAYER_ROLES.IMPOSTOR && (
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div className="absolute top-10 left-1/4 animate-bounce text-2xl">🎉</div>
          <div className="absolute top-20 right-1/4 animate-bounce delay-100 text-2xl">✨</div>
          <div className="absolute top-1/2 left-10 animate-bounce delay-200 text-2xl">⚡</div>
        </div>
      )}

      {/* 2. Failure Atmosphere - Ghost Icons */}
      {!isCorrect && (
        <>
          <GhostIcon className="absolute -top-12 -right-6 animate-float opacity-20 w-32 h-32 text-white" />
          <GhostIcon className="absolute top-1/2 -left-8 animate-float-delayed opacity-10 w-24 h-24 text-white" />
        </>
      )}

      <main className="flex-1 flex flex-col items-center justify-center space-y-10 animate-fade-in relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-8">
        {/* Title */}
        <div className="space-y-2">
          <h1 className="font-display text-5xl md:text-6xl drop-shadow-xl leading-tight -rotate-2 uppercase whitespace-pre-line">
            {config.title}
          </h1>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-white/40">
            {config.tagline}
          </p>
        </div>

        {/* Identity Card */}
        <div className="bg-white text-ink w-full p-8 rounded-card border-4 border-ink/5 shadow-hard-lg relative">
          <div className={`w-24 h-24 bg-ink/5 rounded-full border-4 border-ink/10 flex items-center justify-center mx-auto mb-6 relative`}>
            <Avatar
              avatarId={votedPlayer.avatarId}
              bgColor={votedPlayer.avatarColor}
              size="2xl"
              className={!isCorrect ? 'grayscale opacity-40' : ''}
            />
            {/* Reveal Badge */}
            <div className={`absolute -top-2 -right-2 p-1.5 rounded-md shadow-hard-sm bg-danger text-white flex items-center justify-center`}>
              {isCorrect ? (
                votedPlayer.role === PLAYER_ROLES.IMPOSTOR ? <SkullIcon className="w-4 h-4" /> : <SearchIcon className="w-4 h-4" />
              ) : (
                <GhostIcon className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          <h2 className="font-display text-4xl mb-1 uppercase tracking-tight">
            {votedPlayer.name}
          </h2>
          <p className="text-ink/40 text-[10px] font-extrabold uppercase tracking-[0.2em] mb-6">
            Era {roleRecord}
          </p>

          {/* Specific content for each type */}
          {votedPlayer.role === PLAYER_ROLES.INFILTRADO && (
            <div className="flex flex-col gap-2 relative mt-2">
              <div className="bg-accent/10 p-4 rounded-t-btn border-2 border-accent/20 text-left">
                <p className="text-[8px] font-bold text-accent uppercase tracking-widest mb-1">Agentes tenían:</p>
                <h3 className="font-display text-3xl text-accent uppercase tracking-widest leading-none">{agentsWord}</h3>
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-8 h-8 rounded-full border-2 border-ink/5 shadow-hard-sm flex items-center justify-center z-20">
                <span className="font-display text-danger text-xs">VS</span>
              </div>

              <div className="bg-danger/10 p-4 rounded-b-btn border-2 border-danger/20 text-left">
                <p className="text-[8px] font-bold text-danger uppercase tracking-widest mb-1">Infiltrada tenía:</p>
                <h3 className="font-display text-3xl text-danger uppercase tracking-widest leading-none">{votedPlayer.word}</h3>
              </div>
            </div>
          )}

          {votedPlayer.role === PLAYER_ROLES.IMPOSTOR && (
            <div className="bg-sticky-yellow text-ink px-4 py-2 rounded-btn shadow-hard border-2 border-ink/5 rotate-2 inline-block">
              <span className="font-display text-xs uppercase">¡Agentes Ganan!</span>
            </div>
          )}

          {votedPlayer.role === PLAYER_ROLES.AGENTE && (
            <div className="p-4 bg-danger/5 border-2 border-danger/10 rounded-btn">
              <p className="text-danger text-xs font-bold leading-relaxed uppercase tracking-widest italic">
                "¡Se los dije! ¡Yo no era!"
              </p>
            </div>
          )}
        </div>

        <div className="w-full space-y-4">
          <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px] animate-pulse">
            {isCorrect ? 'Han salvado la misión' : 'El impostor sigue riéndose...'}
          </p>
        </div>
      </main>

      <footer className="w-full mt-8 pb-4 relative z-10 max-w-2xl mx-auto px-4 sm:px-8">
        <Button
          onClick={onContinue}
          variant="ghost"
          className="w-full font-display text-2xl py-6 rounded-3xl shadow-hard active:translate-y-1 transition-all uppercase tracking-widest text-center"
        >
          <span className={`${config.bg.replace('bg-', 'text-')}`}>{config.buttonText}</span>
        </Button>
      </footer>
    </div>
  );
};
