import React from 'react';
import { RoleReveal } from '../../pages/Game/RoleReveal';
import { Playing } from '../../pages/Game/Playing';
import { Voting } from '../../pages/Game/Voting';
import { VoteReveal } from '../../pages/Game/VoteReveal';
import { Results } from '../../pages/Game/Results';

interface RoomPhaseDispatcherProps {
  roomState: any;
  playerId: string;
  currentPlayer: any;
}

export const RoomPhaseDispatcher: React.FC<RoomPhaseDispatcherProps> = ({
  roomState,
  playerId,
  currentPlayer,
}) => {
  const { phase, timerEndAt } = roomState;

  if (phase === 'ASSIGNING') {
    return <RoleReveal player={currentPlayer} timerEndAt={timerEndAt} room={roomState} />;
  }
  if (phase === 'CLUES' || phase === 'DISCUSSING') {
    return <Playing roomState={roomState} playerId={playerId} />;
  }
  if (phase === 'VOTING') {
    return <Voting roomState={roomState} playerId={playerId} />;
  }
  if (phase === 'VOTE_REVEAL') {
    return <VoteReveal roomState={roomState} />;
  }
  if (phase === 'RESULTS') {
    return <Results roomState={roomState} playerId={playerId} />;
  }

  return null;
};
