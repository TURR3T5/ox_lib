import React from 'react';
import { ISlider } from '../../../../typings/dialog';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface Props {
  row: ISlider;
  index: number;
  control: Control<FormValues>;
}

const SliderField: React.FC<Props> = ({ row, index, control }) => {
  const controller = useController({
    name: `test.${index}.value`,
    control,
    defaultValue: row.default || row.min || 0,
  });

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{row.label}</Label>

      <div className="space-y-3">
        <Slider
          value={[controller.field.value]}
          onValueChange={(value) => controller.field.onChange(value[0])}
          min={row.min || 0}
          max={row.max || 100}
          step={row.step || 1}
          disabled={row.disabled}
          className="w-full"
        />

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{row.min || 0}</span>
          <span className="font-medium">{controller.field.value}</span>
          <span>{row.max || 100}</span>
        </div>
      </div>
    </div>
  );
};

export default SliderField;
