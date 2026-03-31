import React from 'react';
import { Avatar } from '../ui/Avatar';

interface MessageListProps {
  messages: any[];
  playerId: string;
  isDiscussing: boolean;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages, playerId, isDiscussing, chatEndRef
}) => {
  return (
    <div className={`flex-1 h-0 p-6 space-y-4 overflow-y-auto no-scrollbar ${isDiscussing ? 'pt-8' : ''}`}>
      {isDiscussing && (
        <div className="text-center mb-2">
          <span className="bg-white/80 text-[8px] font-extrabold px-3 py-1 rounded-full shadow-sm opacity-40 uppercase tracking-[0.2em]">Discusión en tiempo real</span>
        </div>
      )}

      {messages.map((msg: any, i: number) => (
        msg.type === 'divider' ? (
          <div key={i} className="flex items-center gap-4 py-4">
            <div className="flex-1 h-px bg-ink/10" />
            <div className="bg-paper border-2 border-ink/10 px-6 py-2 rounded-full shadow-hard-sm">
              <span className="text-[10px] font-display uppercase tracking-[0.2em] text-ink/40 text-center">
                {msg.text}
              </span>
            </div>
            <div className="flex-1 h-px bg-ink/10" />
          </div>
        ) : (
          <div key={i} className={`flex items-start gap-3 ${msg.playerId === playerId ? 'flex-row-reverse' : ''} ${msg.isMissed ? 'opacity-60 grayscale' : ''}`}>
            <Avatar
              avatarId={msg.avatar || 'noto--bear'}
              bgColor={msg.color || '#FFD166'}
              size="sm"
              className="shrink-0 shadow-hard-sm mt-1"
            />
            <div className={`relative p-3 rounded-btn shadow-hard-sm border border-ink/5 max-w-[80%] ${msg.isMissed
              ? 'bg-ink/5 border-dashed border-ink/10'
              : (msg.playerId === playerId ? 'bg-primary text-white' : 'bg-white bubble-left')
              }`}>
              <p className={`font-bold text-[10px] tracking-tight mb-1 ${msg.isMissed
                ? 'text-ink/40'
                : (msg.playerId === playerId ? 'text-white/80 text-right' : (isDiscussing ? 'text-secondary' : 'text-primary'))
                }`}>
                {msg.nickname || 'Jugador'} {msg.isMissed && '• SALTEADO'}
              </p>
              <p className={`text-xs leading-relaxed ${msg.isMissed ? 'italic text-ink/40' : (msg.playerId === playerId ? 'text-right' : '')}`}>
                {msg.text || msg.clue || msg.message}
              </p>
            </div>
          </div>
        )
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};
