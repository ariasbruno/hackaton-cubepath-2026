import React from 'react';
import { Card } from '../ui/Card';
import SkullIcon from '../icons/skull';
import VerifiedUserIcon from '../icons/verified-user';
import AdsClickIcon from '../icons/ads-click';
import BoltIcon from '../icons/bolt';
import MasksIcon from '../icons/masks';
import GroupsIcon from '../icons/groups';

interface StatItem {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  color: string;
  value: string | number;
  label: string;
}

interface StatsGridProps {
  impostorGames: number;
  agenteGames: number;
  voteEfficacy: number;
  vinculadoGames: number;
  infiltradoGames: number;
  dispersoGames: number;
}

export const StatsGrid: React.FC<StatsGridProps> = ({
  impostorGames,
  agenteGames,
  voteEfficacy,
  vinculadoGames,
  infiltradoGames,
  dispersoGames,
}) => {
  const stats: StatItem[] = [
    { icon: SkullIcon, color: 'primary', value: impostorGames, label: 'Partidas de Impostor' },
    { icon: VerifiedUserIcon, color: 'secondary', value: agenteGames, label: 'Partidas de Agente' },
    { icon: AdsClickIcon, color: 'accent', value: voteEfficacy > 0 ? `${voteEfficacy}%` : '—', label: 'Eficacia de Voto' },
    { icon: BoltIcon, color: 'purple', value: vinculadoGames, label: 'Vínculo Caos' },
    { icon: MasksIcon, color: 'secondary', value: infiltradoGames, label: 'Infiltrado' },
    { icon: GroupsIcon, color: 'accent', value: dispersoGames, label: 'Dispersos' },
  ];

  return (
    <section className="space-y-4">
      <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight text-ink opacity-40 md:opacity-100 ml-1 md:ml-2">
        Carrera de Inteligencia
      </h3>
      <div className="grid grid-cols-2 gap-4 md:gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.label} 
            variant="paper" 
            borderWidth="thin" 
            className={`p-4 md:p-8 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 transition-all hover:-translate-y-1 md:hover:translate-y-0 active:scale-95 shadow-hard-sm group border-2 md:border-4 md:hover:border-ink`}
          >
            <div className={`w-10 h-10 md:w-16 md:h-16 bg-${stat.color}/10 text-${stat.color} rounded-full md:rounded-2xl flex items-center justify-center shrink-0`}>
              <stat.icon className="w-6 h-6 md:w-10 md:h-10" />
            </div>
            <div>
              <p className={`text-2xl md:text-4xl font-display text-${stat.color} leading-none`}>{stat.value}</p>
              <p className="text-[8px] md:text-xs font-bold uppercase tracking-widest text-ink/40 md:mt-1">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
