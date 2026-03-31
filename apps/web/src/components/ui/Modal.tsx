import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/40 z-100 flex items-start justify-center p-6 overflow-y-auto animate-fade-in"
    >
      <div className="bg-white w-full max-w-sm rounded-card shadow-hard-lg p-8 animate-bounce-in relative my-auto">
        {title && (
          <h3 className="font-display text-2xl text-ink uppercase mb-6 text-center">
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
};
