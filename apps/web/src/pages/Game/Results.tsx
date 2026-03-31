import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { wsClient } from '../../services/ws';
import { GameEvents } from '@impostor/shared';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/api';
import { ConclusionView } from '../../components/game/results/ConclusionView';
import { PlayerScoreItem } from '../../components/game/results/PlayerScoreItem';

interface ResultsProps {
  roomState: any;
  playerId: string;
}

export const Results: React.FC<ResultsProps> = ({ roomState, playerId }) => {
  const { addStats, isRegistered, setProfile } = useAuthStore();
  const [showTotal, setShowTotal] = useState(false);
  const attemptedStatsRef = React.useRef(false);

  const players = roomState.players || [];
  const currentPlayer = players.find((p: any) => p.id === playerId);
  const sortedPlayers = [...players].sort((a, b) => (b.lastMatchPoints || 0) - (a.lastMatchPoints || 0));

  const winnerTeam = roomState.winner;
  const isImpostorWin = winnerTeam === 'IMPOSTORES' || winnerTeam === 'IMPOSTOR' || winnerTeam === 'CAOS';
  const isAgenteWin = winnerTeam === 'AGENTES' || winnerTeam === 'AGENTS';

  const winner = sortedPlayers[0];
  const others = sortedPlayers.slice(1);

  React.useEffect(() => {
    if (!currentPlayer || attemptedStatsRef.current) return;

    if (!isRegistered) {
      attemptedStatsRef.current = true;
      const role = currentPlayer.role || 'AGENTE';
      const points = currentPlayer.lastMatchPoints || 0;
      const votedForId = currentPlayer.votedFor;
      let votedCorrectly = undefined;
      
      if (votedForId) {
        const target = players.find((p: any) => p.id === votedForId);
        votedCorrectly = (target?.role === 'IMPOSTOR' || target?.role === 'INFILTRADO');
      }

      addStats(points, role, votedCorrectly);
    } else {
      attemptedStatsRef.current = true;
      authService.getMe(playerId).then(data => {
        setProfile(data.id, data.nickname, data.avatar, data.color, {
          totalScore: data.totalScore,
          impostorGames: data.impostorGames,
          agenteGames: data.agenteGames,
          infiltradoGames: data.infiltradoGames,
          dispersoGames: data.dispersoGames,
          vinculadoGames: data.vinculadoGames,
          totalVotes: data.totalVotes,
          correctVotes: data.correctVotes,
          globalRank: data.globalRank,
          isRegistered: true
        });
      }).catch(err => console.error('[REGISTERED STATS] Sync failed:', err));
    }
  }, [currentPlayer, isRegistered, addStats, players, playerId, setProfile]);

  const handleReturnToLobby = () => {
    wsClient.send(GameEvents.RETURN_TO_LOBBY, {});
  };

  const getPlayerRoleLabel = (p: any) => {
    const role = p.role || 'AGENTE';
    const isAlive = p.isAlive;
    const isCercanas = roomState.settings?.mode === 'CERCANAS';
    const hasCorrectVote = p.votedFor && roomState.players?.find((pl: any) => pl.id === p.votedFor)?.role === (isCercanas ? 'INFILTRADO' : 'IMPOSTOR');

    switch (role) {
      case 'IMPOSTOR':
      case 'INFILTRADO':
        const roleName = isCercanas ? 'Infiltrado' : 'Impostor';
        return isAlive ? `${roleName} • Infiltrado con éxito` : `${roleName} • Detectado`;
      case 'VINCULADO':
        return isAlive ? 'Vinculado • Caos Sembrado' : 'Vinculado • Desconectado';
      case 'DISPERSO':
        return isAlive ? 'Disperso • Sobreviviente' : 'Disperso • Eliminado';
      default:
        if (hasCorrectVote) return 'Agente • Voto de Éxito';
        return isAlive ? 'Agente • Misión Cumplida' : 'Agente • Caído en Misión';
    }
  };

  const getRoleColor = (p: any) => {
    const role = p.role || 'AGENTE';
    if (role === 'IMPOSTOR' || role === 'INFILTRADO') return 'primary';
    return p.isAlive ? 'secondary' : 'purple';
  };

  if (!showTotal) {
    return (
      <ConclusionView
        currentPlayer={currentPlayer}
        players={players}
        winnerTeam={winnerTeam}
        isImpostorWin={isImpostorWin}
        isAgenteWin={isAgenteWin}
        isCercanasMode={roomState.settings?.mode === 'CERCANAS'}
        onContinue={() => setShowTotal(true)}
      />
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-paper relative overflow-hidden pattern-dots animate-fade-in">
      {/* Header */}
      <header className="p-6 bg-white border-b border-ink/5 flex items-center justify-between shadow-[0_4px_20px_rgba(43,45,66,0.05)] z-20">
        <div className="flex flex-col">
          <h1 className="font-display text-2xl text-primary uppercase tracking-tight leading-none">Puntuaciones</h1>
          <p className="text-[10px] font-extrabold uppercase opacity-40 tracking-[0.2em] mt-1">Resultados de Sesión</p>
        </div>
        <div className="bg-bg-paper border-2 border-ink/5 px-4 py-1.5 rounded-full shadow-hard-sm">
          <span className="font-mono font-bold text-ink/60 text-xs uppercase">#{roomState.code}</span>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar pb-32">
        {/* Rank 1 (The Winner) */}
        {winner && (
          <PlayerScoreItem
            player={winner}
            rank={1}
            isMe={winner.id === playerId}
            isWinner={true}
            roleLabel={getPlayerRoleLabel(winner)}
            roleColor={getRoleColor(winner)}
          />
        )}

        {/* Other Players */}
        <div className="space-y-4">
          {others.map((p, idx) => (
            <PlayerScoreItem
              key={p.id}
              player={p}
              rank={idx + 2}
              isMe={p.id === playerId}
              roleLabel={getPlayerRoleLabel(p)}
              roleColor={getRoleColor(p)}
            />
          ))}
        </div>
      </main>

      <footer className="p-6 bg-white border-t border-ink/5 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-[32px] absolute bottom-0 left-0 right-0">
        <Button variant="primary" size="xl" fullWidth onClick={handleReturnToLobby} className="tracking-widest">
          ¡Otra Partida!
        </Button>
      </footer>
    </div>
  );
};

