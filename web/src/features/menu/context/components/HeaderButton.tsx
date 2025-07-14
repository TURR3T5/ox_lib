import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';
import { cn } from '@/lib/utils';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  return (
    <button
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300',
        'bg-secondary/50 hover:bg-primary/20 border border-border',
        canClose === false && 'opacity-50 cursor-not-allowed',
        canClose !== false && 'hover:border-primary/50 hover:shadow-lg'
      )}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon
        icon={icon}
        className={cn('w-5 h-5', canClose === false ? 'text-muted-foreground' : 'text-primary')}
        fixedWidth
      />
    </button>
  );
};

export default HeaderButton;
