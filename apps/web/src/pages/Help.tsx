import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PageTransition } from '../components/layout/PageTransition';
import HelpCenterIcon from '../components/icons/help';
import PersonSearchIcon from '../components/icons/person-search';
import TheaterComedyIcon from '../components/icons/theater-comedy';
import VoteIcon from '../components/icons/vote';
import VideogameAssetIcon from '../components/icons/videogame-asset';
import StarsIcon from '../components/icons/stars';
import BoltIcon from '../components/icons/bolt';
import TranslateIcon from '../components/icons/translate';

export const Help: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <PageTransition className="bg-paper pattern-dots selection:bg-primary selection:text-white flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b-2 border-ink/5 p-8 md:p-12 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div className="w-16 h-16 bg-primary text-white rounded-2xl border-4 border-ink shadow-hard flex items-center justify-center rotate-3">
            <HelpCenterIcon className="w-10 h-10" />
          </div>
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-ink uppercase tracking-tight leading-none">
              Centro de Ayuda
            </h1>
            <p className="text-xs font-bold text-ink/40 uppercase tracking-[0.2em] mt-2">
              Domina el arte del engaño y la deducción
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-24 pb-32">
        {/* Section 1: Explicación General */}
        <section id="general" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-ink/5 rounded-xl flex items-center justify-center">
              <VideogameAssetIcon className="w-6 h-6 text-ink/60" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight">Reglas Generales</h2>
          </div>
          <div className="bg-white p-8 md:p-10 rounded-card shadow-hard border-2 border-ink/5 space-y-6">
            <p className="text-lg leading-relaxed text-ink/80">
              El Impostor es un juego de <span className="font-bold text-primary">deducción social</span> donde la sutileza es tu mejor arma. Los jugadores reciben una palabra secreta, excepto uno o más jugadores que tendrán el rol de impostores.
            </p>
            <div className="grid md:grid-cols-2 gap-8 pt-4">
              <div className="space-y-4">
                <h3 className="font-display text-xl uppercase text-ink/40">Dinámica:</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <span className="text-sm font-bold uppercase tracking-wide">Cada jugador da una pista de una sola palabra sobre su secreto.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <span className="text-sm font-bold uppercase tracking-wide">Dialoguen y debatan quién dio la pista más sospechosa.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <span className="text-sm font-bold uppercase tracking-wide">Voten para expulsar al que creen que no sabe la palabra.</span>
                  </li>
                </ul>
              </div>
              <div className="bg-paper p-6 rounded-2xl border-2 border-ink/5 border-dashed">
                <h3 className="font-display text-xl uppercase mb-3">Objetivo:</h3>
                <p className="text-sm font-bold uppercase tracking-widest text-ink/40 leading-relaxed">
                  Los Agentes deben identificar a los impostores. Los Impostores deben sobrevivir o adivinar la palabra secreta de los agentes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Modos de Juego */}
        <section id="modos" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-ink/5 rounded-xl flex items-center justify-center">
              <BoltIcon className="w-6 h-6 text-ink/60" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight">Modos de Juego</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: PersonSearchIcon, title: 'Tradicional', color: 'primary', 
                desc: 'Un solo impostor que no sabe nada. El resto tiene la misma palabra.' 
              },
              { 
                icon: TranslateIcon, title: 'Cercanas', color: 'secondary', 
                desc: 'Un infiltrado recibe una palabra muy similar pero distinta a la de los agentes.' 
              },
              { 
                icon: BoltIcon, title: 'Modo Caos', color: 'purple', 
                desc: 'Los jugadores pueden estar vinculados (parejas con la misma palabra) o dispersos (solos).' 
              }
            ].map(m => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="bg-white p-8 rounded-card border-4 border-ink/5 shadow-hard flex flex-col items-center text-center gap-4 hover:border-ink/10 transition-all group">
                  <div className={`w-20 h-20 bg-${m.color}/10 text-${m.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="font-display text-2xl uppercase tracking-tight">{m.title}</h3>
                  <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Roles por Modo */}
        <section id="roles" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-ink/5 rounded-xl flex items-center justify-center">
              <PersonSearchIcon className="w-6 h-6 text-ink/60" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight">Roles del Juego</h2>
          </div>
          <div className="space-y-6">
            {/* Tradicional/Cercanas */}
            <div className="bg-white p-8 rounded-card border-2 border-ink/5 shadow-hard">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-ink/5 text-ink/40 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-ink/10">Base</span>
                <h3 className="font-display text-2xl uppercase">Tradicional y Cercanas</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h4 className="text-primary font-display text-lg uppercase mb-2">Agente</h4>
                  <p className="text-[10px] font-bold text-ink/50 uppercase leading-relaxed">Tiene la palabra secreta. Debe encontrar quién no la tiene sin revelar demasiado.</p>
                </div>
                <div>
                  <h4 className="text-danger font-display text-lg uppercase mb-2">Impostor</h4>
                  <p className="text-[10px] font-bold text-ink/50 uppercase leading-relaxed">No tiene palabra. Debe fingir que la tiene y observar las pistas de los demás.</p>
                </div>
                <div>
                  <h4 className="text-secondary font-display text-lg uppercase mb-2">Infiltrado</h4>
                  <p className="text-[10px] font-bold text-ink/50 uppercase leading-relaxed">Exclusivo del modo Cercanas. Tiene una palabra similar (ej: "León" vs "Tigre").</p>
                </div>
              </div>
            </div>

            {/* Modo Caos */}
            <div className="bg-white/50 backdrop-blur-sm p-8 rounded-card border-4 border-purple/10 border-dashed">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-purple/10 text-purple text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-purple/20">Modo Caos</span>
                <h3 className="font-display text-2xl uppercase">Roles Dinámicos</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="relative p-6 bg-white rounded-2xl shadow-hard-sm border-2 border-ink/5">
                  <h4 className="text-purple font-display text-xl uppercase mb-3 flex items-center gap-2">
                    Vinculados
                    <span className="text-[10px] font-body italic opacity-40">(Pareja)</span>
                  </h4>
                  <p className="text-sm font-bold text-ink/50 uppercase leading-relaxed">Dos jugadores comparten la misma palabra. Su meta es encontrarse sin que los demás lo noten.</p>
                </div>
                <div className="relative p-6 bg-white rounded-2xl shadow-hard-sm border-2 border-ink/5">
                  <h4 className="text-accent font-display text-xl uppercase mb-3 flex items-center gap-2">
                    Dispersos
                    <span className="text-[10px] font-body italic opacity-40">(Solo)</span>
                  </h4>
                  <p className="text-sm font-bold text-ink/50 uppercase leading-relaxed">Jugadores con palabras únicas. Nadie comparte su secreto. Están solos en el juego.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: El Arte del Engaño */}
        <section id="engano" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-ink/5 rounded-xl flex items-center justify-center">
              <TheaterComedyIcon className="w-6 h-6 text-ink/60" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight">El Arte del Engaño</h2>
          </div>
          <div className="bg-purple text-white p-10 rounded-card shadow-hard-lg border-4 border-white/20 relative overflow-hidden">
             <div className="relative z-10 grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <h3 className="font-display text-2xl uppercase">¿Cómo mentir con éxito?</h3>
                  <p className="font-bold text-white/70 uppercase tracking-widest text-xs leading-relaxed">
                    Si eres impostor, el silencio es tu amigo pero la imitación es tu salvación. Observa las caras, escucha las palabras.
                  </p>
                </div>
                <ul className="space-y-4">
                  {[
                    'Usa palabras genéricas que encajen en varios temas.',
                    'Repite conceptos de pistas anteriores si suenan seguros.',
                    'Duda estratégicamente para no verte demasiado confiado.',
                    'Apunta a alguien rápidamente si ves una pista débil.'
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                      <span className="text-sm font-bold uppercase tracking-wide leading-tight">{tip}</span>
                    </li>
                  ))}
                </ul>
             </div>
             <TheaterComedyIcon className="absolute -right-10 -bottom-10 w-64 h-64 opacity-5 rotate-12" />
          </div>
        </section>

        {/* Section 5: Votación */}
        <section id="voto" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-ink/5 rounded-xl flex items-center justify-center">
              <VoteIcon className="w-6 h-6 text-ink/60" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight">Votación y Juicio</h2>
          </div>
          <div className="bg-white p-10 rounded-card shadow-hard border-2 border-ink/5 text-center">
             <p className="text-xl font-bold uppercase tracking-widest text-ink/30 mb-10 max-w-2xl mx-auto">
               Cuando el debate termina, llega el momento de la verdad.
             </p>
             <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="bg-danger/5 p-6 rounded-2xl border-2 border-danger/10">
                  <h4 className="text-danger font-display text-xl uppercase mb-2">Mayoría Simple</h4>
                  <p className="text-[10px] font-bold text-ink/40 uppercase leading-relaxed">El jugador con más votos es expulsado. En caso de empate, nadie es expulsado y se continúa otra ronda o se decide por azar.</p>
                </div>
                <div className="bg-primary/5 p-6 rounded-2xl border-2 border-primary/10">
                  <h4 className="text-primary font-display text-xl uppercase mb-2">Última Palabra</h4>
                  <p className="text-[10px] font-bold text-ink/40 uppercase leading-relaxed">Si el expulsado es el impostor, tiene un último intento de adivinar la palabra de los agentes para revertir el resultado.</p>
                </div>
             </div>
          </div>
        </section>

        {/* Section 6: Puntuaciones */}
        <section id="puntuacion" className="scroll-mt-32">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-ink/5 rounded-xl flex items-center justify-center">
              <StarsIcon className="w-6 h-6 text-ink/60" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl uppercase tracking-tight">Sistema de Puntos</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-display text-2xl uppercase ml-2">Base (Tradicional/Cercanas)</h3>
              <div className="space-y-3">
                <div className="bg-white p-5 rounded-btn shadow-hard-sm border-2 border-ink/5 flex justify-between items-center">
                  <span className="font-bold uppercase tracking-widest text-xs">Agente gana</span>
                  <span className="bg-primary text-white px-4 py-1 rounded-full font-mono font-bold">+100 pts</span>
                </div>
                <div className="bg-white p-5 rounded-btn shadow-hard-sm border-2 border-ink/5 flex justify-between items-center">
                  <span className="font-bold uppercase tracking-widest text-xs">Impostor gana</span>
                  <span className="bg-danger text-white px-4 py-1 rounded-full font-mono font-bold">+300 pts</span>
                </div>
                <div className="bg-white p-5 rounded-btn shadow-hard-sm border-2 border-ink/5 flex justify-between items-center">
                  <span className="font-bold uppercase tracking-widest text-xs">Adivinar palabra (Final)</span>
                  <span className="bg-yellow text-ink px-4 py-1 rounded-full font-mono font-bold">+150 pts</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-display text-2xl uppercase ml-2">Caos</h3>
              <div className="space-y-3">
                <div className="bg-white p-5 rounded-btn shadow-hard-sm border-2 border-ink/10 border-dashed flex justify-between items-center">
                  <span className="font-bold uppercase tracking-widest text-xs">Encontrar pareja</span>
                  <span className="bg-purple text-white px-4 py-1 rounded-full font-mono font-bold">+200 pts</span>
                </div>
                <div className="bg-white p-5 rounded-btn shadow-hard-sm border-2 border-ink/10 border-dashed flex justify-between items-center">
                  <span className="font-bold uppercase tracking-widest text-xs">Disperso sobrevive</span>
                  <span className="bg-accent text-white px-4 py-1 rounded-full font-mono font-bold">+250 pts</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>
    </PageTransition>
  );
};
