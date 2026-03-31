import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, label, fullWidth = false, ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`flex flex-col gap-2 ${widthClass}`}>
        {label && <label className="font-display text-lg text-ink">{label}</label>}
        <input
          ref={ref}
          className={`
            bg-white font-body text-lg text-ink placeholder-ink-muted
            border-4 border-ink/5 rounded-btn px-4 py-3
            shadow-inner-hard outline-none focus:ring-4 focus:ring-primary/30 transition-shadow
            ${error ? 'border-danger' : ''}
            ${className}
          `}
          {...props}
        />
        {error && <span className="text-danger font-body text-sm font-bold">{error}</span>}
      </div>
    );
  }
);
Input.displayName = 'Input';
