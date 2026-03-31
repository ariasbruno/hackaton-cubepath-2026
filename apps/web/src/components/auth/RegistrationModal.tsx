import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface RegistrationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

import { AVATAR_IDS } from '@impostor/shared';
import InfoIcon from '../icons/info';

const COLORS = ['#FFD166', '#06D6A0', '#EF476F', '#118AB2', '#073B4C', '#8338EC', '#3A86FF', '#FB5607'];

export const RegistrationModal: React.FC<RegistrationModalProps> = ({ isOpen, onClose, onSuccess }) => {
	const { playerId, nickname, avatar, color, register } = useAuthStore();

	const [loading, setLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [setupName, setSetupName] = useState(nickname || '');
	const [setupAvatar, setSetupAvatar] = useState(avatar || 'noto--bear');
	const [setupColor, setSetupColor] = useState(color || '#FFD166');

	const handleFinalSetup = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!setupName.trim() || !playerId) return;

		setLoading(true);
		setErrorMsg('');
		try {
			await register(setupName.trim(), setupAvatar, setupColor);

			onSuccess?.();
			onClose();
		} catch (err: any) {
			let msg = err.message || 'Error al configurar perfil.';
			if (err.message === '[LOGIN_LIMIT]') {
				msg = 'Demasiados intentos. Espera unos minutos antes de registrarte.';
			}
			setErrorMsg(msg);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title="Completa tu Perfil"
		>
      <div className="mb-4 bg-secondary/10 p-3 rounded-xl border-2 border-secondary/20 flex gap-3 items-center">
        <InfoIcon className="w-4 h-4 text-secondary shrink-0" />
        <p className="text-[10px] font-bold uppercase tracking-tight text-secondary leading-tight">
          Necesitas registrar tu apodo antes de crear o unirte a salas públicas.
        </p>
      </div>

      <form onSubmit={handleFinalSetup} className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          <Avatar avatarId={setupAvatar} bgColor={setupColor} size="lg" className="shadow-hard" />

          <div className="w-full space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-1 text-center block">Nickname</label>
            <input
              type="text"
              value={setupName}
              onChange={(e) => setSetupName(e.target.value)}
              maxLength={20}
              required
              placeholder="Tu apodo..."
              className="w-full bg-paper border-2 border-ink p-3 rounded-btn font-display text-lg text-center focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all shadow-hard-sm"
            />
          </div>

          <div className="w-full space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-1 text-center block">Avatar</label>
            <div className="flex flex-wrap gap-2 justify-center p-2 bg-ink/5 rounded-2xl border-2 border-ink/5 max-h-32 overflow-y-auto no-scrollbar">
              {AVATAR_IDS.map(id => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSetupAvatar(id)}
                  className={`w-10 h-10 p-1 rounded-xl transition-all ${setupAvatar === id ? 'bg-white shadow-hard scale-110 border-2 border-ink' : 'hover:scale-105 active:scale-95 opacity-60 hover:opacity-100'}`}
                >
                  <Avatar avatarId={id} size="sm" bgColor="transparent" borderColor="border-transparent" />
                </button>
              ))}
            </div>
          </div>

          <div className="w-full space-y-1.5">
            <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink/40 ml-1 text-center block">Color</label>
            <div className="flex flex-wrap gap-2 justify-center p-2 bg-ink/5 rounded-2xl border-2 border-ink/5">
              {COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSetupColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${setupColor === c ? 'border-ink scale-110 shadow-hard' : 'border-white shadow-sm active:scale-95'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

				{errorMsg && (
					<div className="bg-danger/10 border-2 border-danger text-danger p-3 rounded-lg text-xs font-bold uppercase text-center">
						{errorMsg}
					</div>
				)}

				<Button type="submit" fullWidth size="lg" disabled={loading}>
					{loading ? 'Preparando...' : '¡Listo para jugar!'}
				</Button>
			</form>
		</Modal>
	);
};
