import React from 'react';
import { Button } from '../ui/Button';
import ErrorIcon from '../icons/error';
import PersonOffIcon from '../icons/person-off';

interface RoomStatusProps {
  error?: string;
  loading?: boolean;
  missingProfile?: boolean;
  onLeave: () => void;
}

export const RoomStatus: React.FC<RoomStatusProps> = ({
  error,
  loading,
  missingProfile,
  onLeave,
}) => {
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-6">
        <div className="w-24 h-24 bg-danger-muted rounded-full flex items-center justify-center">
          <ErrorIcon className="w-12 h-12 text-danger" />
        </div>
        <div>
          <h2 className="font-display text-2xl uppercase mb-2">Error</h2>
          <p className="text-sm font-bold text-ink/60">{error}</p>
        </div>
        <Button onClick={onLeave}>Volver al Inicio</Button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center gap-4">
        <div className="w-16 h-16 border-4 border-secondary border-t-transparent rounded-full animate-spin" />
        <p className="font-display text-xl text-secondary uppercase animate-pulse">
          Conectando...
        </p>
      </div>
    );
  }

  if (missingProfile) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
        <PersonOffIcon className="w-12 h-12 text-ink/20" />
        <p className="font-display text-xl text-ink/40 uppercase">No se encontró tu perfil</p>
        <Button onClick={onLeave}>Volver</Button>
      </div>
    );
  }

  return null;
};
