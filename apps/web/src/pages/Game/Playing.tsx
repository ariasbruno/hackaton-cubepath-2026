import React, { useEffect, useRef, useState } from 'react';
import { wsClient } from '../../services/ws';
import { GameEvents } from '@impostor/shared';

/* Modular Components */
import { PlayingHeader } from '../../components/game/PlayingHeader';
import { TurnIndicator } from '../../components/game/TurnIndicator';
import { MessageList } from '../../components/game/MessageList';
import { CluesHistory } from '../../components/game/CluesHistory';
import { StickyWordReminder } from '../../components/game/StickyWordReminder';
import { PlayingFooter } from '../../components/game/PlayingFooter';

// Desktop Components
import { DesktopPlayingHeader } from '../../components/game/desktop/DesktopPlayingHeader';
import { DesktopSecretWord } from '../../components/game/desktop/DesktopSecretWord';
import { DesktopTurnOrder } from '../../components/game/desktop/DesktopTurnOrder';
import { DesktopCluesHistory } from '../../components/game/desktop/DesktopCluesHistory';

interface PlayingProps {
  roomState: any;
  playerId: string;
}

export const Playing: React.FC<PlayingProps> = ({ roomState, playerId }) => {
  const isClues = roomState.phase === 'CLUES';
  const isDiscussing = roomState.phase === 'DISCUSSING';

  const [input, setInput] = useState('');
  const [isWordVisible, setIsWordVisible] = useState(false);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const currentTurn = roomState.turnId;
  const isMyTurn = currentTurn === playerId;
  const turnPlayer = roomState.players?.find((p: any) => p.id === currentTurn);
  const me = roomState.players?.find((p: any) => p.id === playerId);

  const clues = roomState.clues || [];
  const chatMessages = roomState.chatMessages || [];

  const turnTimerTotal = roomState.settings?.timers?.clues || 45;
  const globalTimerTotal = isDiscussing
    ? (roomState.settings?.timers?.discuss || 120)
    : 45;

  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!roomState.timerEndAt) return;
    const interval = setInterval(() => {
      const left = Math.max(0, Math.round((roomState.timerEndAt - Date.now()) / 1000));
      setSecondsLeft(left);
      if (left <= 0) clearInterval(interval);
    }, 500);
    return () => clearInterval(interval);
  }, [roomState.timerEndAt]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length, clues.length, isClues]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (isClues) {
      wsClient.send(GameEvents.SEND_CLUE, { text: input.trim() });
    } else {
      wsClient.send(GameEvents.SEND_CHAT, { text: input.trim() });
    }
    setInput('');
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const rs = s % 60;
    return `${m}:${rs < 10 ? '0' : ''}${rs}`;
  };

  const timerPercentage = Math.max(0, (secondsLeft / (isClues ? turnTimerTotal : globalTimerTotal)) * 100);

  const charLimit = isClues ? 30 : 140;

  // Group clues by round for the history view
  const groupedClues: any[] = [];
  let currentGroup: any = null;

  clues.forEach((c: any) => {
    if (c.type === 'divider') {
      if (currentGroup) groupedClues.push(currentGroup);
      currentGroup = { title: c.text, clues: [] };
    } else if (currentGroup) {
      currentGroup.clues.push(c);
    }
  });
  if (currentGroup) groupedClues.push(currentGroup);

  // Reorder clues for the real-time MessageList (separators below clues)
  const orderedClueMessages: any[] = [];
  let lastDivider: any = null;
  clues.forEach((c: any) => {
    if (c.type === 'divider') {
      if (lastDivider) orderedClueMessages.push(lastDivider);
      lastDivider = c;
    } else {
      orderedClueMessages.push(c);
    }
  });
  // Note: we don't push lastDivider at the end to satisfy "no divider for current/first round"

  return (
    <>
      {/* ====== MOBILE VIEW ====== */}
      <div className={`md:hidden flex-1 min-h-0 flex flex-col overflow-hidden pattern-dots ${isDiscussing ? 'bg-ink/5' : 'bg-paper'}`}>
        <PlayingHeader
          isClues={isClues}
          isDiscussing={isDiscussing}
          currentRound={roomState.currentRound}
          secondsLeft={secondsLeft}
          formatTime={formatTime}
          skipVotes={roomState.skipVotes}
          playerId={playerId}
        />

        <TurnIndicator
          isClues={isClues}
          turnPlayer={turnPlayer}
          isMyTurn={isMyTurn}
          timerPercentage={timerPercentage}
        />

        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {isDiscussing && (
            <div className="absolute top-0 left-0 w-full h-1 bg-ink/5 z-10">
              <div
                className="h-full bg-danger transition-all duration-1000"
                style={{ width: `${timerPercentage}%` }}
              />
            </div>
          )}

          <MessageList
            messages={isClues ? orderedClueMessages : chatMessages}
            playerId={playerId}
            isDiscussing={isDiscussing}
            chatEndRef={chatEndRef}
          />
        </main>

        {!isDiscussing && (
          <StickyWordReminder
            player={me}
            isVisible={isWordVisible}
            onToggle={() => setIsWordVisible(!isWordVisible)}
          />
        )}

        <PlayingFooter
          input={input}
          setInput={setInput}
          onSubmit={handleSend}
          isClues={isClues}
          isDiscussing={isDiscussing}
          isMyTurn={isMyTurn}
          charLimit={charLimit}
          timerPercentage={timerPercentage}
        />

        {isDiscussing && (
          <CluesHistory
            groupedClues={groupedClues}
            isExpanded={isHistoryExpanded}
            onToggle={() => setIsHistoryExpanded(!isHistoryExpanded)}
          />
        )}
      </div>

      {/* ====== DESKTOP DASHBOARD VIEW ====== */}
      <div className={`hidden md:flex flex-col flex-1 min-h-0 w-full p-8 ${isDiscussing ? 'bg-ink/5' : 'bg-paper'} pattern-grid-lg overflow-y-auto`}>
        <div className="max-w-6xl mx-auto w-full flex flex-col min-h-full gap-6 pb-4">
          <DesktopPlayingHeader
          isClues={isClues}
          isDiscussing={isDiscussing}
          currentRound={roomState.currentRound}
          secondsLeft={secondsLeft}
          formatTime={formatTime}
          turnPlayer={turnPlayer}
          isMyTurn={isMyTurn}
          timerPercentage={timerPercentage}
          skipVotes={roomState.skipVotes}
          playerId={playerId}
          />

          <div className="flex-1 grid grid-cols-[1fr_350px] w-full gap-8 min-h-[600px] max-h-[800px]">
            {/* Left Column: Chat / Clues Channel */}
          <section className="bg-white rounded-3xl border-2 border-ink/5 shadow-hard-sm flex flex-col overflow-hidden relative">
            
            {/* Context Header */}
            <header className="px-6 py-4 border-b border-ink/5 flex items-center justify-between z-10 bg-white">
               <h2 className="font-bold text-sm uppercase tracking-widest text-ink/40">
                 Canal de {isClues ? 'Pistas' : 'Votaciones'}
               </h2>
               <span className="text-[10px] uppercase font-bold text-ink/20 opacity-50">
                 {isClues ? 'Las pistas aparecerán aquí en orden' : 'Debate y vota a quién expulsar'}
               </span>
            </header>
            
            <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative bg-[#FAFAFA]">
              <MessageList
                messages={isClues ? orderedClueMessages : chatMessages}
                playerId={playerId}
                isDiscussing={isDiscussing}
                chatEndRef={chatEndRef}
              />
            </main>

            {/* Desktop Message Input Box Constraint */}
            <div className="bg-white border-t border-ink/5 p-4 rounded-b-3xl shrink-0 relative">

              <PlayingFooter
                input={input}
                setInput={setInput}
                onSubmit={handleSend}
                isClues={isClues}
                isDiscussing={isDiscussing}
                isMyTurn={isMyTurn}
                charLimit={charLimit}
                timerPercentage={timerPercentage}
                isDesktop={true}
              />
            </div>
          </section>

          {/* Right Column: Game Info */}
          <aside className="flex flex-col gap-8 h-full min-h-0">
             
             {/* Dynamic Word Panel */}
             <div className="shrink-0">
               <DesktopSecretWord player={me} mode={roomState.settings?.mode} />
             </div>

             {/* Turn Order or Clues History Panel */}
             <div className="flex-1 min-h-0">
               {isClues ? (
                 <DesktopTurnOrder 
                   players={roomState.players} 
                   turnId={currentTurn} 
                   myId={playerId} 
                   maxPlayers={roomState.settings?.maxPlayers || 8} 
                 />
               ) : (
                 <DesktopCluesHistory groupedClues={groupedClues} />
               )}
             </div>

          </aside>
          </div>
        </div>
      </div>
    </>
  );
};
