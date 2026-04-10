import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LOCAL_PHASES, GAME_MODES, PLAYER_ROLES } from '@impostor/shared';
import { useLocalGameStore, type LocalPlayer } from '../../store/useLocalGameStore';
import { LocalGameEngine } from '../../engine/LocalGameEngine';
import { useAuthStore } from '../../store/useAuthStore';

// Modular Components
import { LocalLobby } from '../../components/local/LocalLobby';
import { PassPhone } from '../../components/local/PassPhone';
import { LocalAssigning } from '../../components/local/LocalAssigning';
import { LocalPlaying } from '../../components/local/LocalPlaying';
import { LocalVoting } from '../../components/local/LocalVoting';
import { LocalResults } from '../../components/local/LocalResults';
import { LocalReveal } from '../../components/local/LocalReveal';
import { RegistrationRequired } from '../../components/local/RegistrationRequired';
import { PageTransition } from '../../components/layout/PageTransition';

export const LocalGameFlow: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { isRegistered } = useAuthStore();

  const [newName, setNewName] = useState('');
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Selectors
  const game = useLocalGameStore(s => s.games[code!]);
  const updateGame = useLocalGameStore(s => s.updateGame);
  const deleteGame = useLocalGameStore(s => s.deleteGame);
  const resetGameAction = useLocalGameStore(s => s.resetGame);

  // Hydration Guard
  useEffect(() => {
    const checkHydration = () => {
      // @ts-ignore - access internal persist api from zustand
      if (useLocalGameStore.persist?.hasHydrated()) {
        setIsHydrated(true);
      } else {
        setTimeout(checkHydration, 10);
      }
    };
    checkHydration();
  }, []);

  // Guard: Local play requires registration
  useEffect(() => {
    if (isHydrated && !isRegistered) {
      setRegistrationOpen(true);
    }
  }, [isHydrated, isRegistered]);

  // Guard: Redirect if game not found
  useEffect(() => {
    if (isHydrated && !game) {
      navigate('/rooms', { replace: true });
    }
  }, [isHydrated, game, navigate]);

  if (!isHydrated || !game) {
    return (
      <div className="flex-1 flex items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-display text-ink/40 uppercase tracking-widest text-xs">Cargando partida...</p>
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <RegistrationRequired
        registrationOpen={registrationOpen}
        onRegister={() => setRegistrationOpen(true)}
        onBack={() => navigate('/')}
        onCloseRegistration={() => setRegistrationOpen(false)}
      />
    );
  }

  const AVATARS = [
    'noto--bear', 'noto--cat-face', 'noto--cow-face', 'noto--dog-face', 
    'noto--fox', 'noto--frog', 'noto--hamster', 'noto--koala', 
    'noto--lion', 'noto--monkey-face', 'noto--panda', 'noto--rabbit-face', 
    'noto--tiger-face', 'noto--wolf'
  ];

  const AVATAR_COLORS = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F06292', '#AED581', '#FFD54F', '#4DB6AC', '#81C784'
  ];

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
      const randomColor = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      const player: LocalPlayer = {
        id: crypto.randomUUID(),
        name: newName.trim(),
        avatarId: randomAvatar,
        avatarColor: randomColor,
        isAlive: true,
        votesReceived: 0
      };
      updateGame(code!, { players: [...game.players, player] });
      setNewName('');
    }
  };

  const handleRemovePlayer = (id: string) => {
    updateGame(code!, { players: game.players.filter(p => id !== p.id) });
  };

  const renderPhase = () => {
    const { phase, players, currentPlayerIndex, secretWord, winner } = game;

    switch (phase) {
      case LOCAL_PHASES.LOBBY:
        return (
          <LocalLobby
            players={players}
            settings={game.settings}
            newName={newName}
            setNewName={setNewName}
            onAddPlayer={handleAddPlayer}
            onRemovePlayer={handleRemovePlayer}
            onUpdatePlayer={(id, updates) => {
              const newPlayers = players.map(p => p.id === id ? { ...p, ...updates } : p);
              updateGame(code!, { players: newPlayers });
            }}
            onStart={() => LocalGameEngine.startGame(code!)}
            onBack={() => navigate('/rooms')}
            onDelete={() => {
              deleteGame(code!);
              navigate('/rooms');
            }}
          />
        );
      case LOCAL_PHASES.PASS_PHONE:
        const nextPlayer = players[currentPlayerIndex];
        return (
          <PassPhone
            nextPlayerName={nextPlayer.name}
            onGotIt={() => updateGame(code!, { phase: LOCAL_PHASES.ASSIGNING })}
          />
        );
      case LOCAL_PHASES.ASSIGNING:
        const currentPlayer = players[currentPlayerIndex];
        return (
          <LocalAssigning
            player={currentPlayer}
            isCercanasMode={game.settings.mode === GAME_MODES.CERCANAS}
            onNextReveal={() => {
              if (currentPlayerIndex < players.length - 1) {
                updateGame(code!, {
                  currentPlayerIndex: currentPlayerIndex + 1,
                  phase: LOCAL_PHASES.PASS_PHONE
                });
              } else {
                updateGame(code!, { phase: LOCAL_PHASES.PLAYING });
              }
            }}
          />
        );
      case LOCAL_PHASES.PLAYING:
        const playerWithTurn = players[currentPlayerIndex];
        return (
          <LocalPlaying
            playerName={playerWithTurn.name}
            isLast={currentPlayerIndex === players.length - 1}
            onNext={() => {
              if (currentPlayerIndex < players.length - 1) {
                updateGame(code!, { currentPlayerIndex: currentPlayerIndex + 1 });
              } else {
                updateGame(code!, {
                  currentPlayerIndex: 0,
                  phase: LOCAL_PHASES.VOTING
                });
              }
            }}
          />
        );
      case LOCAL_PHASES.VOTING:
        return (
          <LocalVoting
            players={players}
            onVote={(targetId) => LocalGameEngine.handleVote(code!, targetId)}
            onBack={() => navigate('/rooms')}
          />
        );
      case LOCAL_PHASES.REVEAL:
        const votedPlayer = players.find(p => p.id === game.votedPlayerId);
        if (!votedPlayer) return null;
        return (
          <LocalReveal
            votedPlayer={votedPlayer}
            agentsWord={secretWord}
            onContinue={() => updateGame(code!, { phase: LOCAL_PHASES.RESULTS })}
          />
        );
      case LOCAL_PHASES.RESULTS:
        const impostor = players.find(p => p.role === PLAYER_ROLES.IMPOSTOR || p.role === PLAYER_ROLES.INFILTRADO);
        return (
          <LocalResults
            mode={game.settings.mode}
            winner={winner}
            impostorName={impostor?.name}
            impostorAvatarId={impostor?.avatarId}
            impostorAvatarColor={impostor?.avatarColor}
            secretWord={secretWord}
            onReset={() => resetGameAction(code!)}
            onExit={() => navigate('/rooms')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-dvh bg-paper overflow-y-auto no-scrollbar pb-safe">
      <div className="flex-1 w-full flex flex-col">
        <PageTransition className="flex-1 flex flex-col py-8 pb-12">
          {renderPhase()}
        </PageTransition>
      </div>
    </div>
  );
};
