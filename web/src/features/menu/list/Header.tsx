import React from 'react';

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="gaming-card rounded-b-none rounded-t-lg border-b-0 h-16 flex items-center justify-center">
      <h2 className="text-lg font-bold uppercase tracking-wider text-white">{title}</h2>
    </div>
  );
};

export default React.memo(Header);
