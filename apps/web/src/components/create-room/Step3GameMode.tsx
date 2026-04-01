import React from 'react';
import { SelectionCard } from '../ui/SelectionCard';
import { Badge } from '../ui/Badge';
import PersonSearchIcon from '../icons/person-search';
import TranslateIcon from '../icons/translate';
import BoltIcon from '../icons/bolt';

interface Step3GameModeProps {
  gameMode: 'TRADICIONAL' | 'CERCANAS' | 'CAOS' | null;
  setGameMode: (mode: 'TRADICIONAL' | 'CERCANAS' | 'CAOS') => void;
  connection: 'local' | 'online' | null;
}

const MODES = [
  {
    key: 'TRADICIONAL' as const,
    icon: PersonSearchIcon,
    title: 'Tradicional',
    description: '1 Impostor contra todos. El clásico juego de deducción social.',
    activeColor: 'primary' as const,
    online: false,
  },
  {
    key: 'CERCANAS' as const,
    icon: TranslateIcon,
    title: 'Cercanas',
    description: 'El infiltrado tiene una palabra similar. ¡Requiere sutileza total!',
    activeColor: 'secondary' as const,
    online: false,
  },
  {
    key: 'CAOS' as const,
    icon: BoltIcon,
    title: 'Modo Caos',
    description: 'Vinculados vs Dispersos. Encuentren su pareja en secreto.',
    activeColor: 'purple' as const,
    online: true,
  },
];

const colorStyles = {
  primary: {
    border: 'border-primary',
    bg: 'bg-primary-muted',
    iconBg: 'bg-primary/10 text-primary',
    check: 'bg-primary',
    hover: 'hover:border-primary/40',
  },
  secondary: {
    border: 'border-secondary',
    bg: 'bg-secondary-muted',
    iconBg: 'bg-secondary/10 text-secondary',
    check: 'bg-secondary',
    hover: 'hover:border-secondary/40',
  },
  purple: {
    border: 'border-purple',
    bg: 'bg-purple-muted',
    iconBg: 'bg-purple/10 text-purple',
    check: 'bg-purple',
    hover: 'hover:border-purple/40',
  },
};

export const Step3GameMode: React.FC<Step3GameModeProps> = ({ gameMode, setGameMode, connection }) => (
  <>
    <div className="text-center mb-8">
      <h2 className="font-display text-3xl md:text-[38px] mb-2 uppercase tracking-tight leading-none">
        Modo de Juego
      </h2>
      <p className="text-[10px] text-ink/40 font-bold uppercase tracking-widest">
        ¿Cómo será la dinámica de tu partida?
      </p>
    </div>

    {/* Mobile: vertical list */}
    <div className="md:hidden w-full space-y-6">
      <SelectionCard
        selected={gameMode === 'TRADICIONAL'}
        onSelect={() => setGameMode('TRADICIONAL')}
        icon={PersonSearchIcon}
        title="Tradicional"
        description="1 Impostor contra todos. El clásico juego de deducción."
        activeColor="primary"
        variant="squircle"
        size="md"
      />
      <SelectionCard
        selected={gameMode === 'CERCANAS'}
        onSelect={() => setGameMode('CERCANAS')}
        icon={TranslateIcon}
        title="Cercanas"
        description="El infiltrado tiene una palabra similar. ¡Sutileza total!"
        activeColor="secondary"
        variant="squircle"
        size="md"
      />
      <div className="relative">
        <SelectionCard
          selected={gameMode === 'CAOS'}
          onSelect={() => connection === 'online' && setGameMode('CAOS')}
          icon={BoltIcon}
          title="Modo Caos"
          description="Vinculados vs Dispersos. Encuentren su pareja en secreto."
          activeColor="purple"
          variant="squircle"
          size="md"
          disabled={connection === 'local'}
        />
        <div className="absolute top-6 right-12 pointer-events-none">
          <Badge color="purple" className="shadow-sm">Online</Badge>
        </div>
      </div>
    </div>

    {/* Desktop: 3-column portrait grid */}
    <div className="hidden md:grid grid-cols-3 gap-6 w-full">
      {MODES.map((mode) => {
        const isDisabled = mode.online && connection === 'local';
        const isSelected = gameMode === mode.key;
        const c = colorStyles[mode.activeColor];

        return (
          <button
            key={mode.key}
            type="button"
            disabled={isDisabled}
            onClick={() => !isDisabled && setGameMode(mode.key)}
            className={`relative cursor-pointer group text-center ${isDisabled ? 'opacity-40 pointer-events-none' : ''}`}
          >
            <div className={`h-full flex flex-col items-center text-center gap-6 p-8 rounded-card border-4 shadow-hard paper-card transition-all relative ${
              isSelected ? `${c.border} ${c.bg}` : `bg-white border-ink/5 ${c.hover}`
            }`}>
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:rotate-3 shadow-inner ${c.iconBg}`}>
                <mode.icon className="w-10 h-10" />
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h3 className="font-display text-xl uppercase leading-none">{mode.title}</h3>
                  {mode.online && (
                    <span className="bg-purple text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest shadow-sm">
                      Online
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-bold text-ink/40 uppercase leading-relaxed max-w-[170px] mx-auto">
                  {mode.description}
                </p>
              </div>
            </div>
            {/* Selection indicator */}
            {isSelected && (
              <div className={`absolute -top-3 -right-3 w-9 h-9 ${c.check} text-white rounded-full flex items-center justify-center border-[3px] border-white shadow-hard-sm`}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  </>
);
