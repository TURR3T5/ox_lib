import { TimeInput } from '@mantine/dates';
import { Control, useController } from 'react-hook-form';
import { ITimeInput } from '../../../../typings/dialog';
import { FormValues } from '../../InputDialog';
import LibIcon from '../../../../components/LibIcon';

interface Props {
  row: ITimeInput;
  index: number;
  control: Control<FormValues>;
}

const TimeField: React.FC<Props> = (props) => {
  const controller = useController({
    name: `test.${props.index}.value`,
    control: props.control,
    rules: { required: props.row.required },
  });

  const getTimeString = (): string => {
    if (!controller.field.value) return '';

    const date = new Date(controller.field.value);
    if (isNaN(date.getTime())) return '';

    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <TimeInput
      value={getTimeString()}
      name={controller.field.name}
      ref={controller.field.ref}
      onBlur={controller.field.onBlur}
      onChange={(event) => {
        const timeString = event.currentTarget.value;
        if (!timeString) {
          controller.field.onChange(null);
          return;
        }

        try {
          const today = new Date();
          const [hours, minutes] = timeString.split(':').map(Number);

          if (!isNaN(hours) && !isNaN(minutes)) {
            today.setHours(hours, minutes, 0, 0);
            controller.field.onChange(today.getTime());
          } else {
            controller.field.onChange(null);
          }
        } catch (err) {
          controller.field.onChange(null);
        }
      }}
      label={props.row.label}
      description={props.row.description}
      disabled={props.row.disabled}
      withAsterisk={props.row.required}
      leftSection={props.row.icon && <LibIcon fixedWidth icon={props.row.icon} />}
    />
  );
};

export default TimeField;
