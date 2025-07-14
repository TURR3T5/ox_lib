import { NotificationProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugCustomNotification = () => {
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Success',
        description: 'Notification with duration indicator',
        type: 'success',
        id: 'success-with-duration',
        duration: 8000,
        showDuration: true,
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Error',
        description: 'Notification without duration indicator',
        type: 'error',
        duration: 5000,
        showDuration: false,
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Custom icon success',
        description: 'Short notification with countdown',
        type: 'success',
        icon: 'microchip',
        duration: 3000,
        showDuration: true,
      },
    },
  ]);
};