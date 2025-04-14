import { ToastPosition } from 'react-hot-toast';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { EmotionSx } from '@mantine/emotion';
import { IconAnimation } from '../components/LibIcon';

export interface NotificationProps {
  style?: EmotionSx;
  description?: string;
  title?: string;
  duration?: number;
  showDuration?: boolean;
  icon?: IconProp;
  iconColor?: string;
  iconAnimation?: IconAnimation;
  position?: ToastPosition | 'top' | 'bottom';
  id?: number | string;
  type?: string;
  alignIcon?: 'top' | 'center';
}
