import React from 'react';
import RestaurantIcon from '../icons/restaurant';
import VisibilityIcon from '../icons/visibility';
import VisibilityOffIcon from '../icons/visibility-off';

interface StickyWordReminderProps {
  player: any;
  isVisible: boolean;
  onToggle: () => void;
}

export const StickyWordReminder: React.FC<StickyWordReminderProps> = ({ player, isVisible, onToggle }) => {
  if (!player) return null;

  return (
    <div className="px-6 mb-4">
      <div className="bg-white p-4 rounded-card border-2 border-accent/20 shadow-hard flex items-center justify-between group overflow-hidden relative">
        <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-4 relative z-10 w-full justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onToggle}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-hard-sm transition-all active:translate-y-0.5 ${isVisible ? 'bg-primary' : 'bg-accent'}`}
            >
              {isVisible ? <VisibilityOffIcon className="w-4 h-4" /> : <VisibilityIcon className="w-4 h-4" />}
            </button>
            <div>
              <p className="text-[8px] font-extrabold uppercase tracking-[0.3em] text-accent">Tu secreto</p>
              <p className={`font-display ${isVisible && player.word?.length > 12 ? 'text-lg' :
                  isVisible && player.word?.length > 10 ? 'text-xl' :
                    'text-2xl'
                } text-ink leading-none uppercase tracking-tight transition-all duration-300`}>
                {isVisible
                  ? (player.role === 'IMPOSTOR' ? 'IMPOSTOR 🕵️' : player.word)
                  : '••••••••'}
              </p>
            </div>
          </div>
          <RestaurantIcon className="w-9 h-9 text-accent/10 transform -rotate-12" />
        </div>
      </div>
    </div>
  );
};
