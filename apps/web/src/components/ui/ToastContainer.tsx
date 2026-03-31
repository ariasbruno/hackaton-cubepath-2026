import React from 'react';
import { useToastStore, type ToastType } from '../../store/useToastStore';
import CheckCircleIcon from '../icons/check-circle';
import ErrorIcon from '../icons/error';
import WarningIcon from '../icons/warning';
import InfoIcon from '../icons/info';
import CloseIcon from '../icons/close';

const typeConfig: Record<ToastType, { icon: React.FC<React.SVGProps<SVGSVGElement>>; bg: string; text: string; border: string }> = {
  success: { icon: CheckCircleIcon, bg: 'bg-accent-muted', text: 'text-accent', border: 'border-accent/20' },
  error: { icon: ErrorIcon, bg: 'bg-danger-muted', text: 'text-danger', border: 'border-danger/20' },
  warning: { icon: WarningIcon, bg: 'bg-yellow-muted', text: 'text-yellow', border: 'border-yellow/20' },
  info: { icon: InfoIcon, bg: 'bg-secondary-muted', text: 'text-secondary', border: 'border-secondary/20' },
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-[90%] sm:max-w-md pointer-events-none">
      {toasts.map((toast) => {
        const config = typeConfig[toast.type];
        return (
          <div
            key={toast.id}
            className={`
              ${config.bg} ${config.border} border-2 
              shadow-hard-lg rounded-card p-4
              flex items-start gap-3 pointer-events-auto
              animate-toast-in
              transition-all duration-300
            `}
          >
            <div className={`${config.text} mt-0.5`}>
              <config.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-ink font-bold text-sm leading-tight uppercase tracking-tight">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-ink/20 hover:text-ink/60 transition-colors"
            >
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
