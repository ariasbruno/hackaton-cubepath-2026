import React from 'react';
import ArrowBackIcon from '../icons/arrow-back';

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  onBack,
  rightAction,
  className = '',
}) => {
  return (
    <header className={`py-4.5 px-6 flex items-center justify-between z-20 ${className}`}>
      {onBack ? (
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-hard border-2 border-ink/5 active:translate-y-0.5 active:shadow-none transition-all"
        >
          <ArrowBackIcon className="w-5 h-5" />
        </button>
      ) : (
        <div className="w-10" />
      )}
      <h1 className="font-display text-xl text-ink uppercase tracking-tight">
        {title}
      </h1>
      {rightAction || <div className="w-10" />}
    </header>
  );
};
