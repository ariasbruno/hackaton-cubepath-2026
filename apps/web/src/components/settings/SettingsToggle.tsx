import React from 'react';

interface SettingsToggleProps {
  label: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  enabled: boolean;
  onToggle: () => void;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({ 
  label, 
  icon: IconComponent, 
  enabled, 
  onToggle 
}) => (
  <button
    onClick={onToggle}
    className="flex items-center justify-between w-full p-4 group"
  >
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-ink/5 rounded-full flex items-center justify-center text-ink/40 group-hover:bg-secondary-muted group-hover:text-secondary transition-colors">
        <IconComponent className="w-5 h-5" />
      </div>
      <span className="font-bold text-sm uppercase tracking-wide">{label}</span>
    </div>
    <div
      className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors ${
        enabled ? 'bg-accent' : 'bg-ink/10'
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-hard-sm transform transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </div>
  </button>
);
