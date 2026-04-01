import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import GroupsIcon from '../icons/groups';

interface SettingsModalsProps {
  isOpen: boolean;
  type: 'logout' | 'delete' | 'about' | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const SettingsModals: React.FC<SettingsModalsProps> = ({
  isOpen,
  type,
  onClose,
  onConfirm
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
    >
      <Modal.Header title={
        type === 'about' ? 'EL IMPOSTOR' :
        type === 'delete' ? '¿ELIMINAR TODO?' : 
        '¿CERRAR SESIÓN?'
      } />
      <Modal.Body className="space-y-6">
        {type === 'about' ? (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl mx-auto flex items-center justify-center text-primary shadow-hard-sm border-2 border-primary/20">
              <GroupsIcon className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-bold text-ink uppercase tracking-wide">Versión 0.0.1 (Alpha)</p>
              <p className="text-xs text-ink/50 leading-relaxed font-medium">
                Un juego social de engaño y deducción impulsado por IA.
                Desarrollado con ❤️ por Bruno.
              </p>
            </div>
            <div className="pt-4 border-t border-ink/5 flex flex-col gap-2">
              <a href="https://github.com/ariasbruno/el-impostor" target="_blank" rel="noopener noreferrer" className="text-secondary font-bold text-[10px] uppercase tracking-widest hover:underline">Repositorio</a>
            </div>
            <Button
              variant="ghost"
              fullWidth
              onClick={onClose}
              className="bg-paper! text-ink/40 border-2 border-ink/5 shadow-none mt-4"
            >
              CERRAR
            </Button>
          </div>
        ) : (
          <>
            <p className="text-center text-sm font-bold text-ink/60 uppercase tracking-wide leading-relaxed">
              {type === 'delete' 
                ? 'ESTO BORRARÁ TUS PARTIDAS Y PERFIL PARA SIEMPRE. ESTA ACCIÓN NO SE PUEDE DESHACER.' 
                : 'SALDRÁS DE TU CUENTA ACTUAL. PODRÁS VOLVER A ENTRAR CUANDO QUIERAS.'}
            </p>
            
            <div className="flex flex-col gap-3">
              <Button
                variant={type === 'delete' ? 'danger' : 'primary'}
                fullWidth
                noOutline
                onClick={onConfirm}
              >
                SÍ, {type === 'delete' ? 'BORRAR TODO' : 'CONTINUAR'}
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                onClick={onClose}
                className="bg-paper! text-ink/40 border-2 border-ink/5 shadow-none"
              >
                VOLVER
              </Button>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};
