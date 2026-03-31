import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/layout/PageHeader';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/useAuthStore';
import { PageTransition } from '../components/layout/PageTransition'; 

/* Modular Components */
import { SettingsToggle } from '../components/settings/SettingsToggle';
import { SettingsItem } from '../components/settings/SettingsItem';
import { SettingsGroup } from '../components/settings/SettingsGroup';
import { SettingsModals } from '../components/settings/SettingsModals';

/* Icons */
import VolumeUpIcon from '../components/icons/volume-up';
import VibrationRoundedIcon from '../components/icons/vibration-rounded';
import NotificationsIcon from '../components/icons/notifications';
import TranslateIcon from '../components/icons/translate';
import InfoIcon from '../components/icons/info';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { clearAuth } = useAuthStore();
  const [sound, setSound] = React.useState(true);
  const [vibration, setVibration] = React.useState(true);
  const [notifications, setNotifications] = React.useState(false);
  
  const [confirmModal, setConfirmModal] = React.useState<{ isOpen: boolean; type: 'logout' | 'delete' | 'about' | null }>({
    isOpen: false,
    type: null
  });

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  const handleDeleteData = () => {
    localStorage.clear();
    clearAuth();
    navigate('/');
    window.location.reload();
  };

  const openConfirm = (type: 'logout' | 'delete' | 'about') => {
    setConfirmModal({ isOpen: true, type });
  };

  const handleConfirm = () => {
    if (confirmModal.type === 'delete') handleDeleteData();
    else if (confirmModal.type === 'logout') handleLogout();
    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  return (
    <PageTransition className="bg-paper pattern-dots overflow-hidden">
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className="max-w-md mx-auto md:max-w-2xl pb-32">
        <PageHeader title="Ajustes" onBack={() => navigate('/')} />

        <div className="px-6 space-y-6">
          <SettingsGroup title="Juego">
            <SettingsToggle icon={VolumeUpIcon} label="Sonido" enabled={sound} onToggle={() => setSound(!sound)} />
            <SettingsToggle icon={VibrationRoundedIcon} label="Vibración" enabled={vibration} onToggle={() => setVibration(!vibration)} />
            <SettingsToggle icon={NotificationsIcon} label="Notificaciones" enabled={notifications} onToggle={() => setNotifications(!notifications)} />
          </SettingsGroup>

          <SettingsGroup title="Aplicación">
            <SettingsItem icon={TranslateIcon} label="Idioma" value="Español" />
            <SettingsItem 
              icon={InfoIcon} 
              label="Acerca de" 
              value="v0.0.1" 
              variant="accent" 
              onClick={() => openConfirm('about')} 
            />
          </SettingsGroup>

          <section className="pt-4 space-y-3">
            <Button
              variant="ghost"
              fullWidth
              onClick={() => openConfirm('logout')}
              className="bg-white! text-ink! border-2 border-ink/5"
            >
              Cerrar Sesión
            </Button>

            <Button
              variant="danger"
              fullWidth
              onClick={() => openConfirm('delete')}
              noOutline
              className="shadow-hard"
            >
              Borrar mis datos
            </Button>
            <p className="text-[10px] text-center text-ink/30 font-bold uppercase tracking-widest px-8">
              Esta acción borrará partidas guardadas, estadísticas y tu perfil local.
            </p>
          </section>
        </div>
        </div>
      </main>

      <SettingsModals 
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={handleConfirm}
      />
    </PageTransition>
  );
};
