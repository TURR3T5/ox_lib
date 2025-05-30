import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from 'react';
import { IconAnimation } from '../components/LibIcon';

export type TextUiPosition = 'right-center' | 'left-center' | 'top-center' | 'bottom-center';

export interface TextUiProps {
  id?: string;
  text: string;
  position?: TextUiPosition;
  icon?: IconProp;
  iconColor?: string;
  iconAnimation?: IconAnimation;
  style?: React.CSSProperties;
  alignIcon?: 'top' | 'center';
  keybind?: string;
}