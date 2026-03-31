import React from 'react';
import { TIME_OPTIONS } from '../../constants/game';
import EditIcon from '../icons/edit';
import ChatBubbleIcon from '../icons/chat-bubble';
import ForumIcon from '../icons/forum';
import VoteIcon from '../icons/vote';
import VisibilityOffIcon from '../icons/visibility-off';

interface Step4FinalConfigProps {
  gameMode: 'TRADICIONAL' | 'CERCANAS' | 'CAOS' | null;
  roomName: string;
  setRoomName: (name: string) => void;
  maxPlayers: number;
  setMaxPlayers: (count: number) => void;
  clueTime: number;
  setClueTime: (time: number) => void;
  discussionTime: number;
  setDiscussionTime: (time: number) => void;
  votingTime: number;
  setVotingTime: (time: number) => void;
  isPrivate: boolean;
  setIsPrivate: (priv: boolean) => void;
}

const TIMERS = [
  {
    key: 'clues' as const,
    icon: ChatBubbleIcon,
    label: 'Tiempo de Pistas',
    color: 'primary',
    getVal: (p: Step4FinalConfigProps) => p.clueTime,
    setVal: (p: Step4FinalConfigProps) => p.setClueTime,
    options: TIME_OPTIONS.clues,
  },
  {
    key: 'discussion' as const,
    icon: ForumIcon,
    label: 'Tiempo de Discusión',
    color: 'secondary',
    getVal: (p: Step4FinalConfigProps) => p.discussionTime,
    setVal: (p: Step4FinalConfigProps) => p.setDiscussionTime,
    options: TIME_OPTIONS.discussion,
  },
  {
    key: 'voting' as const,
    icon: VoteIcon,
    label: 'Tiempo de Votación',
    color: 'danger',
    getVal: (p: Step4FinalConfigProps) => p.votingTime,
    setVal: (p: Step4FinalConfigProps) => p.setVotingTime,
    options: TIME_OPTIONS.voting,
  },
] as const;

