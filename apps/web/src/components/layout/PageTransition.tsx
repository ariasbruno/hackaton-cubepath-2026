import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-premium' | 'slide-up' | 'fade';
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  animation = 'fade-premium'
}) => {
  const animationClass =
    animation === 'fade-premium' ? 'animate-page-enter' :
      animation === 'slide-up' ? 'animate-slide-in-bottom' :
        'animate-fade-in';

  return (
    <div className={`w-full flex-1 flex flex-col min-h-0 relative ${animationClass} ${className}`}>
      {children}
    </div>
  );
};
