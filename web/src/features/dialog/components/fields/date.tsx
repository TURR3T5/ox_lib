import React from 'react';
import { IDateInput } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  row: IDateInput;
  index: number;
  control: Control<FormValues>;
}

const DateField: React.FC<Props> = ({ row, index, control }) => {
  const controller = useController({
    name: `test.${index}.value`,
    control,
    rules: { required: row.required, min: row.min, max: row.max },
  });

  const formatDateForInput = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    controller.field.onChange(date.getTime());
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor={`date-${index}`}
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
          id={`date-${index}`}
          type={row.type === 'date-range' ? 'date' : 'date'}
          value={formatDateForInput(controller.field.value)}
          onChange={handleDateChange}
          onBlur={controller.field.onBlur}
          disabled={row.disabled}
          min={row.min ? formatDateForInput(new Date(row.min).getTime()) : undefined}
          max={row.max ? formatDateForInput(new Date(row.max).getTime()) : undefined}
          className={cn(row.icon && 'pl-10')}
        />
      </div>
    </div>
  );
};

export default DateField;
