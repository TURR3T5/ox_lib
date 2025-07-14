import React from 'react';
import { IInput } from '../../../../typings/dialog';
import { UseFormRegisterReturn } from 'react-hook-form';
import LibIcon from '../../../../components/LibIcon';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  register: UseFormRegisterReturn;
  row: IInput;
  index: number;
}

const InputField: React.FC<Props> = ({ register, row, index }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="space-y-2">
      <Label
        htmlFor={`input-${index}`}
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
          id={`input-${index}`}
          type={row.password && !showPassword ? 'password' : 'text'}
          placeholder={row.placeholder}
          defaultValue={row.default}
          disabled={row.disabled}
          minLength={row.min}
          maxLength={row.max}
          className={cn(row.icon && 'pl-10', row.password && 'pr-10')}
          {...register}
        />

        {row.password && (
          <button
            type="button"
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors z-10 flex items-center justify-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
