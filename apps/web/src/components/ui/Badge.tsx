import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'accent' | 'danger' | 'purple' | 'yellow' | 'ink';
  className?: string;
}

const colorMap = {
  primary: 'bg-primary text-white',
  secondary: 'bg-secondary text-white',
  accent: 'bg-accent text-white',
  danger: 'bg-danger text-white',
  purple: 'bg-purple text-white',
  yellow: 'bg-yellow text-ink',
  ink: 'bg-ink text-white',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'primary',
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-hard-sm border-2 border-white ${colorMap[color]} ${className}`}
    >
      {children}
    </span>
  );
};
