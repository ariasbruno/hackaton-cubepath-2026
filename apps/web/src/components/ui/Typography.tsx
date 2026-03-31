import React from 'react';

export const Typography: React.FC<{
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'mono';
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}> = ({ variant = 'body', as, children, className = '' }) => {
  const variants = {
    h1: 'font-display text-5xl md:text-7xl font-bold tracking-tight',
    h2: 'font-display text-4xl font-bold',
    h3: 'font-display text-2xl font-bold',
    h4: 'font-display text-xl font-bold',
    body: 'font-body text-base md:text-lg',
    'body-sm': 'font-body text-sm text-ink-muted',
    mono: 'font-mono text-xl tracking-widest',
  };

  const Component = as || (variant.startsWith('h') ? variant : 'p') as React.ElementType;

  return (
    <Component className={`${variants[variant]} ${className}`}>
      {children}
    </Component>
  );
};

export const Heading = (props: React.ComponentProps<typeof Typography>) => (
  <Typography variant="h2" {...props} />
);

export const Text = (props: React.ComponentProps<typeof Typography>) => (
  <Typography variant="body" {...props} />
);
