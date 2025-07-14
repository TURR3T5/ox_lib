import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';

const CustomCheckbox: React.FC<{ checked: boolean }> = ({ checked }) => {
  return (
    <Checkbox
      checked={checked}
      className="data-[state=checked]:bg-muted-foreground data-[state=checked]:border-muted-foreground"
    />
  );
};

export default CustomCheckbox;
