import React from 'react';
import { Card } from '../ui/Card';

interface SettingsGroupProps {
  title: string;
  children: React.ReactNode;
}

export const SettingsGroup: React.FC<SettingsGroupProps> = ({ title, children }) => (
  <section className="space-y-3">
    <h3 className="font-display text-lg uppercase tracking-tight text-ink/40 ml-1">
      {title}
    </h3>
    <Card variant="paper" borderWidth="thin" className="p-0! divide-y divide-ink/5">
      {children}
    </Card>
  </section>
);
