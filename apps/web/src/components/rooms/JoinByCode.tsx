import React from 'react';
import { Card } from '../ui/Card';

interface JoinByCodeProps {
  roomCode: string;
  setRoomCode: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  error?: string;
}

export const JoinByCode: React.FC<JoinByCodeProps> = ({
  roomCode,
  setRoomCode,
  onSubmit,
  error,
}) => {
  return (
    <Card variant="paper" borderWidth="thin" className="p-[14px]!">
      <form onSubmit={onSubmit} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="text-[9px] font-bold text-ink/40 uppercase tracking-widest block mb-2">
            ¿Tienes un código?
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="ABCD"
            maxLength={4}
            className="w-full bg-paper border-2 border-ink/5 shadow-inner-hard p-[14px] rounded-btn font-mono text-xl text-center uppercase tracking-[0.3em] focus:outline-none focus:border-primary transition-colors"
          />
          {error && (
            <p className="text-danger text-xs font-bold mt-1">{error}</p>
          )}
        </div>
        <button
          type="submit"
          className="h-[50px] px-5 bg-primary text-white font-display text-base rounded-btn shadow-hard active:translate-y-0.5 active:shadow-none transition-all uppercase self-end"
        >
          Unirse
        </button>
      </form>
    </Card>
  );
};
