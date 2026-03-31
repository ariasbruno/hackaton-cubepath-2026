import React, { useState, useEffect } from 'react';
import { Avatar } from '../ui/Avatar';
import { Heading, Text } from '../ui/Typography';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import VisibilityOffIcon from '../icons/visibility-off';
import VisibilityIcon from '../icons/visibility';
import ThumbUpIcon from '../icons/thumb-up';

interface LocalAssigningProps {
  player: any;
  isCercanasMode?: boolean;
  onNextReveal: () => void;
}

export const LocalAssigning: React.FC<LocalAssigningProps> = ({ player, isCercanasMode, onNextReveal }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasRevealedAtLeastOnce, setHasRevealedAtLeastOnce] = useState(false);

  useEffect(() => {
    if (isRevealed) {
      setHasRevealedAtLeastOnce(true);
    }
  }, [isRevealed]);

  const isImpostor = player.role === 'IMPOSTOR';
  return (
    <div className="flex-1 w-full bg-paper relative overflow-hidden">
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-8 py-12 flex flex-col items-center justify-center gap-10 relative z-10 animate-fade-in">
        {/* Avatar siempre incógnito hasta que se revela la palabra */}
        <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
          <div className={`relative w-full h-full bg-white rounded-full flex items-center justify-center shadow-xl border-4 border-primary/10 transition-transform duration-500 ${isRevealed ? 'rotate-0' : 'rotate-12'}`}>
            <Avatar
              avatarId={player.avatarId}
              bgColor={player.avatarColor}
              size="xl"
              className={`relative z-10 transition-all duration-700 ${isRevealed ? 'scale-110 rotate-0' : 'scale-75 rotate-12 blur-[2px] grayscale'}`}
              borderColor="transparent"
            />
          </div>
        </div>

        <Heading variant="h2" className="text-3xl italic font-display text-ink/80 tracking-tight mb-3 animate-pulse">
          {isCercanasMode ? '¿Tu palabra es...?' : 'Eres agente... '}
          {!isCercanasMode && <span className="text-primary">¿o no?</span>}
        </Heading>
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-ink/40">Localiza tu palabra secreta</p>
        <Card 
          variant="paper" 
          onClick={() => !isRevealed && setIsRevealed(true)}
          className={`
            w-full p-10 text-center shadow-xl border relative overflow-hidden transition-all duration-500 min-h-[160px] flex flex-col items-center justify-center cursor-pointer
            ${isRevealed ? 'border-yellow/30 bg-yellow-muted/40 cursor-default' : 'border-ink/5 bg-ink/5 border-dashed shadow-none'}
          `}
        >
          {isRevealed ? (
            <div className="animate-fade-in relative w-full">
              <button 
                onClick={(e) => { e.stopPropagation(); setIsRevealed(false); }}
                className="absolute -top-6 -right-6 p-2 bg-white rounded-full shadow-md text-ink/40 hover:text-ink transition-colors z-30"
              >
                <VisibilityOffIcon className="w-4 h-4" />
              </button>

              {isImpostor && !isCercanasMode ? (
                <div className="py-2">
                  <Text className="font-bold text-lg leading-tight text-ink uppercase tracking-tight">
                    No tienes palabra
                  </Text>
                  <span className="text-[9px] opacity-40 font-black mt-3 block uppercase tracking-[0.2em]">Finge ante los demás</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-[9px] uppercase font-black text-ink/30 tracking-[0.2em]">Tu palabra es</p>
                  <div className="relative inline-block">
                    <div className="absolute inset-x-0 bottom-1 h-3 bg-yellow/20 -rotate-1" />
                    <Heading variant="h2" className="text-4xl text-ink uppercase tracking-tighter font-display relative z-10">
                      {player.word}
                    </Heading>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <VisibilityIcon className="w-8 h-8 text-ink/20" />
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-ink/50">Pulsa para ver tu palabra</span>
            </div>
          )}
        </Card>

        <div className="w-full mt-4">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            disabled={!hasRevealedAtLeastOnce}
            onClick={onNextReveal}
            className={`py-6 bg-primary text-white shadow-lg shadow-primary/20 border-none transition-all active:scale-95 ${!hasRevealedAtLeastOnce && 'opacity-30'}`}
          >
            <span className="font-display text-lg uppercase tracking-widest text-white">¡ENTENDIDO!</span>
            <ThumbUpIcon className="w-6 h-6 ml-2 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};


