import { MultiSelect, Select } from '@mantine/core';
import { ISelect } from '../../../../typings';
import { Control, useController } from 'react-hook-form';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';
import { useEffect, useMemo } from 'react';

interface Props {
  row: ISelect;
  index: number;
  control: Control<FormValues>;
}

const SelectField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });

  const uniqueData = useMemo(() => {
    return props.row.options.map((option, idx) => ({
      ...option,
      uniqueId: `${option.value}_${idx}`,
      label: option.label || '',
    }));
  }, [props.row.options]);

  const actualToUnique = useMemo(() => {
    const map = new Map();
    uniqueData.forEach((item) => {
      if (Array.isArray(map.get(item.value))) {
        map.get(item.value).push(item.uniqueId);
      } else {
        map.set(item.value, [item.uniqueId]);
      }
    });
    return map;
  }, [uniqueData]);

  const uniqueToActual = useMemo(() => {
    const map = new Map();
    uniqueData.forEach((item) => {
      map.set(item.uniqueId, item.value);
    });
    return map;
  }, [uniqueData]);

  const uniqueValue = useMemo(() => {
    if (!controller.field.value) return controller.field.value;

    if (Array.isArray(controller.field.value)) {
      return controller.field.value.flatMap((val) => actualToUnique.get(val) || []);
    } else {
      return actualToUnique.get(controller.field.value)?.[0] || null;
    }
  }, [controller.field.value, actualToUnique]);

  const handleChange = (value: string | string[] | null) => {
    if (Array.isArray(value)) {
      const actualValues: (string | undefined)[] = value.map((v) => uniqueToActual.get(v));
      controller.field.onChange(actualValues);
    } else if (value) {
      const actualValue: string | undefined = uniqueToActual.get(value);
      controller.field.onChange(actualValue);
    } else {
      controller.field.onChange(value);
    }
  };

  return (
    <>
      {props.row.type === 'select' ? (
        <Select
          data={uniqueData.map((item) => ({
            value: item.uniqueId,
            label: item.label,
          }))}
          value={uniqueValue}
          name={controller.field.name}
          ref={controller.field.ref}
          onBlur={controller.field.onBlur}
          onChange={handleChange}
          disabled={props.row.disabled}
          label={props.row.label}
          description={props.row.description}
          withAsterisk={props.row.required}
          clearable={props.row.clearable}
          allowDeselect={false}
          searchable={props.row.searchable}
          leftSection={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
        />
      ) : (
        <>
          {props.row.type === 'multi-select' && (
            <MultiSelect
              data={uniqueData.map((item) => ({
                value: item.uniqueId,
                label: item.label,
              }))}
              value={uniqueValue}
              name={controller.field.name}
              ref={controller.field.ref}
              onBlur={controller.field.onBlur}
              onChange={handleChange}
              disabled={props.row.disabled}
              label={props.row.label}
              description={props.row.description}
              withAsterisk={props.row.required}
              clearable={props.row.clearable}
              searchable={props.row.searchable}
              maxValues={props.row.maxSelectedValues}
              leftSection={props.row.icon && <LibIcon icon={props.row.icon} fixedWidth />}
            />
          )}
        </>
      )}
    </>
  );
};

export default SelectField;
