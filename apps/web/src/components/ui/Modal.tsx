import React, { useEffect, useRef, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import CloseIcon from '../icons/close';

interface ModalContextProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal components must be used within a <Modal />');
  return context;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> & {
  Header: React.FC<{ title: string; showClose?: boolean }>;
  Body: React.FC<{ children: React.ReactNode; className?: string }>;
  Footer: React.FC<{ children: React.ReactNode; className?: string }>;
} = ({ isOpen, onClose, children }) => {
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
    <ModalContext.Provider value={{ isOpen, onClose }}>
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="fixed inset-0 bg-black/40 z-100 flex items-start justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in backdrop-blur-sm"
      >
        <div className="bg-white w-full max-w-sm rounded-card shadow-hard-lg p-6 sm:p-8 animate-bounce-in relative my-auto border-4 border-ink">
          {children}
        </div>
      </div>
    </ModalContext.Provider>,
    document.getElementById('modal-root') || document.body
  );
};

Modal.Header = ({ title, showClose = true }) => {
  const { onClose } = useModalContext();
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-display text-2xl text-ink uppercase text-center w-full">
        {title}
      </h3>
      {showClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-ink hover:scale-110 transition-transform p-2 bg-paper rounded-full border-2 border-ink/5"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

Modal.Body = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>{children}</div>
);

Modal.Footer = ({ children, className = '' }) => (
  <div className={`flex flex-col gap-3 mt-6 ${className}`}>{children}</div>
);
