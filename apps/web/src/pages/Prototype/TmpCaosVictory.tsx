// @ts-nocheck
import React from 'react';
import { CaosPartnersWonReveal } from '../../components/game/reveal/CaosPartnersWonReveal';

const MOCK_PLAYERS = [
  { id: '1', nickname: 'Bruno', avatar: '1', color: '#FF8C42' },
  { id: '2', nickname: 'Sofi', avatar: '2', color: '#4D9DE0' },
  { id: '3', nickname: 'Luna', avatar: '3', color: '#87C38F' },
  { id: '4', nickname: 'Dante', avatar: '4', color: '#E63946' },
];

export const TmpCaosVictory: React.FC = () => {
  return (
    <CaosPartnersWonReveal
      players={MOCK_PLAYERS}
      vinculadoIds={['1', '2']}
      secretWord="COCTEL"
    />
  );
};
