// @ts-nocheck
import React from 'react';
import { CaosFoundReveal } from '../../components/game/reveal/CaosFoundReveal';

const MOCK_PLAYERS = [
  { id: '1', nickname: 'Bruno', avatar: '1', color: '#FF8C42' },
  { id: '2', nickname: 'Sofi', avatar: '2', color: '#4D9DE0' },
  { id: '3', nickname: 'Luna', avatar: '3', color: '#87C38F' },
  { id: '4', nickname: 'Dante', avatar: '4', color: '#E63946' },
];

export const TmpCaosFound: React.FC = () => {
  return (
    <CaosFoundReveal
      players={MOCK_PLAYERS}
      lastEliminatedIds={['1', '2']}
      secretWord="PLAYA"
    />
  );
};
