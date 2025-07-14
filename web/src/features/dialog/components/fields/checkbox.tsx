import React from 'react';
import { ICheckbox } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Props {
  row: ICheckbox;
  index: number;
  register: UseFormRegisterReturn;
}

const CheckboxField: React.FC<Props> = ({ row, index, register }) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={`checkbox-${index}`} defaultChecked={row.checked} disabled={row.disabled} {...register} />
      <Label
        htmlFor={`checkbox-${index}`}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {row.label}
      </Label>
    </div>
  );
};

export default CheckboxField;
