import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../../components/LibIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Props {
  icon: IconProp;
  canClose?: boolean;
  iconSize: number;
  handleClick: () => void;
}

const HeaderButton: React.FC<Props> = ({ icon, canClose, iconSize, handleClick }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn('flex-shrink-0 h-10 w-10 p-0', canClose === false && 'opacity-50 cursor-not-allowed')}
      disabled={canClose === false}
      onClick={handleClick}
    >
      <LibIcon
        icon={icon}
        className={cn('w-4 h-4', canClose === false ? 'text-muted-foreground' : 'text-foreground')}
        fixedWidth
      />
    </Button>
  );
};

export default HeaderButton;
