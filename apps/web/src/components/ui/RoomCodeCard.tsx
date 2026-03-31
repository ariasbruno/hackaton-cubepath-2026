import React from 'react';

interface RoomCodeCardProps {
  code: string;
  className?: string;
}

export const RoomCodeCard: React.FC<RoomCodeCardProps> = ({
  code,
  className = '',
}) => {
  return (
    <div
      className={`bg-yellow font-mono text-4xl text-ink font-bold px-6 py-2 rounded-card shadow-hard transform -rotate-2 w-max border-4 border-ink select-all cursor-pointer active:rotate-0 transition-transform ${className}`}
      title="Código de sala — toca para copiar"
      onClick={() => navigator.clipboard?.writeText(code)}
    >
      {code}
    </div>
  );
};
