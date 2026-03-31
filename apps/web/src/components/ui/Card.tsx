import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'solid' | 'muted' | 'paper' | 'sticky';
  color?: 'primary' | 'secondary' | 'accent' | 'danger' | 'purple' | 'yellow';
  pressable?: boolean;
  borderWidth?: 'none' | 'thin' | 'thick';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'solid',
  color = 'primary',
  pressable = false,
  borderWidth = 'thick',
  className = '',
  ...props
}) => {
  const borderStyles = {
    none: '',
    thin: 'border-2 border-ink/5',
    thick: 'border-4 border-ink/5',
  };

  const backgrounds: Record<string, Record<string, string>> = {
    solid: {
      primary: 'bg-primary',
      secondary: 'bg-secondary',
      accent: 'bg-accent',
      danger: 'bg-danger',
      purple: 'bg-purple',
      yellow: 'bg-yellow',
    },
    muted: {
      primary: 'bg-primary-muted',
      secondary: 'bg-secondary-muted',
      accent: 'bg-accent-muted',
      danger: 'bg-danger-muted',
      purple: 'bg-purple-muted',
      yellow: 'bg-yellow-muted',
    },
    paper: {
      primary: 'bg-white',
      secondary: 'bg-white',
      accent: 'bg-white',
      danger: 'bg-white',
      purple: 'bg-white',
      yellow: 'bg-white',
    },
    sticky: {
      primary: 'bg-yellow',
      secondary: 'bg-yellow',
      accent: 'bg-yellow',
      danger: 'bg-yellow',
      purple: 'bg-yellow',
      yellow: 'bg-yellow',
    },
  };

  const pressClass = pressable ? 'paper-card cursor-pointer' : '';

  return (
    <div
      className={`rounded-card shadow-hard overflow-hidden p-6 ${borderStyles[borderWidth]} ${backgrounds[variant][color]} ${pressClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
