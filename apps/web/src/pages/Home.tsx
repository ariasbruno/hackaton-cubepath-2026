import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Avatar } from '../components/ui/Avatar';
import { RegistrationModal } from '../components/auth/RegistrationModal';
import { PageTransition } from '../components/layout/PageTransition';
import StarsIcon from '../components/icons/stars';
import PlayCircleIcon from '../components/icons/play-circle';
import VideogameAssetIcon from '../components/icons/videogame-asset';
import PersonSearchIcon from '../components/icons/person-search';
import TheaterComedyIcon from '../components/icons/theater-comedy';
import VoteIcon from '../components/icons/vote';
import HelpIcon from '../components/icons/help';
import HistoryIcon from '../components/icons/history';
import RocketLaunchIcon from '../components/icons/rocket-launch';

/* ── Data ── */
const HOW_TO_PLAY = [
  { icon: PersonSearchIcon, color: 'secondary', label: 'Obtener Rol', desc: 'Recibe tu palabra secreta', target: '#roles' },
  { icon: TheaterComedyIcon, color: 'purple', label: 'Engañar', desc: 'Miente sin que te atrapen', target: '#engano' },
  { icon: VoteIcon, color: 'danger', label: 'Votar', desc: 'Expulsa al impostor', target: '#voto' },
  { icon: HelpIcon, color: 'accent', label: 'Ayuda', desc: 'Guías y consejos', target: '' },
] as const;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { playerId, nickname, avatar, color, totalScore, isRegistered, initGuest } = useAuthStore();
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const attemptedRef = React.useRef(false);

  useEffect(() => {
    if (!playerId && !attemptedRef.current) {
      attemptedRef.current = true;
      initGuest();
    }
  }, [playerId, initGuest]);

  const handleStartGame = () => {
    if (!isRegistered) {
      setRegistrationOpen(true);
    } else {
      navigate('/rooms');
    }
  };

  if (!playerId) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-paper">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <PageTransition className="bg-paper pattern-dots overflow-hidden selection:bg-primary selection:text-white">

      {/* ── Desktop Top Bar ── only on md+ */}
      <header className="hidden md:flex h-[72px] bg-white/60 backdrop-blur-sm border-b-2 border-ink/5 px-8 items-center justify-between shrink-0 z-20">
        <div>
          <p className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">
            {isRegistered ? 'Bienvenido de nuevo,' : 'Modo Invitado,'}
          </p>
          <div className="flex items-center gap-2">
            <h1 className={`font-display text-xl text-ink uppercase tracking-tight leading-none ${!isRegistered ? 'text-ink/50 italic' : ''}`}>
              {nickname}
            </h1>
            {!isRegistered && (
              <span className="bg-ink/5 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest text-ink/30 border border-ink/5">
                Temp
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-hard-sm border-2 border-ink/5">
            <StarsIcon className="w-4 h-4 text-yellow" />
            <span className="font-bold font-mono text-base">{totalScore.toLocaleString()}</span>
          </div>
          <div className="w-11 h-11 rounded-full border-2 border-white shadow-hard-sm overflow-hidden flex items-center justify-center">
            <Avatar avatarId={avatar || 'noto--bear'} bgColor={color || undefined} size="full" />
          </div>
        </div>
      </header>

      {/* ── Scrollable main (both layouts) ── */}
      <main className="flex-1 overflow-y-auto no-scrollbar">

        {/* ════ MOBILE LAYOUT ════ (hidden md+) */}
        <div className="md:hidden flex flex-col gap-8 px-6 pt-8 pb-32">

          {/* Mobile header */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-11 h-11 rounded-full border-2 border-white shadow-hard-sm overflow-hidden flex items-center justify-center">
                  <Avatar avatarId={avatar || 'noto--bear'} bgColor={color || undefined} size="full" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">
                    {isRegistered ? 'Bienvenido,' : 'Modo Invitado,'}
                  </p>
                  <div className="flex items-center gap-1">
                    <h1 className={`font-display text-xl leading-none ${!isRegistered ? 'text-ink/60 italic' : ''}`}>
                      {nickname}
                    </h1>
                    {!isRegistered && (
                      <div className="bg-ink/5 px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest text-ink/30 border border-ink/5">
                        Temp
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-white px-4 py-2 rounded-full shadow-hard-sm border-2 border-ink/5 flex items-center gap-2">
                <StarsIcon className="w-5 h-5 text-yellow" />
                <span className="font-bold font-mono text-sm">{totalScore}</span>
              </div>
            </div>

            {/* Mobile CTA */}
            <button
              onClick={handleStartGame}
              className="w-full bg-primary text-white py-5 rounded-card shadow-hard-lg hover:translate-y-1 hover:shadow-hard transition-all active:translate-y-2 active:shadow-none relative overflow-hidden group flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-card" />
              <span className="font-display text-3xl tracking-wide drop-shadow-md relative z-10 uppercase">
                Iniciar Juego
              </span>
              <PlayCircleIcon className="w-9 h-9 drop-shadow-md relative z-10" />
              <div className="absolute top-0 right-0 p-2 opacity-20">
                <VideogameAssetIcon className="w-12 h-12" />
              </div>
            </button>
          </header>

          {/* Mobile How To Play */}
          <section className="flex flex-col gap-4">
            <h2 className="font-display text-2xl text-ink uppercase tracking-tight">¿Cómo Jugar?</h2>
            <div className="grid grid-cols-2 gap-4">
              {HOW_TO_PLAY.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="bg-white p-5 rounded-card shadow-hard border-2 border-ink/5 flex flex-col items-center text-center gap-2 hover:bg-paper active:scale-95 transition-all cursor-pointer group"
                    onClick={() => navigate('/help' + (item.target || ''))}
                  >
                    <div className={`w-14 h-14 bg-${item.color}-muted text-${item.color} rounded-full flex items-center justify-center mb-1 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-display text-lg leading-tight uppercase">{item.label}</h3>
                    <p className="text-[10px] text-ink/40 font-bold leading-tight uppercase">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Mobile Recent Rooms */}
          <section className="mb-4">
            <div className="flex justify-between items-end mb-4 px-1">
              <h2 className="font-display text-xl text-ink uppercase tracking-tight">Salas Recientes</h2>
              <button onClick={() => navigate('/rooms')} className="text-[10px] font-bold text-secondary uppercase tracking-widest hover:underline">
                Ver Todo
              </button>
            </div>
            <div className="bg-white p-5 rounded-card shadow-hard-sm border border-ink/5 flex items-center justify-center">
              <p className="text-sm font-bold text-ink/20 uppercase tracking-wider py-4">Sin salas recientes</p>
            </div>
          </section>
        </div>

        {/* ════ DESKTOP LAYOUT ════ (hidden below md) */}
        <div className="hidden md:block p-8 space-y-8">

          {/* Hero Grid: CTA (8 cols) + Featured Mode (4 cols) */}
          <div className="grid grid-cols-12 gap-6">

            {/* Main CTA Card */}
            <div className="col-span-8">
              <button
                onClick={handleStartGame}
                className="block w-full h-48 bg-primary text-white rounded-card shadow-hard-lg hover:translate-y-1 hover:shadow-hard transition-all active:translate-y-2 active:shadow-none relative overflow-hidden group p-7 text-left"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-card" />
                <div className="relative z-10 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="font-display text-4xl xl:text-5xl uppercase tracking-tighter mb-2">¡A Jugar!</h2>
                    <p className="font-bold text-white/80 uppercase tracking-widest text-[13px]">
                      Crea una sala o únete a una partida
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <PlayCircleIcon className="w-12 h-12 drop-shadow-md" />
                    <span className="bg-white/20 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[11px] backdrop-blur-sm border border-white/20">
                      Salas activas ahora mismo
                    </span>
                  </div>
                </div>
                <VideogameAssetIcon className="absolute -right-6 -bottom-6 w-48 h-48 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
              </button>
            </div>

            {/* Featured: Modo Caos */}
            <div className="col-span-4 h-48 bg-white rounded-card shadow-hard border-4 border-ink/5 p-7 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-danger text-white px-3 py-1 font-bold text-[8px] uppercase tracking-widest rotate-12 translate-x-2 translate-y-4 shadow-sm border-2 border-white z-10">
                ¡NUEVO!
              </div>
              <div>
                <h3 className="font-display text-xl uppercase text-ink">Modo Caos</h3>
                <p className="text-[11px] font-bold text-ink/40 uppercase leading-snug mt-2">
                  Prueba la nueva dinámica de vínculos secretos.
                </p>
              </div>
              <button
                onClick={() => navigate('/create', { state: { presetMode: 'CAOS', presetConnection: 'online' } })}
                className="bg-purple text-white py-2 rounded-btn shadow-hard font-display uppercase tracking-widest text-[13px] hover:translate-y-0.5 hover:shadow-hard-sm active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <RocketLaunchIcon className="w-4 h-4" />
                Explorar
              </button>
            </div>
          </div>

          {/* Dashboard Sections: How to Play (7 cols) + Recent Rooms (5 cols) */}
          <div className="grid grid-cols-12 gap-6">

            {/* ¿Cómo Funciona? */}
            <div className="col-span-7 space-y-5">
              <h2 className="font-display text-2xl uppercase tracking-tight ml-1">¿Cómo Funciona?</h2>
              <div className="grid grid-cols-2 gap-4">
                {HOW_TO_PLAY.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="bg-white p-6 rounded-card shadow-hard border-2 border-ink/5 flex flex-col items-center text-center gap-3 hover:bg-paper transition-all cursor-pointer group"
                      onClick={() => navigate('/help' + (item.target || ''))}
                    >
                      <div className={`w-16 h-16 bg-${item.color}-muted text-${item.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner-hard`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg uppercase">{item.label}</h3>
                        <p className="text-[9px] text-ink/40 font-bold uppercase mt-1">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Salas Recientes */}
            <div className="col-span-5 space-y-5">
              <div className="flex justify-between items-end px-1">
                <h2 className="font-display text-2xl uppercase tracking-tight">Salas Recientes</h2>
                <button
                  onClick={() => navigate('/rooms')}
                  className="text-[11px] font-bold text-secondary uppercase tracking-widest hover:underline"
                >
                  Ver Todo
                </button>
              </div>

              <div className="space-y-4">
                {/* Empty state — end of history */}
                <div className="border-4 border-dashed border-ink/5 rounded-card p-8 flex flex-col items-center justify-center gap-4 opacity-30">
                  <HistoryIcon className="w-10 h-10" />
                  <p className="font-bold uppercase tracking-widest text-[13px]">Sin salas recientes</p>
                </div>

                {/* Example of a future room item — hidden when empty */}
                {/* 
                <div className="bg-white p-5 rounded-card shadow-hard-sm border border-ink/5 flex items-center justify-between group cursor-pointer hover:translate-x-2 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary text-white rounded-2xl border-4 border-white shadow-hard-sm flex items-center justify-center font-display text-2xl shrink-0">#1</div>
                    <div>
                      <p className="font-display text-lg text-ink uppercase">Nombre Sala</p>
                      <p className="text-xs font-bold text-ink/40 uppercase mt-0.5">Host: Bruno • 4 Jugadores</p>
                    </div>
                  </div>
                  <button className="bg-paper text-ink p-3 rounded-full shadow-hard-sm border border-ink/5 group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowForwardIcon className="w-5 h-5" />
                  </button>
                </div>
                */}
              </div>
            </div>
          </div>
        </div>
      </main>

      <RegistrationModal
        isOpen={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
        onSuccess={() => navigate('/rooms')}
      />
    </PageTransition>
  );
};
