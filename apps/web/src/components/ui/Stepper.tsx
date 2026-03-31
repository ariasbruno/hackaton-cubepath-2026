import React from 'react';
import ArrowBackIcon from '../icons/arrow-back';
import CloseIcon from '../icons/close';

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onClose?: () => void;
}

export const Stepper: React.FC<StepperProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onClose,
}) => {
  return (
    <header className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack || onClose}
          className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-hard border-2 border-ink/5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          {onBack ? <ArrowBackIcon className="w-6 h-6" /> : <CloseIcon className="w-6 h-6" />}
        </button>
        <div className="flex gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-8 h-2 rounded-full transition-colors ${
                i < currentStep - 1 
                  ? 'bg-accent' 
                  : i === currentStep - 1 
                  ? 'bg-primary' 
                  : 'bg-ink/5'
              }`}
            />
          ))}
        </div>
        <span className="font-display text-primary text-lg">
          {currentStep}/{totalSteps}
        </span>
      </div>
    </header>
  );
};
