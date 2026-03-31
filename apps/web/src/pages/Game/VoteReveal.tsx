import React from 'react';
import { CaosNotFoundReveal } from '../../components/game/reveal/CaosNotFoundReveal';
import { CaosFoundReveal } from '../../components/game/reveal/CaosFoundReveal';
import { CaosPartnersWonReveal } from '../../components/game/reveal/CaosPartnersWonReveal';
import { TraditionalReveal } from '../../components/game/reveal/TraditionalReveal';

interface VoteRevealProps {
  roomState: any;
}

export const VoteReveal: React.FC<VoteRevealProps> = ({ roomState }) => {
  const isCaos = roomState.settings?.mode === 'CAOS';
  const lastEliminatedId = roomState.lastEliminatedId;
  const lastEliminatedIds = roomState.lastEliminatedIds || [];
  const hasDiscovery = lastEliminatedIds.length === 2;

  // Caos Mode Custom Reveal
  if (isCaos) {
    if (hasDiscovery) {
      if (roomState.winner === 'CAOS') {
        return (
          <CaosPartnersWonReveal 
            players={roomState.players} 
            vinculadoIds={lastEliminatedIds} 
            secretWord={roomState.secretWord || ''} 
          />
        );
      }
      return (
        <CaosFoundReveal 
          players={roomState.players} 
          lastEliminatedIds={lastEliminatedIds} 
          secretWord={roomState.secretWord || ''} 
        />
      );
    }
    if (!lastEliminatedId) {
      return <CaosNotFoundReveal />;
    }
  }

  // Traditional & Cercanas Mode now use the unified Tactical Reveal
  return <TraditionalReveal roomState={roomState} />;
};

