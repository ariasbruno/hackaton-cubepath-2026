import React from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showNav = true,
  className = '',
}) => {
  return (
    // flex-1: takes remaining width after SideNav on desktop
    <div
      className={`flex-1 flex flex-col h-dvh bg-paper overflow-hidden pattern-dots ${className}`}
    >
      {/* No max-width here — pages own their own layout constraints */}
      <div
        className={`flex-1 flex flex-col min-h-0 overflow-hidden w-full ${
          showNav ? 'pb-28 md:pb-0' : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
};
