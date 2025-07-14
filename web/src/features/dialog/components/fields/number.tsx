import React from 'react';
import { INumber } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  row: INumber;
  index: number;
  control: Control<FormValues>;
}

const NumberField: React.FC<Props> = ({ row, index, control }) => {
  const controller = useController({
    name: `test.${index}.value`,
    control,
    defaultValue: row.default,
    rules: { required: row.required, min: row.min, max: row.max },
  });

  return (
    <div className="space-y-2">
      <Label
        htmlFor={`number-${index}`}
        className={cn(row.required && "after:content-['*'] after:ml-0.5 after:text-red-500")}
      >
        {row.label}
      </Label>

      {row.description && <p className="text-sm text-muted-foreground">{row.description}</p>}

      <div className="relative">
        {row.icon && (
          <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground flex items-center justify-center">
            <LibIcon icon={row.icon} fixedWidth />
          </div>
        )}

        <Input
          id={`number-${index}`}
          type="number"
          value={controller.field.value || ''}
          onChange={(e) => controller.field.onChange(parseFloat(e.target.value) || null)}
          onBlur={controller.field.onBlur}
          disabled={row.disabled}
          min={row.min}
          max={row.max}
          step={row.step}
          className={cn(row.icon && 'pl-10')}
        />
      </div>
    </div>
  );
};

export default NumberField;
