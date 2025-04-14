import { NotificationProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugCustomNotification = () => {
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Success',
        description: 'Notification description',
        type: 'success',
        id: 'pogchamp',
        duration: 20000,
        style: {
          '.description': {
            color: 'red',
          },
        },
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Error',
        description: 'Notification description',
        type: 'error',
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Custom icon success',
        description: 'Notification description',
        type: 'success',
        icon: 'microchip',
        showDuration: false,
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Custom icon error',
        description: 'Notification description',
        type: 'info',
        icon: 'microchip',
        showDuration: false,
      },
    },
  ]);
  debugData<NotificationProps>([
    {
      action: 'notify',
      data: {
        title: 'Hexagon test',
        description: 'Notification description',
        type: 'error',
        duration: 20000,
        icon: 'microchip',
        showDuration: false,
        shape: 'hexagon',
      },
    },
  ]);
};
