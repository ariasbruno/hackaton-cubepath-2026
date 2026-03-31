import React from 'react';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { type LocalPlayer } from '../../store/useLocalGameStore';
import CloseIcon from '../icons/close';
import HowToVoteIcon from '../icons/how-to-vote';
import FingerprintIcon from '../icons/fingerprint';
import WarningIcon from '../icons/warning';

interface LocalVotingProps {
  players: LocalPlayer[];
  onVote: (id: string) => void;
  onBack: () => void;
}

export const LocalVoting: React.FC<LocalVotingProps> = ({ players, onVote, onBack }) => {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [isConfirming, setIsConfirming] = React.useState(false);

  const selectedPlayer = players.find(p => p.id === selectedId);

  return (
    <div className="flex-1 flex flex-col relative bg-paper pattern-dots">
      {/* 1. Header Estilo HTML */}
      <header className="bg-white border-b border-ink/5 shadow-[0_4px_20px_rgba(43,45,66,0.05)] z-30 relative">
        <div className="max-w-2xl mx-auto w-full p-6 flex flex-col gap-2 relative">
          {/* Back Button for Abandon */}
          <button 
            onClick={onBack}
            className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-hard-sm border-2 border-ink/5 text-ink/30 hover:text-danger hover:bg-danger/5 transition-all"
            title="Abandonar partida"
          >
            <CloseIcon className="w-4 h-4" />
          </button>

          <h1 className="font-display text-3xl text-danger uppercase tracking-tight leading-none text-center">
            ¿Quién miente?
          </h1>
          <p className="text-[10px] font-extrabold uppercase opacity-40 tracking-[0.2em] text-center">
            Veredicto Grupal (Modo Local)
          </p>
        </div>
      </header>

      {/* 2. Área de Instrucciones */}
      <div className="bg-danger-muted/50 backdrop-blur-sm border-b border-ink/5 animate-fade-in">
        <div className="max-w-2xl mx-auto w-full p-4 flex flex-col items-center gap-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-danger/60 text-center px-4">
            Lleguen a un consenso y marquen al sospechoso en la mesa
          </p>
        </div>
      </div>

      {/* 3. Grid de Jugadores */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <div className="max-w-2xl mx-auto w-full p-6 grid grid-cols-2 gap-6">
          {players.map((p, index) => {
            const isSelected = selectedId === p.id;
            return (
              <label 
                key={p.id} 
                className={`block relative cursor-pointer group animate-fade-in-up`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <input 
                  type="radio" 
                  name="local-vote" 
                  className="peer hidden" 
                  checked={isSelected}
                  onChange={() => setSelectedId(p.id)}
                />
                <div className="bg-white p-5 rounded-card border-4 border-ink/5 shadow-hard peer-checked:border-danger peer-checked:bg-danger-muted transition-all flex flex-col items-center gap-3 active:translate-y-0.5 active:shadow-hard-sm">
                  <Avatar 
                    avatarId={p.avatarId} 
                    bgColor={p.avatarColor}
                    size="2xl" 
                    borderColor="border-white"
                    className="shadow-hard shrink-0 transition-transform group-hover:scale-105"
                  />
                  <h3 className="font-display text-lg uppercase tracking-tight leading-none text-ink truncate w-full text-center">
                    {p.name}
                  </h3>
                </div>
                
                {/* Badge de Voto */}
                <div className={`
                  absolute -top-2 -right-2 w-8 h-8 bg-danger text-white rounded-full flex items-center justify-center border-4 border-white shadow-hard-sm transition-all duration-300
                  ${isSelected ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
                `}>
                  <HowToVoteIcon className="w-4 h-4" />
                </div>
              </label>
            );
          })}
        </div>
      </main>

      {/* 4. Footer Actions */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t-4 border-ink/5 z-40 shadow-[0_-10px_40px_rgba(43,45,66,0.05)]">
        <div className="max-w-2xl mx-auto w-full p-6 flex flex-col gap-3">
          <Button
            fullWidth
            variant="danger"
            size="xl"
            disabled={!selectedId}
            onClick={() => selectedId && setIsConfirming(true)}
            className="h-20 py-5 rounded-btn shadow-hard-lg active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 group"
          >
            <span className="font-display text-2xl uppercase tracking-widest">Confirmar Voto</span>
            <FingerprintIcon className="w-8 h-8 group-active:scale-90 transition-transform" />
          </Button>
        </div>
      </footer>

      {/* 5. Confirmation Modal Overlay */}
      {isConfirming && selectedPlayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
          <div 
            className="absolute inset-0 bg-ink/60 backdrop-blur-md" 
            onClick={() => setIsConfirming(false)} 
          />
          
          <div className="relative bg-paper w-full rounded-[32px] border-4 border-ink shadow-hard-xl p-8 flex flex-col items-center gap-6 animate-scale-in">
            <div className="w-20 h-20 bg-danger/10 text-danger rounded-full flex items-center justify-center border-4 border-danger/20">
              <WarningIcon className="w-8 h-8" />
            </div>

            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl uppercase tracking-tight text-ink">
                ¿Veredicto Final?
              </h2>
              <p className="text-sm font-bold text-ink/40 leading-relaxed text-center px-4">
                Están a punto de declarar culpable a <span className="text-danger uppercase">{selectedPlayer.name}</span>.
                ¿Es esta su decisión definitiva?
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <Button
                variant="danger"
                fullWidth
                size="xl"
                onClick={() => onVote(selectedId!)}
                className="shadow-hard-sm"
              >
                SÍ, ES CULPABLE
              </Button>
              <button
                onClick={() => setIsConfirming(false)}
                className="w-full py-4 text-xs font-black uppercase tracking-widest text-ink/30 hover:text-ink transition-colors"
                type="button"
              >
                Cancelar y Revisar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
