import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { ITextarea } from '../../../../typings/dialog';
import LibIcon from '../../../../components/LibIcon';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface Props {
  register: UseFormRegisterReturn;
  row: ITextarea;
  index: number;
}

const TextareaField: React.FC<Props> = ({ register, row, index }) => {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={`textarea-${index}`}
        className={cn(row.required && "after:content-['*'] after:ml-0.5 after:text-red-500")}
      >
        {row.label}
      </Label>

      {row.description && <p className="text-sm text-muted-foreground">{row.description}</p>}

      <div className="relative">
        {row.icon && (
          <div className="absolute left-3 top-3 h-4 w-4 text-muted-foreground flex items-center justify-center">
            <LibIcon icon={row.icon} fixedWidth />
          </div>
        )}

        <Textarea
          id={`textarea-${index}`}
          placeholder={row.placeholder}
          defaultValue={row.default}
          disabled={row.disabled}
          className={cn(row.icon && 'pl-10', row.autosize && 'resize-none')}
          rows={row.min || 3}
          {...register}
        />
      </div>
    </div>
  );
};

export default TextareaField;
