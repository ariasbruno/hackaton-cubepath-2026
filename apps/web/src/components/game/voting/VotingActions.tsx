import React from 'react';
import CheckCircleIcon from '../../icons/check-circle';
import LinkIcon from '../../icons/link';
import FingerprintIcon from '../../icons/fingerprint';

interface VotingActionsProps {
  onConfirmVote: () => void;
  onSkip: () => void;
  needsConfirmation: boolean;
  hasVoted: boolean;
  selectedTargets: string[];
  maxTargets: number;
  serverVotedFor: string | null | undefined;
  mode: 'LINK' | 'ACCUSE' | 'VOTE';
}

export const VotingActions: React.FC<VotingActionsProps> = ({
  onConfirmVote,
  onSkip,
  needsConfirmation,
  hasVoted,
  selectedTargets,
  maxTargets,
  serverVotedFor,
  mode
}) => {
  const isLink = mode === 'LINK';
  const hasSelectedEnough = selectedTargets.length === maxTargets;
  const activeColor = isLink ? 'bg-secondary' : 'bg-danger';

  return (
    <footer className="p-6 bg-white border-t border-ink/5 shadow-[0_-4px_20px_rgba(43,45,66,0.05)] rounded-t-[32px] space-y-4 z-20 sticky bottom-0">
      <button
        onClick={onConfirmVote}
        disabled={!hasSelectedEnough || !needsConfirmation}
        className={`w-full flex items-center justify-center gap-3 ${activeColor} text-white font-display text-2xl py-5 rounded-btn shadow-hard-lg transition-all uppercase tracking-widest text-center disabled:opacity-30 disabled:shadow-none active:translate-y-1 active:shadow-none`}
      >
        {needsConfirmation
          ? (hasVoted ? 'Confirmar Cambio' : (isLink ? 'Vincular' : 'Acusar'))
          : 'Voto Confirmado'}
        {needsConfirmation ? (isLink ? <LinkIcon className="w-6 h-6" /> : <FingerprintIcon className="w-6 h-6" />) : <CheckCircleIcon className="w-6 h-6" />}
      </button>

      <button
        onClick={onSkip}
        disabled={!needsConfirmation && serverVotedFor === null && hasVoted}
        className={`w-full flex items-center justify-center gap-2 font-display py-4 rounded-btn shadow-hard transition-all text-center uppercase tracking-widest active:translate-y-1 disabled:opacity-50 disabled:shadow-none ${(!needsConfirmation && serverVotedFor === null && hasVoted)
            ? 'bg-accent/10 border-2 border-accent text-accent'
            : 'bg-white border-2 border-ink/10 text-ink/40'
          }`}
      >
        {(!needsConfirmation && serverVotedFor === null && hasVoted) && <CheckCircleIcon className="w-4 h-4" />}
        Saltar Voto
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${(!needsConfirmation && serverVotedFor === null && hasVoted)
            ? 'bg-accent text-white border-accent'
            : 'bg-accent-muted text-accent border-accent/10'
          }`}>
          {(!needsConfirmation && serverVotedFor === null && hasVoted) ? 'CONFIRMADO' : (hasVoted ? 'CAMBIAR A SALTAR' : '+5 PTS')}
        </span>
      </button>
    </footer>
  );
};
