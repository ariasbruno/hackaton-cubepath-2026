import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '../icons/home';
import GroupsIcon from '../icons/groups';
import AddIcon from '../icons/add';
import PersonIcon from '../icons/person';
import SettingsIcon from '../icons/settings';

interface NavItem {
  path: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  label: string;
  isCenter?: boolean;
}

const navItems: NavItem[] = [
  { path: '/', icon: HomeIcon, label: 'Inicio' },
  { path: '/rooms', icon: GroupsIcon, label: 'Salas' },
  { path: '/create', icon: AddIcon, label: 'Crear', isCenter: true },
  { path: '/profile', icon: PersonIcon, label: 'Perfil' },
  { path: '/settings', icon: SettingsIcon, label: 'Ajustes' },
];

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50 bg-white border-t border-ink/5 p-4 pb-8 rounded-t-[32px] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-end">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1 group w-16 -mt-10"
              >
                <div className="w-16 h-16 bg-ink text-white rounded-2xl shadow-hard-lg flex items-center justify-center transition-all group-hover:-translate-y-2 active:translate-y-0 active:shadow-none border-4 border-white">
                  <item.icon className="w-9 h-9" />
                </div>
                <span className="text-[8px] font-bold uppercase tracking-widest text-ink mt-1">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 group w-16"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:-translate-y-1 ${isActive
                    ? 'bg-secondary-muted text-secondary'
                    : 'bg-transparent text-ink/30 group-hover:bg-paper'
                  }`}
              >
                <item.icon className="w-6 h-6" />
              </div>
              <span
                className={`text-[8px] font-bold uppercase tracking-widest ${isActive ? 'text-secondary' : 'text-ink/30'
                  }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
