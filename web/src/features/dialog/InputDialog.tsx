import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { useLocales } from '../../providers/LocaleProvider';
import { fetchNui } from '../../utils/fetchNui';
import type { InputProps, OptionValue } from '../../typings';
import InputField from './components/fields/input';
import CheckboxField from './components/fields/checkbox';
import SelectField from './components/fields/select';
import NumberField from './components/fields/number';
import SliderField from './components/fields/slider';
import { useFieldArray, useForm } from 'react-hook-form';
import ColorField from './components/fields/color';
import DateField from './components/fields/date';
import TextareaField from './components/fields/textarea';
import TimeField from './components/fields/time';
import dayjs from 'dayjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LibIcon from '../../components/LibIcon';

export type FormValues = {
  test: {
    value: any;
  }[];
};

const InputDialog: React.FC = () => {
  const [fields, setFields] = React.useState<InputProps>({
    heading: '',
    rows: [{ type: 'input', label: '' }],
  });
  const [visible, setVisible] = React.useState(false);
  const { locale } = useLocales();

  const form = useForm<{ test: { value: any }[] }>({});
  const fieldForm = useFieldArray({
    control: form.control,
    name: 'test',
  });

  useNuiEvent<InputProps>('openDialog', (data) => {
    setFields(data);
    setVisible(true);
    data.rows.forEach((row, index) => {
      let value;

      if (row.type === 'checkbox') {
        value = row.checked;
      } else if (row.type === 'date' || row.type === 'date-range' || row.type === 'time') {
        if (row.default === true) {
          value = new Date().getTime();
        } else if (Array.isArray(row.default)) {
          value = row.default.map((date) => new Date(date).getTime());
        } else if (row.default) {
          value = new Date(row.default).getTime();
        } else {
          value = null;
        }
      } else {
        value = row.default;
      }

      fieldForm.insert(index, { value: value ?? null });

      if ((row.type === 'select' || row.type === 'multi-select') && row.options) {
        row.options = row.options.map((option) =>
          typeof option === 'string'
            ? { value: option, label: option }
            : option.label
            ? option
            : { ...option, label: option.value }
        ) as Array<OptionValue>;
      }
    });
  });

  useNuiEvent('closeInputDialog', async () => await handleClose(true));

  const handleClose = async (dontPost?: boolean) => {
    setVisible(false);
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    if (dontPost) return;
    fetchNui('inputData');
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setVisible(false);
    const values: any[] = [];
    for (let i = 0; i < fields.rows.length; i++) {
      const row = fields.rows[i];
      if ((row.type === 'date' || row.type === 'date-range') && row.returnString) {
        if (data.test[i]?.value) {
          data.test[i].value = dayjs(data.test[i].value).format(row.format || 'DD/MM/YYYY');
        }
      }
    }
    Object.values(data.test).forEach((obj: { value: any }) => values.push(obj.value));
    await new Promise((resolve) => setTimeout(resolve, 200));
    form.reset();
    fieldForm.remove();
    fetchNui('inputData', values);
  });

  return (
    <Dialog open={visible} onOpenChange={() => handleClose()}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-3 pb-2">
          <DialogTitle className="flex items-center gap-3">
            <LibIcon icon="keyboard" className="w-6 h-6 text-primary" />
            {fields.heading}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {fieldForm.fields.map((item, index) => {
              const row = fields.rows[index];
              return (
                <div key={item.id} className="gaming-card rounded-lg p-3">
                  {row.type === 'input' && (
                    <InputField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {row.type === 'checkbox' && (
                    <CheckboxField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                  {(row.type === 'select' || row.type === 'multi-select') && (
                    <SelectField row={row} index={index} control={form.control} />
                  )}
                  {row.type === 'number' && <NumberField control={form.control} row={row} index={index} />}
                  {row.type === 'slider' && <SliderField control={form.control} row={row} index={index} />}
                  {row.type === 'color' && <ColorField control={form.control} row={row} index={index} />}
                  {row.type === 'time' && <TimeField control={form.control} row={row} index={index} />}
                  {(row.type === 'date' || row.type === 'date-range') && (
                    <DateField control={form.control} row={row} index={index} />
                  )}
                  {row.type === 'textarea' && (
                    <TextareaField
                      register={form.register(`test.${index}.value`, { required: row.required })}
                      row={row}
                      index={index}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose()}
              disabled={fields.options?.allowCancel === false}
              className="flex items-center gap-2"
            >
              <LibIcon icon="xmark" className="w-4 h-4" />
              {locale.ui.cancel}
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <LibIcon icon="check" className="w-4 h-4" />
              {locale.ui.confirm}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InputDialog;
