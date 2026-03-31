import React, { useEffect, useRef } from 'react';
import { GameEvents } from '@impostor/shared';
import { wsClient } from '../../services/ws';
import { Avatar } from '../ui/Avatar';
import ChatIcon from '../icons/chat';
import SendIcon from '../icons/send';

const MAX_CHARS = 100;

interface LobbyChatProps {
  chatMessages: any[];
  playerId: string;
  mode?: string;
}

export const LobbyChat: React.FC<LobbyChatProps> = ({ chatMessages, playerId, mode = 'TRADICIONAL' }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState('');
  const accentColor = mode === 'CERCANAS' ? 'secondary' : mode === 'CAOS' ? 'purple' : 'primary';

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValue.trim()) {
      wsClient.send(GameEvents.SEND_CHAT, { text: inputValue.trim() });
      setInputValue('');
    }
  };

  return (
    <section className="flex flex-col gap-3">
      <h2 className={`font-display text-xl uppercase tracking-tight text-${accentColor} flex items-center gap-2`}>
        <ChatIcon className="w-6 h-6" />
        Chat de Sala
      </h2>
      <div className="bg-white rounded-card border-2 border-ink/5 shadow-hard overflow-hidden flex flex-col h-64">
        <div
          ref={scrollRef}
          className="flex-1 p-4 space-y-3 overflow-y-auto no-scrollbar bg-ink/5 scroll-smooth"
        >
          {(chatMessages || []).map((msg: any, idx: number) => {
            const isMe = msg.playerId === playerId;
            return (
              <div key={idx} className={`flex gap-2 items-start ${isMe ? 'justify-end' : ''}`}>
                {!isMe && (
                  <Avatar avatarId={msg.avatar || 'noto--bear'} bgColor={msg.color || '#FFD166'} size="sm" />
                )}
                <div className={`${isMe ? `bg-${accentColor} text-white border-2 border-${accentColor}` : 'bg-white text-ink border-2 border-ink/5'} p-2 rounded-btn shadow-sm max-w-[80%]`}>
                  <p className={`text-[10px] font-bold leading-none mb-1 ${isMe ? 'text-white/80 text-right' : `text-${accentColor} text-left`}`}>
                    {isMe ? 'Tú' : msg.nickname}
                  </p>
                  <p className="text-[10px] leading-tight font-medium wrap-break-word">{msg.text}</p>
                </div>
                {isMe && (
                  <Avatar avatarId={msg.avatar || 'noto--bear'} bgColor={msg.color || '#FFD166'} size="sm" />
                )}
              </div>
            );
          })}
          {(!chatMessages || chatMessages.length === 0) && (
            <p className="text-center text-[10px] opacity-20 uppercase font-bold mt-10 tracking-[0.3em]">No hay mensajes</p>
          )}
        </div>

        <form
          className="p-2 bg-white border-t border-ink/5 flex gap-2 items-center"
          onSubmit={handleSubmit}
        >
          <div className="flex-1 relative">
            <input
              name="msg"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.slice(0, MAX_CHARS))}
              placeholder="DI ALGO..."
              autoComplete="off"
              autoCapitalize="off"
              // autoCorrect="off"
              // spellCheck={false}
              className={`w-full bg-paper border-2 border-ink/5 px-4 py-2 pr-10 rounded-full text-[10px] font-bold tracking-widest focus:outline-none focus:border-${accentColor} transition-all placeholder:text-ink/20`}
            />
            {/* Progress Wheel */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className="stroke-ink/10"
                  strokeWidth="4"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  className={`transition-all duration-300 stroke-current ${
                    inputValue.length >= MAX_CHARS ? 'text-danger' : `text-${accentColor}`
                  }`}
                  strokeWidth="4"
                  strokeDasharray="100.53"
                  strokeDashoffset={100.53 - (Math.min(inputValue.length, MAX_CHARS) / MAX_CHARS) * 100.53}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim()}
            className={`bg-${accentColor} text-white p-2 rounded-btn shadow-hard active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50`}
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </form>
      </div>
    </section>
  );
};
