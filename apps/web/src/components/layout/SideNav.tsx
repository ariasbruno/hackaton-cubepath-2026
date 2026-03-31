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

export const SideNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="hidden md:flex flex-col items-center gap-2 w-20 lg:w-64 h-full py-8 px-3 lg:px-4 bg-white border-r-2 border-ink/5 shrink-0 z-40">
      {/* Logo / Brand */}
      <div className="mb-6 w-full flex items-center justify-center lg:justify-start gap-3 px-2">
        <div className="w-10 h-10 bg-primary rounded-2xl shadow-hard flex items-center justify-center shrink-0 overflow-hidden">
          <img src="/logo.svg" alt="El Impostor" className="w-full h-full object-cover p-1" />
        </div>
        <span className="hidden lg:block font-display text-xl text-ink uppercase tracking-tight leading-none">
          El Impostor
        </span>
      </div>

      <nav className="flex flex-col items-center lg:items-stretch gap-1 w-full flex-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="group flex items-center justify-center lg:justify-start gap-3 w-full my-1 px-2 py-3 bg-ink text-white rounded-2xl shadow-hard hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-y-0 active:shadow-none transition-all"
              >
                <item.icon className="w-6 h-6 shrink-0" />
                <span className="hidden lg:block text-sm font-bold uppercase tracking-widest">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group flex items-center justify-center lg:justify-start gap-3 w-full px-2 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-secondary-muted text-secondary'
                  : 'bg-transparent text-ink/40 hover:bg-paper hover:text-ink'
              }`}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span
                className={`hidden lg:block text-sm font-bold uppercase tracking-widest ${
                  isActive ? 'text-secondary' : ''
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Version badge at the bottom */}
      <div className="mt-auto hidden lg:block">
        <p className="text-[9px] font-bold text-ink/20 uppercase tracking-widest text-center">v1.1.0</p>
      </div>
    </aside>
  );
};
