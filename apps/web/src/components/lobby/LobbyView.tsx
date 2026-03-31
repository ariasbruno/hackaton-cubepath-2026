import React from 'react';
import { PageTransition } from '../layout/PageTransition';
import { LobbyHeader } from './LobbyHeader';
import { Scoreboard } from './Scoreboard';
import { LobbyChat } from './LobbyChat';
import { PlayerGrid } from './PlayerGrid';
import { LobbyFooter } from './LobbyFooter';
import { RegistrationModal } from '../auth/RegistrationModal';

interface LobbyViewProps {
  roomState: any;
  code: string;
  playerId: string;
  isHost: boolean;
  isStarting: boolean;
  registrationOpen: boolean;
  onShare: () => void;
  onLeave: () => void;
  onStart: () => void;
  onRegistrationClose: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  roomState,
  code,
  playerId,
  isHost,
  isStarting,
  registrationOpen,
  onShare,
  onLeave,
  onStart,
  onRegistrationClose,
}) => {
  return (
    <PageTransition className="pattern-dots relative bg-paper overflow-hidden md:flex md:flex-row md:items-stretch h-full">
      {/* Main Content Area (Left on Desktop, Full on Mobile) */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 overflow-hidden">
        <main className="flex-1 px-6 md:px-0 flex flex-col gap-8 md:gap-0 no-scrollbar overflow-y-auto pb-safe">
          
          <div className="md:pt-8 md:px-12">
            <LobbyHeader 
              mode={roomState.settings?.mode} 
              code={code} 
              onShare={onShare}
              onBack={onLeave}
            />
          </div>

          <div className="md:hidden">
            <Scoreboard 
              players={roomState.players} 
              hostId={roomState.hostId} 
              mode={roomState.settings?.mode}
            />
          </div>

          <div className="md:hidden">
            <LobbyChat 
              chatMessages={roomState.chatMessages} 
              playerId={playerId} 
              mode={roomState.settings?.mode}
            />
          </div>

          <div className="w-full max-w-4xl mx-auto md:px-12 pb-12 mt-4 md:mt-12">
            <PlayerGrid 
              players={roomState.players}
              maxPlayers={roomState.settings?.maxPlayers || 8}
              hostId={roomState.hostId}
              currentPlayerId={playerId}
              mode={roomState.settings?.mode}
            />
          </div>

        </main>

        <LobbyFooter 
          players={roomState.players}
          isHost={isHost}
          isStarting={isStarting}
          canStart={roomState.players.length >= (roomState.settings?.mode === 'CAOS' ? 4 : 3)}
          onStart={onStart}
          mode={roomState.settings?.mode}
        />
      </div>

      {/* Right Sidebar (Chat & Scoreboard on Desktop) */}
      <div className="hidden md:flex w-[400px] shrink-0 border-l-2 border-ink/5 bg-paper flex-col h-full z-20 shadow-[-10px_0_40px_rgba(0,0,0,0.03)] pb-safe relative">
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm pointer-events-none" />
        
        <div className="p-6 pb-2 shrink-0 relative z-10">
          <Scoreboard 
            players={roomState.players} 
            hostId={roomState.hostId} 
            mode={roomState.settings?.mode}
          />
        </div>

        <div className="flex-1 min-h-0 p-6 pt-2 relative z-10 [&>section]:h-full [&>section>div]:h-full!">
          <LobbyChat 
            chatMessages={roomState.chatMessages} 
            playerId={playerId} 
            mode={roomState.settings?.mode}
          />
        </div>
      </div>

      <RegistrationModal 
        isOpen={registrationOpen} 
        onClose={onRegistrationClose} 
        onSuccess={onRegistrationClose}
      />
    </PageTransition>
  );
};
