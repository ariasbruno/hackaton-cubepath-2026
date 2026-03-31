import React from 'react';
import { cn } from '../../utils/cn';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'purple' | 'yellow' | 'ghost' | 'paper';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  iconOnly?: boolean;
  noOutline?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  iconOnly = false,
  noOutline = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex justify-center items-center font-display rounded-btn shadow-hard transform transition-all active:translate-y-1 active:translate-x-1 active:shadow-none outline-none focus:ring-4 focus:ring-ink/20 uppercase tracking-wide';

  const variants = {
    primary: `bg-primary text-white ${noOutline ? '' : 'border-4 border-ink/5'} hover:bg-[#ff7a26]`,
    secondary: `bg-secondary text-white ${noOutline ? '' : 'border-4 border-ink/5'} hover:bg-[#348bd6]`,
    accent: `bg-accent text-white ${noOutline ? '' : 'border-4 border-ink/5'} hover:bg-[#72b37b]`,
    danger: `bg-danger text-white ${noOutline ? '' : 'border-4 border-ink/5'} hover:bg-[#d62836]`,
    purple: `bg-purple text-white ${noOutline ? '' : 'border-4 border-ink/5'} hover:bg-[#8534c7]`,
    yellow: `bg-yellow text-ink ${noOutline ? '' : 'border-4 border-ink/5'} hover:bg-[#edbc42]`,
    ghost: 'bg-white text-ink/40 border-2 border-ink/5 shadow-none hover:bg-paper',
    paper: 'bg-white text-ink border-4 border-ink shadow-hard-lg hover:bg-paper',
  };

  const sizes = {
    sm: 'text-sm px-4 py-2',
    md: 'text-lg px-6 py-3',
    lg: 'text-2xl px-10 py-4 shadow-hard-lg active:shadow-none',
    xl: 'text-3xl px-10 py-5 shadow-hard-lg active:shadow-none',
  };

  // Logic to allow overriding default padding provided by sizes
  const hasExternalPadding = className.includes('p-') || className.includes('px-') || className.includes('py-');
  let currentSizeClass = sizes[size];
  if (hasExternalPadding || iconOnly) {
    // Remove the internal padding classes (px-X py-Y) if external ones are provided
    currentSizeClass = currentSizeClass.replace(/\bp[xy]?-\d+\b/g, '').trim();
  }

  const iconOnlyStyles = iconOnly ? 'p-3' : '';
  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      className={cn(baseStyles, variants[variant], currentSizeClass, width, iconOnlyStyles, className)}
      {...props}
    >
      {children}
    </button>
  );
};
