import React from 'react';
import CheckIcon from '../icons/check';

interface SelectionCardProps {
  selected: boolean;
  onSelect: () => void;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  activeColor?: 'primary' | 'secondary' | 'accent' | 'danger' | 'purple';
  variant?: 'circle' | 'squircle';
  size?: 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const colorMap = {
  primary: {
    border: 'border-primary',
    bg: 'bg-primary-muted',
    iconBg: 'bg-primary/10',
    iconText: 'text-primary',
    checkBg: 'bg-primary',
  },
  secondary: {
    border: 'border-secondary',
    bg: 'bg-secondary-muted',
    iconBg: 'bg-secondary/10',
    iconText: 'text-secondary',
    checkBg: 'bg-secondary',
  },
  accent: {
    border: 'border-accent',
    bg: 'bg-accent-muted',
    iconBg: 'bg-accent/10',
    iconText: 'text-accent',
    checkBg: 'bg-accent',
  },
  danger: {
    border: 'border-danger',
    bg: 'bg-danger-muted',
    iconBg: 'bg-danger/10',
    iconText: 'text-danger',
    checkBg: 'bg-danger',
  },
  purple: {
    border: 'border-purple',
    bg: 'bg-purple-muted',
    iconBg: 'bg-purple/10',
    iconText: 'text-purple',
    checkBg: 'bg-purple',
  },
};

export const SelectionCard: React.FC<SelectionCardProps> = ({
  selected,
  onSelect,
  icon: IconComponent,
  title,
  description,
  activeColor = 'primary',
  variant = 'circle',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const colors = colorMap[activeColor];

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`block relative w-full cursor-pointer text-left group ${disabled ? 'opacity-40 pointer-events-none' : ''} ${className}`}
    >
      <div
        className={`${selected ? `${colors.border} ${colors.bg}` : 'bg-white border-ink/5'} ${size === 'lg' ? 'p-8' : 'p-6'} rounded-card border-4 shadow-hard paper-card flex items-center gap-6 transition-all`}
      >
        <div
          className={`${size === 'lg' ? 'w-20 h-20' : 'w-16 h-16'} ${colors.iconBg} ${colors.iconText} ${
            variant === 'circle' ? 'rounded-full group-hover:scale-110' : 'rounded-2xl group-hover:rotate-3'
          } flex items-center justify-center shrink-0 transition-transform`}
        >
          <IconComponent className={size === 'lg' ? 'w-12 h-12' : 'w-9 h-9'} />
        </div>
        <div>
          <h3 className={`${size === 'lg' ? 'text-2xl' : 'text-xl'} font-display uppercase leading-none mb-1`}>
            {title}
          </h3>
          <p className="text-[10px] font-bold text-ink/40 uppercase leading-tight">
            {description}
          </p>
        </div>
      </div>
      {/* Check indicator */}
      <div
        className={`absolute -top-2 -right-2 w-8 h-8 ${colors.checkBg} text-white rounded-full flex items-center justify-center border-4 border-white shadow-hard-sm transition-opacity ${
          selected ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <CheckIcon className="w-4 h-4" />
      </div>
    </button>
  );
};
