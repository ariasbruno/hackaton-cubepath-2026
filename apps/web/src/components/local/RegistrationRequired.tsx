import React from 'react';
import { Button } from '../ui/Button';
import { RegistrationModal } from '../auth/RegistrationModal';
import LockIcon from '../icons/lock';

interface RegistrationRequiredProps {
  registrationOpen: boolean;
  onRegister: () => void;
  onBack: () => void;
  onCloseRegistration: () => void;
}

export const RegistrationRequired: React.FC<RegistrationRequiredProps> = ({
  registrationOpen,
  onRegister,
  onBack,
  onCloseRegistration
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6 bg-paper">
      <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center">
        <LockIcon className="w-12 h-12 text-secondary" />
      </div>
      <div>
        <h2 className="font-display text-2xl uppercase mb-2">Registro Requerido</h2>
        <p className="text-sm font-bold text-ink/40 uppercase tracking-widest leading-relaxed">
          Debes registrarte antes de poder jugar, incluso en modo local.
        </p>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <Button onClick={onRegister}>Registrarse Ahora</Button>
        <Button variant="ghost" onClick={onBack}>Volver al Inicio</Button>
      </div>
      <RegistrationModal 
        isOpen={registrationOpen} 
        onClose={onCloseRegistration} 
      />
    </div>
  );
};
