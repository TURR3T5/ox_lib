import React from 'react';
import { ISelect } from '../../../../typings';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import ReactSelect from 'react-select';

interface Props {
  row: ISelect;
  index: number;
  control: Control<FormValues>;
}

const SelectField: React.FC<Props> = ({ row, index, control }) => {
  const controller = useController({
    name: `test.${index}.value`,
    control,
    rules: { required: row.required },
  });

  const options = row.options.map((opt) => ({
    value: opt.value,
    label: opt.label || opt.value,
  }));

  if (row.type === 'multi-select') {
    return (
      <div className="space-y-2">
        <Label className={cn(row.required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>{row.label}</Label>

        {row.description && <p className="text-sm text-muted-foreground">{row.description}</p>}

        <ReactSelect
          isMulti
          options={options}
          value={options.filter((opt) => controller.field.value?.includes(opt.value))}
          onChange={(selected) => controller.field.onChange(selected ? selected.map((s) => s.value) : [])}
          isDisabled={row.disabled}
          isClearable={row.clearable}
          isSearchable={row.searchable}
          placeholder="Select options..."
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            control: (base) => ({
              ...base,
              minHeight: '40px',
              borderColor: 'hsl(var(--border))',
              backgroundColor: 'hsl(var(--background))',
              '&:hover': {
                borderColor: 'hsl(var(--border))',
              },
              '&:focus-within': {
                borderColor: 'hsl(var(--ring))',
                boxShadow: '0 0 0 2px hsl(var(--ring) / 0.2)',
              },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused
                ? 'hsl(var(--accent))'
                : state.isSelected
                ? 'hsl(var(--primary))'
                : 'transparent',
              color: state.isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
              '&:hover': {
                backgroundColor: 'hsl(var(--accent))',
              },
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: 'hsl(var(--secondary))',
              color: 'hsl(var(--secondary-foreground))',
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: 'hsl(var(--secondary-foreground))',
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: 'hsl(var(--secondary-foreground))',
              '&:hover': {
                backgroundColor: 'hsl(var(--destructive))',
                color: 'hsl(var(--destructive-foreground))',
              },
            }),
          }}
          maxMenuHeight={200}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className={cn(row.required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>{row.label}</Label>

      {row.description && <p className="text-sm text-muted-foreground">{row.description}</p>}

      <Select value={controller.field.value} onValueChange={controller.field.onChange} disabled={row.disabled}>
        <SelectTrigger className={cn(row.icon && 'pl-10')}>
          {row.icon && (
            <div className="absolute left-3 h-4 w-4 text-muted-foreground flex items-center justify-center">
              <LibIcon icon={row.icon} fixedWidth />
            </div>
          )}
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
