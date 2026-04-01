import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import CategoryIcon from '../icons/category';
import SportsEsportsIcon from '../icons/sports-esports';
import GroupsIcon from '../icons/groups';
import TimerIcon from '../icons/timer';
import VisibilityIcon from '../icons/visibility';
import VisibilityOffIcon from '../icons/visibility-off';

interface RoomSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomName: string;
  gameMode: string | null;
  maxPlayers: number;
  clueTime: number;
  discussionTime: number;
  votingTime: number;
  isPrivate: boolean;
  onConfirm: () => void;
  loading: boolean;
}

export const RoomSummaryModal: React.FC<RoomSummaryModalProps> = ({
  isOpen, onClose, roomName, gameMode, maxPlayers,
  clueTime, discussionTime, votingTime, isPrivate,
  onConfirm, loading
}) => {
  const modeColor = gameMode === 'CERCANAS' ? 'secondary' : gameMode === 'CAOS' ? 'purple' : 'primary';

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Header title="Resumen de Sala" />
      <Modal.Body className="mb-8">
        <div className="space-y-3">
          {[
            { label: 'Nombre', value: roomName.toUpperCase(), icon: CategoryIcon },
            { label: 'Modo', value: gameMode || '', highlight: true, icon: SportsEsportsIcon },
            { label: 'Jugadores', value: `Máximo ${maxPlayers}`, icon: GroupsIcon },
            { label: 'Tiempos', value: `${clueTime}s / ${discussionTime}s / ${votingTime}s`, icon: TimerIcon },
            { label: 'Visibilidad', value: isPrivate ? 'Privada (Oculta)' : 'Pública', icon: isPrivate ? VisibilityOffIcon : VisibilityIcon },
          ].map((row, i, arr) => (
            <div 
              key={row.label} 
              className={`flex items-center justify-between p-3 rounded-xl ${i < arr.length - 1 ? 'border-b border-dashed border-ink/10' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg bg-paper border border-ink/5 shadow-hard-sm flex items-center justify-center ${row.highlight ? `text-${modeColor}` : 'text-ink/40'}`}>
                  <row.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-extrabold uppercase opacity-40">{row.label}</span>
              </div>
              <span className={`text-xs font-bold uppercase tracking-tight ${row.highlight ? `text-${modeColor}` : 'text-ink'}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button 
          fullWidth 
          onClick={onConfirm} 
          disabled={loading} 
          noOutline
          className="shadow-hard active:translate-y-px active:shadow-none transition-all"
        >
          {loading ? 'Creando...' : 'Confirmar y Crear'}
        </Button>
        <Button variant="ghost" fullWidth onClick={onClose} className="font-bold uppercase text-[10px] tracking-widest opacity-60">
          Cambiar algo
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
