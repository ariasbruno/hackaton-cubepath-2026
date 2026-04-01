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
    className="flex items-center justify-between w-full p-3.5 group"
  >
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 bg-ink/5 rounded-full flex items-center justify-center text-ink/40 group-hover:bg-secondary-muted group-hover:text-secondary transition-colors">
        <IconComponent className="w-[18px] h-[18px]" />
      </div>
      <span className="font-bold text-[13px] uppercase tracking-wide">{label}</span>
    </div>
    <div
      className={`w-[50px] h-[28px] rounded-full flex items-center p-1 transition-colors ${
        enabled ? 'bg-accent' : 'bg-ink/10'
      }`}
    >
      <div
        className={`w-[22px] h-[22px] bg-white rounded-full shadow-hard-sm transform transition-transform ${
          enabled ? 'translate-x-[22px]' : 'translate-x-0'
        }`}
      />
    </div>
  </button>
);