export const Step4FinalConfig: React.FC<Step4FinalConfigProps> = (props) => {
  const {
    gameMode,
    roomName, setRoomName,
    maxPlayers, setMaxPlayers,
    isPrivate, setIsPrivate,
  } = props;

  const minPlayers = gameMode === 'CAOS' ? 4 : 3;

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="font-display text-4xl md:text-5xl mb-2 uppercase tracking-tight leading-none">
          Ajustes Finales
        </h2>
        <p className="text-xs text-ink/40 font-bold uppercase tracking-widest">
          Personaliza tu experiencia de juego al detalle
        </p>
      </div>

      {/* Mobile: single column | Desktop: 2-column grid */}
      <div className="w-full md:grid md:grid-cols-12 md:gap-10">
        
        {/* ── Left column: Room name, Players, Privacy ── */}
        <div className="md:col-span-7 space-y-8">
          {/* Room name */}
          <div className="space-y-3">
            <label className="font-display text-lg md:text-xl uppercase tracking-tight text-ink opacity-60 ml-1">
              Nombre de la Sala
            </label>
            <div className="relative group">
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Nombre de la Sala..."
                className="w-full bg-paper border-2 md:border-4 border-ink/5 p-5 pr-14 rounded-btn shadow-inner-hard font-bold md:font-display text-xl md:text-2xl uppercase tracking-wide focus:outline-none focus:border-primary transition-all"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-ink/20 group-focus-within:text-primary transition-colors">
                <EditIcon className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Max players */}
          <div className="space-y-3">
            <label className="font-display text-lg md:text-xl uppercase tracking-tight text-ink opacity-60 ml-1">
              Máximo de Jugadores
            </label>
            <div className="flex items-center gap-4 md:gap-6">
              <button
                disabled={maxPlayers <= minPlayers}
                onClick={() => setMaxPlayers(Math.max(minPlayers, maxPlayers - 1))}
                className="w-16 h-16 md:w-20 md:h-20 bg-white border-2 md:border-4 border-ink/5 rounded-btn shadow-hard flex items-center justify-center text-3xl md:text-4xl font-display active:translate-y-1 active:shadow-none transition-all disabled:opacity-20 disabled:pointer-events-none hover:bg-paper"
              >
                -
              </button>
              <div className="flex-1 h-16 md:h-20 bg-white border-2 md:border-4 border-ink/5 rounded-btn shadow-inner-hard flex items-center justify-center text-3xl md:text-5xl font-display text-primary">
                {maxPlayers}
              </div>
              <button
                disabled={maxPlayers >= 10}
                onClick={() => setMaxPlayers(Math.min(10, maxPlayers + 1))}
                className="w-16 h-16 md:w-20 md:h-20 bg-primary text-white border-2 md:border-4 border-white rounded-btn shadow-hard flex items-center justify-center text-3xl md:text-4xl font-display active:translate-y-1 active:shadow-none transition-all disabled:bg-ink/5 disabled:text-ink/20 disabled:border-none disabled:shadow-none disabled:pointer-events-none hover:brightness-110"
              >
                +
              </button>
            </div>
            {gameMode === 'CAOS' && (
              <p className="text-[10px] font-bold uppercase tracking-widest text-purple/60 ml-1">
                ⚡ Modo Caos requiere mínimo 4 jugadores
              </p>
            )}
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <label className="font-display text-lg md:text-xl uppercase tracking-tight text-ink opacity-60 ml-1">
              Privacidad
            </label>
            <button
              onClick={() => setIsPrivate(!isPrivate)}
              className="flex justify-between items-center bg-white p-5 md:p-7 rounded-card border-2 md:border-4 border-ink/5 shadow-hard w-full text-left active:translate-y-0.5 transition-all group"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${isPrivate ? 'bg-accent/10 text-accent' : 'bg-ink/5 text-ink/30'}`}>
                  <VisibilityOffIcon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <p className="font-display text-xl md:text-2xl leading-none uppercase tracking-tight">
                    Ocultar Sala
                  </p>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest mt-1">
                    No aparecerá en la lista pública de salas
                  </p>
                </div>
              </div>
              <div className={`w-14 h-8 md:w-20 md:h-11 rounded-full relative transition-colors shadow-inner ${isPrivate ? 'bg-accent' : 'bg-ink/10'}`}>
                <div className={`bg-white rounded-full absolute shadow-md transition-all ${isPrivate ? 'md:left-10 left-7' : 'left-1'} top-1 w-6 h-6 md:w-9 md:h-9`} />
              </div>
            </button>
          </div>

          {/* Mobile: timers (inline) */}
          <div className="md:hidden space-y-4">
            <label className="font-display text-lg uppercase tracking-tight text-ink opacity-60 ml-1">
              Tiempos de Partida
            </label>
            {TIMERS.map((timer) => (
              <div key={timer.key} className="flex justify-between items-center bg-white p-4 rounded-btn border-2 border-ink/5 shadow-hard">
                <div className="flex items-center gap-3">
                  <timer.icon className={`w-6 h-6 text-${timer.color}`} />
                  <span className="font-bold uppercase tracking-widest text-xs">{timer.label}</span>
                </div>
                <select
                  value={timer.getVal(props)}
                  onChange={(e) => timer.setVal(props)(Number(e.target.value))}
                  className={`bg-${timer.color}-muted text-${timer.color} font-bold px-4 py-2 rounded-lg border-none focus:ring-0 cursor-pointer appearance-none`}
                >
                  {timer.options.map((t) => <option key={t} value={t}>{t}s</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column: Timers panel (desktop only) ── */}
        <div className="hidden md:block md:col-span-5">
          <div className="bg-white p-8 rounded-card border-4 border-ink/5 shadow-hard space-y-8 h-full">
            <h4 className="font-display text-2xl uppercase tracking-tight text-ink border-b-4 border-ink/5 pb-4">
              Tiempos de Partida
            </h4>
            {TIMERS.map((timer) => (
              <div key={timer.key} className="space-y-3">
                <div className={`flex items-center gap-3 text-${timer.color}`}>
                  <timer.icon className="w-5 h-5" />
                  <span className="font-bold uppercase tracking-[0.2em] text-[10px]">{timer.label}</span>
                </div>
                <select
                  value={timer.getVal(props)}
                  onChange={(e) => timer.setVal(props)(Number(e.target.value))}
                  className={`w-full bg-${timer.color}-muted text-${timer.color} font-display text-xl px-6 py-4 rounded-btn border-none focus:ring-4 focus:ring-${timer.color}/20 cursor-pointer appearance-none shadow-sm`}
                >
                  {timer.options.map((t) => <option key={t} value={t}>{t} Segundos</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
