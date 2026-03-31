import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useGameStore } from '../store/useGameStore';
import { wsClient } from '../services/ws';
import { GameEvents } from '@impostor/shared';

/* Modular Components */
import { LobbyView } from '../components/lobby/LobbyView';
import { RoomPhaseDispatcher } from '../components/lobby/RoomPhaseDispatcher';
import { RoomStatus } from '../components/lobby/RoomStatus';

export const Lobby: React.FC = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const { playerId, isRegistered } = useAuthStore();
  const { roomState, setRoomCode, updateRoomState, addChatMessage, addClue, clearGame } = useGameStore();
  const [error, setError] = useState('');
  const [isStarting, setIsStarting] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  useEffect(() => {
    if (!playerId || !code) {
      navigate('/');
      return;
    }

    if (!isRegistered) {
      setRegistrationOpen(true);
      return;
    }

    setRoomCode(code);

    const handleRoomState = (payload: any) => {
      updateRoomState(payload);
      if (payload.phase !== 'LOBBY') {
        setIsStarting(false);
      }
    };

    const handleDisconnect = () => {
      setError('Desconectado del servidor de juego.');
    };

    const handleError = (payload: any) => {
      setError(payload.message || 'Error desconocido.');
      setIsStarting(false);
    };

    wsClient.on(GameEvents.ROOM_UPDATE, handleRoomState);
    wsClient.on(GameEvents.GAME_STATE_SYNC, handleRoomState);
    wsClient.on(GameEvents.NEW_CHAT_MESSAGE, addChatMessage);
    wsClient.on(GameEvents.NEW_CLUE, addClue);
    wsClient.on('DISCONNECTED', handleDisconnect);
    wsClient.on(GameEvents.ERROR, handleError);

    wsClient.connect(code, playerId)
      .then(() => setError(''))
      .catch(() => setError('Fallo de conexión. Verifica que el servidor está encendido.'));

    return () => {
      wsClient.off(GameEvents.ROOM_UPDATE, handleRoomState);
      wsClient.off(GameEvents.GAME_STATE_SYNC, handleRoomState);
      wsClient.off(GameEvents.NEW_CHAT_MESSAGE, addChatMessage);
      wsClient.off(GameEvents.NEW_CLUE, addClue);
      wsClient.off('DISCONNECTED', handleDisconnect);
      wsClient.off(GameEvents.ERROR, handleError);
      wsClient.disconnect();
      clearGame();
    };
  }, [code, playerId, navigate, setRoomCode, updateRoomState, clearGame, isRegistered]);

  const handleLeave = () => {
    wsClient.leave();
    navigate('/');
  };

  const handleStart = () => {
    setIsStarting(true);
    setError('');
    wsClient.send(GameEvents.START_GAME, { roomId: code });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '¡Únete a El Impostor!',
        text: `Jugamos en la sala ${roomState?.settings?.name || 'de El Impostor'}. Únete con el código: ${code}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(code || '');
    }
  };

  /* ── Status View (Error / Loading) ── */
  if (error || !roomState) {
    return (
      <RoomStatus 
        error={error} 
        loading={!error && !roomState} 
        onLeave={handleLeave} 
      />
    );
  }

  /* ── Current Player Context ── */
  const currentPlayer = roomState.players.find((p: any) => p.id === playerId);
  const isHost = roomState.hostId === playerId;

  /* ── Phase Dispatcher (Game Content) ── */
  if (roomState.phase !== 'LOBBY') {
    if (!currentPlayer) {
      return <RoomStatus missingProfile={true} onLeave={handleLeave} />;
    }
    
    return (
      <RoomPhaseDispatcher 
        roomState={roomState} 
        playerId={playerId!} 
        currentPlayer={currentPlayer} 
      />
    );
  }

  /* ── Lobby UI ── */
  return (
    <LobbyView
      roomState={roomState}
      code={code!}
      playerId={playerId!}
      isHost={isHost}
      isStarting={isStarting}
      registrationOpen={registrationOpen}
      onShare={handleShare}
      onLeave={handleLeave}
      onStart={handleStart}
      onRegistrationClose={() => {
        setRegistrationOpen(false);
        if (!isRegistered) navigate('/');
      }}
    />
  );
};
