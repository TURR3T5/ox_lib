import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { IconAnimation } from '../components/LibIcon';
import React from 'react';

export interface NotificationProps {
  style?: React.CSSProperties;
  description?: string;
  title?: string;
  duration?: number;
  showDuration?: boolean;
  icon?: IconProp;
  iconColor?: string;
  iconAnimation?: IconAnimation;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'top' | 'bottom' | 'center-right' | 'center-left';
  id?: number | string;
  type?: string;
  alignIcon?: 'top' | 'center';
}