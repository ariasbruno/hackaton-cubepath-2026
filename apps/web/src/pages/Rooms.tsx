import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomService } from '../services/api';

import { useAuthStore } from '../store/useAuthStore';
import { useLocalGameStore } from '../store/useLocalGameStore';
import { useToastStore } from '../store/useToastStore';
import { RegistrationModal } from '../components/auth/RegistrationModal';
import { PageTransition } from '../components/layout/PageTransition';

/* Modular Components */
import { JoinByCode } from '../components/rooms/JoinByCode';
import { ModeFilters } from '../components/rooms/ModeFilters';
import { SavedRooms } from '../components/rooms/SavedRooms';
import { PublicRoomsList } from '../components/rooms/PublicRoomsList';

export const Rooms: React.FC = () => {
  const navigate = useNavigate();
  const { playerId, isRegistered, verifySession, clearAuth } = useAuthStore();
  const { addToast } = useToastStore();
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [pendingJoinCode, setPendingJoinCode] = useState<string | null>(null);

  const [savedGames, setSavedGames] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('saved_rooms');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const localGames = useLocalGameStore((state) => state.games);
  const deleteLocalGame = useLocalGameStore((state) => state.deleteGame);

  // Combine online saved games with active local sessions
  const allSavedGames = [...savedGames];
  
  // Add all local games to the list
  Object.values(localGames).forEach(game => {
    allSavedGames.unshift({
      code: game.code,
      name: game.name || 'Partida Local',
      isLocal: true,
      mode: game.settings.mode, // Capture the mode
      playerCount: game.players.length,
      color: '#e0f2fe'
    });
  });

  useEffect(() => {
    roomService.getPublicRooms()
      .then((data) => setRooms(data.rooms || []))
      .catch(console.error);
  }, []);

  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = roomCode.trim().toUpperCase();
    if (!code) return;
    
    if (!isRegistered) {
      setPendingJoinCode(code);
      setRegistrationOpen(true);
      return;
    }

    setError('');
    try {
      if (playerId && !playerId.startsWith('guest_')) {
        await verifySession(playerId);
      }
      await roomService.checkRoom(code);
      navigate(`/room/${code}`);
    } catch (err: any) {
      if (err.status === 404 && err.url?.includes('/auth/verify')) {
        addToast('Usuario no encontrado, regístrate de nuevo', 'error');
        clearAuth();
        setPendingJoinCode(code);
        setRegistrationOpen(true);
      } else {
        setError(err.message || 'Error al entrar a la sala');
      }
    }
  };

  const attemptJoin = async (code: string) => {
    if (localGames[code]) {
      navigate(`/local/${code}`);
      return;
    }

    if (!isRegistered) {
      setPendingJoinCode(code);
      setRegistrationOpen(true);
      return;
    }

    try {
      if (playerId && !playerId.startsWith('guest_')) {
        await verifySession(playerId);
      }
      navigate(`/room/${code}`);
    } catch (err: any) {
      if (err.status === 404 && err.url?.includes('/auth/verify')) {
        addToast('Usuario no encontrado, regístrate de nuevo', 'error');
        clearAuth();
        setPendingJoinCode(code);
        setRegistrationOpen(true);
      } else {
        navigate(`/room/${code}`);
      }
    }
  };

  const handleClearSaved = () => {
    localStorage.removeItem('saved_rooms');
    setSavedGames([]);
    // Also clear all local games
    Object.keys(localGames).forEach(code => deleteLocalGame(code));
  };

  const [isPending, startTransition] = React.useTransition();
  const modeFilters = ['Todos', 'Tradicional', 'Cercanas', 'Caos'];
  const [activeFilter, setActiveFilter] = useState('Todos');

  const handleFilterChange = (filter: string) => {
    startTransition(() => {
      setActiveFilter(filter);
    });
  };

  const filteredRooms = activeFilter === 'Todos'
    ? rooms
    : rooms.filter((r) => r.settings?.mode?.toUpperCase() === activeFilter.toUpperCase());

  return (
    <PageTransition className="bg-paper pattern-dots overflow-hidden selection:bg-primary selection:text-white">
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-md mx-auto md:max-w-2xl px-6 flex flex-col gap-6 pb-32">
        {/* Header */}
        <header className="pt-8 pb-2">
          <h1 className="font-display text-4xl text-ink uppercase tracking-tight mb-1">
            Salas
          </h1>
          <p className="text-xs text-ink/40 font-bold uppercase tracking-widest">
            Encuentra tu partida perfecta
          </p>
        </header>

        <JoinByCode 
          roomCode={roomCode}
          setRoomCode={setRoomCode}
          onSubmit={handleJoinByCode}
          error={error}
        />

        <ModeFilters 
          filters={modeFilters}
          activeFilter={activeFilter}
          onFilterClick={handleFilterChange}
        />
        
        <div className={isPending ? 'opacity-50 transition-opacity' : 'transition-opacity'}>
          <SavedRooms 
            games={allSavedGames}
            onClear={handleClearSaved}
            onJoin={attemptJoin}
          />

          <PublicRoomsList 
            rooms={filteredRooms}
            onJoin={attemptJoin}
            onCreateRoom={() => navigate('/create')}
          />
        </div>
        </div>
      </main>

      <RegistrationModal 
        isOpen={registrationOpen} 
        onClose={() => setRegistrationOpen(false)} 
        onSuccess={() => pendingJoinCode && navigate(`/room/${pendingJoinCode}`)}
      />
    </PageTransition>
  );
};
