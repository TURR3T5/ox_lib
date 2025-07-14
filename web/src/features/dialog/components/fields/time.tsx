import React from 'react';
import { Control, useController } from 'react-hook-form';
import { ITimeInput } from '../../../../typings/dialog';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  row: ITimeInput;
  index: number;
  control: Control<FormValues>;
}

const TimeField: React.FC<Props> = ({ row, index, control }) => {
  const controller = useController({
    name: `test.${index}.value`,
    control,
    rules: { required: row.required },
  });

  const formatTimeForInput = (timestamp: number) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toTimeString().slice(0, 5);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    controller.field.onChange(date.getTime());
  };

  return (
    <div className="space-y-2">
      <Label
        htmlFor={`time-${index}`}
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
          id={`time-${index}`}
          type="time"
          value={formatTimeForInput(controller.field.value)}
          onChange={handleTimeChange}
          onBlur={controller.field.onBlur}
          disabled={row.disabled}
          className={cn(row.icon && 'pl-10')}
        />
      </div>
    </div>
  );
};

export default TimeField;
