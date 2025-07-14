import React from 'react';
import { INumber } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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

  const increment = () => {
    const current = controller.field.value || 0;
    const step = row.step || 1;
    const newValue = current + step;
    if (!row.max || newValue <= row.max) {
      controller.field.onChange(newValue);
    }
  };

  const decrement = () => {
    const current = controller.field.value || 0;
    const step = row.step || 1;
    const newValue = current - step;
    if (!row.min || newValue >= row.min) {
      controller.field.onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor={`number-${index}`}
        className={cn(row.required && "after:content-['*'] after:ml-0.5 after:text-red-500")}
      >
        {row.label}
      </Label>

      {row.description && <p className="text-sm text-muted-foreground">{row.description}</p>}

      <div className="relative flex">
        {row.icon && (
          <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground flex items-center justify-center z-10">
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
          className={cn(row.icon && 'pl-10', 'pr-16 rounded-r-none')}
        />

        <div className="flex flex-col border border-l-0 border-input rounded-r-lg overflow-hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={increment}
            disabled={row.disabled || (row.max !== undefined && (controller.field.value || 0) >= row.max)}
            className="h-5 w-10 p-0 rounded-none hover:bg-primary/10 border-b border-border"
          >
            <LibIcon icon="chevron-up" className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={decrement}
            disabled={row.disabled || (row.min !== undefined && (controller.field.value || 0) <= row.min)}
            className="h-5 w-10 p-0 rounded-none hover:bg-primary/10"
          >
            <LibIcon icon="chevron-down" className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NumberField;
