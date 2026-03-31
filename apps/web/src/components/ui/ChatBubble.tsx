import React from 'react';

interface ChatBubbleProps {
  message: string;
  playerName: string;
  playerEmoji?: string;
  isMine: boolean;
  timestamp?: string;
  className?: string;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  playerName,
  playerEmoji = '👤',
  isMine,
  timestamp,
  className = '',
}) => {
  return (
    <div
      className={`flex gap-2 animate-fade-in ${
        isMine ? 'flex-row-reverse' : 'flex-row'
      } ${className}`}
    >
      <div className="w-8 h-8 rounded-full bg-white border-2 border-ink/10 shadow-hard-sm flex items-center justify-center text-sm shrink-0">
        {playerEmoji}
      </div>
      <div className={`max-w-[75%] ${isMine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <span className="text-[8px] font-bold uppercase tracking-widest text-ink/30 px-1">
          {playerName}
        </span>
        <div
          className={`px-4 py-3 rounded-card shadow-hard-sm text-sm font-bold ${
            isMine
              ? 'bg-secondary text-white rounded-tr-sm'
              : 'bg-white text-ink rounded-tl-sm'
          }`}
        >
          {message}
        </div>
        {timestamp && (
          <span className="text-[8px] text-ink/20 font-bold px-1">{timestamp}</span>
        )}
      </div>
    </div>
  );
};
