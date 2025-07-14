import React from 'react';
import { IColorInput } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  row: IColorInput;
  index: number;
  control: Control<FormValues>;
}

const ColorField: React.FC<Props> = ({ row, index, control }) => {
  const controller = useController({
    name: `test.${index}.value`,
    control,
    defaultValue: row.default,
    rules: { required: row.required },
  });

  return (
    <div className="space-y-2">
      <Label
        htmlFor={`color-${index}`}
        className={cn(row.required && "after:content-['*'] after:ml-0.5 after:text-red-500")}
      >
        {row.label}
      </Label>

      {row.description && <p className="text-sm text-muted-foreground">{row.description}</p>}

      <div className="flex space-x-2">
        <input
          type="color"
          value={controller.field.value || '#000000'}
          onChange={controller.field.onChange}
          onBlur={controller.field.onBlur}
          disabled={row.disabled}
          className="h-10 w-16 rounded-md border border-input bg-background"
        />

        <div className="relative flex-1">
          {row.icon && (
            <div className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground flex items-center justify-center">
              <LibIcon icon={row.icon} fixedWidth />
            </div>
          )}

          <Input
            id={`color-${index}`}
            value={controller.field.value || ''}
            onChange={controller.field.onChange}
            onBlur={controller.field.onBlur}
            disabled={row.disabled}
            placeholder="#000000"
            className={cn(row.icon && 'pl-10')}
          />
        </div>
      </div>
    </div>
  );
};

export default ColorField;
