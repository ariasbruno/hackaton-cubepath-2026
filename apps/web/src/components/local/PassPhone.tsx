import React from 'react';
import { Button } from '../ui/Button';
import SecurityIcon from '../icons/security';
import FrontHandIcon from '../icons/front-hand';
import VerifiedIcon from '../icons/verified';

interface PassPhoneProps {
  nextPlayerName: string;
  onGotIt: () => void;
}

export const PassPhone: React.FC<PassPhoneProps> = ({ nextPlayerName, onGotIt }) => {
  return (
    <div className="flex-1 w-full relative overflow-hidden bg-paper pattern-dots">
      <div className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-8 flex flex-col items-center justify-between text-center py-12 relative z-10">
        {/* 1. Icono de Mano Superior */}
        <div className="flex flex-col items-center gap-6 animate-fade-in-down">
          <div className="relative">
            {/* Onda expansiva (Ripple Effect) - Syncs with 1s ping */}
            <div className="absolute inset-0 bg-primary/10 rounded-full scale-150 animate-ping opacity-70" />
            
            {/* Contenedor del Icono con Pulso Lento (2s) */}
            <div className="w-32 h-32 bg-white rounded-full border-4 border-ink shadow-hard flex items-center justify-center relative z-10 animate-pulse-icon">
              <FrontHandIcon className="text-primary w-24 h-24" />
            </div>
          </div>

          {/* 2. Títulos */}
          <div className="space-y-2 text-center">
            <h1 className="font-display text-4xl sm:text-5xl text-primary uppercase tracking-tight leading-none drop-shadow-sm">
              ¡Turno de pasar!
            </h1>
            <p className="text-[10px] sm:text-xs font-black text-ink/30 uppercase tracking-[0.3em]">
              Privacidad ante todo
            </p>
          </div>
        </div>

        {/* 3. Tarjeta Sticky Note Amarilla */}
        <div className="w-full relative animate-scale-in">
          {/* Tape Effect */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-sm z-20 border-x border-ink/5 rotate-1 shadow-sm" />
          
          <div className="bg-sticky-yellow p-8 sm:p-12 rounded-card shadow-hard-lg border-4 border-ink relative overflow-hidden flex flex-col items-center justify-center gap-2 transform -rotate-1">
            <p className="text-[10px] font-black text-ink/40 uppercase tracking-widest">Entrega el móvil a:</p>
            <h2 className="font-display text-5xl sm:text-6xl text-ink uppercase tracking-tighter wrap-break-word w-full px-2">
              {nextPlayerName}
            </h2>
            <div className="w-16 h-1.5 bg-ink/10 rounded-full mt-2" />
          </div>
        </div>

        {/* 4. Alerta de Seguridad */}
        <div className="w-full space-y-8">
          <div className="bg-primary/5 border-2 border-primary/10 p-5 rounded-3xl flex items-center gap-4 animate-fade-in">
            <div className="shrink-0 w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <SecurityIcon className="text-primary w-6 h-6" />
            </div>
            <p className="text-[10px] sm:text-[11px] font-black text-primary leading-tight text-left uppercase tracking-tight">
              Asegúrate de que nadie esté mirando la pantalla antes de continuar.
            </p>
          </div>

          {/* 5. Footer & Button */}
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-ink/5"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-paper px-4 text-[9px] font-black text-ink/20 uppercase tracking-[0.3em]">
                  Esperando al siguiente agente...
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actual button fixed for width */}
        <div className="w-full mt-auto pt-6">
          <Button
            onClick={onGotIt}
            variant="secondary"
            size="xl"
            fullWidth
            className="py-10 shadow-hard transition-all active:scale-95 group"
          >
            <span className="font-display text-2xl uppercase tracking-tighter mr-3 group-hover:tracking-widest transition-all">¡ENTENDIDO!</span>
            <div className="p-2 bg-white/20 rounded-full group-hover:rotate-12 transition-transform">
              <VerifiedIcon className="w-6 h-6 text-white" />
            </div>
          </Button>
        </div>
      </div>

      {/* Background Decoratives */}
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
