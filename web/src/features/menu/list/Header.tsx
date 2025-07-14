import React from 'react';
import { cn } from '@/lib/utils';

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="bg-background border border-border rounded-t-md h-15 flex items-center justify-center">
      <h2 className="text-lg font-medium uppercase tracking-wide">{title}</h2>
    </div>
  );
};

export default React.memo(Header);
