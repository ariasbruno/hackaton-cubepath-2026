import React from 'react';
import { Modal } from '../ui/Modal';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { AVATAR_IDS } from '@impostor/shared';

const COLORS = ['#FFD166', '#06D6A0', '#EF476F', '#118AB2', '#073B4C', '#8338EC', '#3A86FF', '#FB5607'];

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  editName: string;
  setEditName: (val: string) => void;
  editAvatar: string;
  setEditAvatar: (val: string) => void;
  editColor: string;
  setEditColor: (val: string) => void;
  isLoading: boolean;
  errorText: string | null;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editName,
  setEditName,
  editAvatar,
  setEditAvatar,
  editColor,
  setEditColor,
  isLoading,
  errorText,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title="Editar Perfil" />
      <Modal.Body className="space-y-6">
        <div className="flex justify-center mb-4">
          <Avatar avatarId={editAvatar} bgColor={editColor} size="xl" />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40 ml-1">Nickname</label>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            maxLength={20}
            placeholder="Tu nombre..."
            className="w-full bg-paper border-2 border-ink/5 p-4 rounded-btn font-bold text-lg focus:outline-none focus:border-primary transition-colors shadow-inner-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40 ml-1">Avatar</label>
          <div className="flex flex-wrap gap-2 justify-center p-2 bg-ink/5 rounded-btn max-h-48 overflow-y-auto no-scrollbar">
            {AVATAR_IDS.map(id => (
              <button
                key={id}
                onClick={() => setEditAvatar(id)}
                className={`w-12 h-12 p-1 rounded-btn transition-all ${editAvatar === id ? 'bg-primary shadow-hard-sm scale-110' : 'hover:bg-ink/5'}`}
              >
                <Avatar avatarId={id} size="sm" bgColor="transparent" borderColor="border-transparent" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-ink/40 ml-1">Color de Fondo</label>
          <div className="flex flex-wrap gap-3 justify-center p-2 bg-ink/5 rounded-btn">
            {COLORS.map(c => (
              <button
                key={c}
                onClick={() => setEditColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${editColor === c ? 'border-primary scale-110 shadow-hard-sm' : 'border-white hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {errorText && (
          <div className="bg-danger/10 border-2 border-danger/20 p-3 rounded-btn text-danger text-[10px] font-bold uppercase tracking-widest text-center">
            {errorText}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button fullWidth onClick={onSave} disabled={isLoading || !editName.trim()}>
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        <Button variant="ghost" fullWidth onClick={onClose}>
          Cancelar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
