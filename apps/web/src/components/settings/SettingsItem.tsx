import React from 'react';
import ChevronRightIcon from '../icons/chevron-right';

interface SettingsItemProps {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  value?: string;
  onClick?: () => void;
  variant?: 'default' | 'accent';
}

export const SettingsItem: React.FC<SettingsItemProps> = ({ 
  label, 
  icon: IconComponent, 
  value, 
  onClick,
  variant = 'default'
}) => (
  <button 
    onClick={onClick}
    className="flex items-center gap-3 w-full p-4 group text-left transition-colors"
  >
    <div className={`w-10 h-10 bg-ink/5 rounded-full flex items-center justify-center text-ink/40 transition-colors 
      ${variant === 'accent' ? 'group-hover:bg-accent-muted group-hover:text-accent' : 'group-hover:bg-secondary-muted group-hover:text-secondary'}`}
    >
      <IconComponent className="w-5 h-5" />
    </div>
    <span className="font-bold text-sm uppercase tracking-wide flex-1">{label}</span>
    {value && <span className="text-ink/30 text-sm font-bold mr-1">{value}</span>}
    <ChevronRightIcon className="w-4 h-4 text-ink/20 group-hover:translate-x-0.5 transition-transform" />
  </button>
);
