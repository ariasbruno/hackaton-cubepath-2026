import React from 'react';
import { SelectionCard } from '../ui/SelectionCard';
import WifiIcon from '../icons/wifi';
import SmartphoneIcon from '../icons/smartphone';

interface Step1ConnectionProps {
  connection: 'local' | 'online' | null;
  setConnection: (type: 'local' | 'online') => void;
}

export const Step1Connection: React.FC<Step1ConnectionProps> = ({ connection, setConnection }) => (
  <>
    <div className="text-center mb-10">
      <h2 className="font-display text-4xl md:text-5xl mb-2 uppercase tracking-tight leading-none">
        ¿Cómo Jugamos?
      </h2>
      <p className="text-xs text-ink/40 font-bold uppercase tracking-widest">
        Elige el tipo de conexión para tu partida
      </p>
    </div>

    {/* Mobile: vertical list | Desktop: 2-column grid, portrait cards */}
    <div className="w-full space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
      {/* Online */}
      <button
        type="button"
        onClick={() => setConnection('online')}
        className={`block relative w-full cursor-pointer group text-left md:text-center`}
      >
        {/* Mobile: horizontal card */}
        <div className="md:hidden">
          <SelectionCard
            selected={connection === 'online'}
            onSelect={() => setConnection('online')}
            icon={WifiIcon}
            title="Modo Online"
            description="Cada uno con su móvil a través de internet."
            activeColor="secondary"
            size="lg"
            variant="circle"
          />
        </div>
        {/* Desktop: portrait card */}
        <div className={`hidden md:flex flex-col items-center text-center gap-8 p-10 rounded-card border-4 shadow-hard paper-card transition-all relative ${
          connection === 'online'
            ? 'border-secondary bg-secondary-muted'
            : 'bg-white border-ink/5 hover:border-secondary/40'
        }`}>
          <div className={`w-32 h-32 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-inner ${
            connection === 'online' ? 'bg-secondary/20 text-secondary' : 'bg-secondary/10 text-secondary'
          }`}>
            <WifiIcon className="w-16 h-16" />
          </div>
          <div>
            <h3 className="font-display text-3xl uppercase mb-3">Modo Online</h3>
            <p className="text-xs font-bold text-ink/40 uppercase leading-relaxed max-w-[200px] mx-auto">
              Cada uno con su móvil a través de internet. ¡Juega desde cualquier lugar!
            </p>
          </div>
          {connection === 'online' && (
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center border-4 border-white shadow-hard">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
          )}
        </div>
      </button>

      {/* Local */}
      <button
        type="button"
        onClick={() => setConnection('local')}
        className="block relative w-full cursor-pointer group text-left md:text-center"
      >
        {/* Mobile: horizontal card */}
        <div className="md:hidden">
          <SelectionCard
            selected={connection === 'local'}
            onSelect={() => setConnection('local')}
            icon={SmartphoneIcon}
            title="Modo Local"
            description="Un solo teléfono en la mesa para jugar en persona."
            activeColor="primary"
            size="lg"
            variant="circle"
          />
        </div>
        {/* Desktop: portrait card */}
        <div className={`hidden md:flex flex-col items-center text-center gap-8 p-10 rounded-card border-4 shadow-hard paper-card transition-all relative ${
          connection === 'local'
            ? 'border-primary bg-primary-muted'
            : 'bg-white border-ink/5 hover:border-primary/40'
        }`}>
          <div className={`w-32 h-32 rounded-full flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 shadow-inner ${
            connection === 'local' ? 'bg-primary/20 text-primary' : 'bg-primary/10 text-primary'
          }`}>
            <SmartphoneIcon className="w-16 h-16" />
          </div>
          <div>
            <h3 className="font-display text-3xl uppercase mb-3">Modo Local</h3>
            <p className="text-xs font-bold text-ink/40 uppercase leading-relaxed max-w-[200px] mx-auto">
              Un solo teléfono en la mesa para jugar con amigos en persona.
            </p>
          </div>
          {connection === 'local' && (
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center border-4 border-white shadow-hard">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
          )}
        </div>
      </button>
    </div>
  </>
);
