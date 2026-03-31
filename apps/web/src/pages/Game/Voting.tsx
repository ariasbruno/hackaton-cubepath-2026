import React, { useState, useEffect } from 'react';
import { wsClient } from '../../services/ws';
import { GameEvents } from '@impostor/shared';
import { VotingHeader } from '../../components/game/voting/VotingHeader';
import { VotingProgress } from '../../components/game/voting/VotingProgress';
import { PlayerVoteCard } from '../../components/game/voting/PlayerVoteCard';
import { VotingActions } from '../../components/game/voting/VotingActions';
import { DesktopVotingHeader } from '../../components/game/desktop/DesktopVotingHeader';
import { DesktopCluesHistory } from '../../components/game/desktop/DesktopCluesHistory';

interface VotingProps {
  roomState: any;
  playerId: string;
}

export const Voting: React.FC<VotingProps> = ({ roomState, playerId }) => {
  const isCaos = roomState.settings?.mode === 'CAOS';
  const [votingMode, setVotingMode] = useState<'VOTE' | 'LINK' | 'ACCUSE'>(isCaos ? 'LINK' : 'VOTE');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  
  const me = roomState.players?.find((p: any) => p.id === playerId);
  const hasVoted = me?.hasVoted || false;
  const serverVotedTargets = me?.votedTargets || (me?.votedFor ? [me.votedFor] : []);

  const needsConfirmation = !hasVoted || JSON.stringify(selectedTargets) !== JSON.stringify(serverVotedTargets);

  const players = roomState.players || [];
  const timerDuration = roomState.settings?.timers?.voting || 30;
  const [secondsLeft, setSecondsLeft] = useState(timerDuration);

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
    if (hasVoted && me?.votedAction && (me.votedAction === 'VOTE' || me.votedAction === 'LINK' || me.votedAction === 'ACCUSE')) {
      setVotingMode(me.votedAction);
      if (me.votedTargets) {
        setSelectedTargets(me.votedTargets);
      }
    }
  }, [hasVoted, me?.votedAction, me?.votedTargets]);

  const handleSelect = (id: string) => {
    const maxTargets = votingMode === 'ACCUSE' ? 2 : 1; // VOTE and LINK = 1, ACCUSE = 2
    
    setSelectedTargets(prev => {
      if (prev.includes(id)) {
        return prev.filter(t => t !== id);
      }
      if (prev.length < maxTargets) {
        return [...prev, id];
      }
      // If at max, replace last one if max is 1, or do nothing if max is 2
      if (maxTargets === 1) return [id];
      return prev;
    });
  };

  const handleConfirmVote = () => {
    const maxTargets = votingMode === 'ACCUSE' ? 2 : 1;
    if (selectedTargets.length !== maxTargets) return;
    
    wsClient.send(GameEvents.CAST_VOTE, {
      action: votingMode,
      targets: selectedTargets,
      confirm: true
    });
  };

  const handleSkip = () => {
    setSelectedTargets([]);
    wsClient.send(GameEvents.CAST_VOTE, {
      action: 'SKIP',
      targets: [],
      confirm: true
    });
  };

  const progress = (secondsLeft / timerDuration) * 100;

  const clues = roomState.clues || [];
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

  return (
    <>
      {/* ====== MOBILE VIEW ====== */}
      <div className="md:hidden flex-1 flex flex-col min-h-dvh pattern-dots bg-bg-paper relative overflow-hidden">
        <VotingHeader secondsLeft={secondsLeft} />

        <VotingProgress 
          needsConfirmation={needsConfirmation}
          hasVoted={hasVoted}
          progress={progress}
        />

        {isCaos && (
          <div className="px-6 pt-4 flex gap-3">
            <button
              disabled={hasVoted}
              onClick={() => { if (!hasVoted) { setVotingMode('LINK'); setSelectedTargets([]); } }}
              className={`flex-1 py-3 rounded-xl font-display text-sm uppercase tracking-wider transition-all border-b-4 ${votingMode === 'LINK' ? 'bg-secondary text-white border-secondary-dark shadow-hard-sm' : 'bg-white text-ink/40 border-ink/5 shadow-sm'} ${hasVoted && votingMode !== 'LINK' ? 'opacity-50 grayscale' : ''}`}
            >
              Vincular (1)
            </button>
            <button
              disabled={hasVoted}
              onClick={() => { if (!hasVoted) { setVotingMode('ACCUSE'); setSelectedTargets([]); } }}
              className={`flex-1 py-3 rounded-xl font-display text-sm uppercase tracking-wider transition-all border-b-4 ${votingMode === 'ACCUSE' ? 'bg-danger text-white border-danger-dark shadow-hard-sm' : 'bg-white text-ink/40 border-ink/5 shadow-sm'} ${hasVoted && votingMode !== 'ACCUSE' ? 'opacity-50 grayscale' : ''}`}
            >
              Acusar (2)
            </button>
          </div>
        )}

        <main className="flex-1 p-6 overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-2 gap-6 pb-20">
            {players.map((p: any) => (
              <PlayerVoteCard
                key={p.id}
                player={p}
                isMe={p.id === playerId}
                isSelected={selectedTargets.includes(p.id)}
                onSelect={handleSelect}
                mode={votingMode}
              />
            ))}
          </div>
        </main>

        <VotingActions 
          onConfirmVote={handleConfirmVote}
          onSkip={handleSkip}
          needsConfirmation={needsConfirmation}
          hasVoted={hasVoted}
          selectedTargets={selectedTargets}
          maxTargets={votingMode === 'ACCUSE' ? 2 : 1}
          serverVotedFor={me?.votedFor}
          mode={votingMode}
        />
      </div>

      {/* ====== DESKTOP DASHBOARD VIEW ====== */}
      <div className="hidden md:flex flex-col flex-1 min-h-0 w-full p-8 bg-paper pattern-grid-lg overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full flex flex-col min-h-full gap-6 pb-4">
          <DesktopVotingHeader 
             secondsLeft={secondsLeft} 
             needsConfirmation={needsConfirmation}
             hasVoted={hasVoted}
             progress={progress}
          />

          <div className="flex-1 grid grid-cols-[1fr_350px] w-full gap-8 min-h-[600px] max-h-[800px]">
            {/* Left Column: Player Grid */}
            <section className="bg-white rounded-3xl border-2 border-ink/5 shadow-hard-sm flex flex-col overflow-hidden relative p-8 min-h-0">
              <header className="flex flex-col mb-6 shrink-0">
                <h2 className="text-xl font-black uppercase tracking-widest text-ink">Selecciona tu voto</h2>
                <span className="text-xs font-bold text-ink/40 uppercase tracking-widest mt-1">
                  {votingMode === 'LINK' ? 'Busca a tu aliado' : 'Expulsa al impostor'} ({selectedTargets.length} / {votingMode === 'LINK' ? 1 : 2})
                </span>
              </header>

              {isCaos && (
                <div className="flex gap-4 mb-8 shrink-0">
                  <button
                    disabled={hasVoted}
                    onClick={() => { if (!hasVoted) { setVotingMode('LINK'); setSelectedTargets([]); } }}
                    className={`flex-1 py-4 rounded-xl font-display text-sm uppercase tracking-wider transition-all border-b-4 ${votingMode === 'LINK' ? 'bg-secondary text-white border-secondary-dark shadow-hard-sm' : 'bg-white text-ink/40 border-ink/5 shadow-sm hover:-translate-y-1 hover:shadow-hard'} ${hasVoted && votingMode !== 'LINK' ? 'opacity-50 grayscale' : ''}`}
                  >
                    Vincular (1 Objetivo)
                  </button>
                  <button
                    disabled={hasVoted}
                    onClick={() => { if (!hasVoted) { setVotingMode('ACCUSE'); setSelectedTargets([]); } }}
                    className={`flex-1 py-4 rounded-xl font-display text-sm uppercase tracking-wider transition-all border-b-4 ${votingMode === 'ACCUSE' ? 'bg-danger text-white border-danger-dark shadow-hard-sm' : 'bg-white text-ink/40 border-ink/5 shadow-sm hover:-translate-y-1 hover:shadow-hard'} ${hasVoted && votingMode !== 'ACCUSE' ? 'opacity-50 grayscale' : ''}`}
                  >
                    Acusar (2 Sospechosos)
                  </button>
                </div>
              )}

              <main className="flex-1 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-8">
                  {players.map((p: any) => (
                    <PlayerVoteCard
                      key={p.id}
                      player={p}
                      isMe={p.id === playerId}
                      isSelected={selectedTargets.includes(p.id)}
                      onSelect={handleSelect}
                      mode={votingMode}
                    />
                  ))}
                </div>
              </main>
            </section>

            {/* Right Column: Game Info & Actions */}
            <aside className="flex flex-col gap-6 h-full min-h-0">
               {/* Clues History */}
               <div className="flex-1 min-h-0">
                 <DesktopCluesHistory groupedClues={groupedClues} />
               </div>

               {/* Voting Status Panel */}
               <div className="shrink-0 bg-white rounded-3xl border-2 border-ink/5 p-6 shadow-hard-sm">
                  <h3 className="font-black uppercase text-xs tracking-[0.2em] text-ink/40 pb-4 border-b border-ink/5 mb-4 shrink-0">
                    Acción
                  </h3>
                  
                  <div className="shrink-0">
                    <VotingActions 
                      onConfirmVote={handleConfirmVote}
                      onSkip={handleSkip}
                      needsConfirmation={needsConfirmation}
                      hasVoted={hasVoted}
                      selectedTargets={selectedTargets}
                      maxTargets={votingMode === 'ACCUSE' ? 2 : 1}
                      serverVotedFor={me?.votedFor}
                      mode={votingMode}
                    />
                  </div>
               </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
};

