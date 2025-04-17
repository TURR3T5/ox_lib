import { TextUiProps } from '../../../typings';
import { debugData } from '../../../utils/debugData';

export const debugTextUI = () => {

  debugData<TextUiProps>([
    {
      action: 'textUi',
      data: {
        id: 'original',
        text: '[E] - Access locker inventory  \n [G] - Do something else',
        position: 'right-center',
        icon: 'door-open',
      },
    },
  ]);

  setTimeout(() => {
    debugData<TextUiProps>([
      {
        action: 'textUi',
        data: {
          id: 'keybind-right',
          text: 'Access locker inventory',
          position: 'right-center',
          keybind: 'E',
        },
      },
    ]);
  }, 1000);

  setTimeout(() => {
    debugData<TextUiProps>([
      {
        action: 'textUi',
        data: {
          id: 'keybind-left',
          text: 'Talk to NPC',
          position: 'left-center',
          keybind: 'F',
        },
      },
    ]);
  }, 1500);

  setTimeout(() => {
    debugData<TextUiProps>([
      {
        action: 'textUi',
        data: {
          id: 'icon-top',
          text: 'Objective: Find the hidden treasure',
          position: 'top-center',
          icon: 'map-marker',
          iconColor: '#ff6b6b',
          iconAnimation: 'pulse',
        },
      },
    ]);
  }, 2000);

  setTimeout(() => {
    debugData<TextUiProps>([
      {
        action: 'textUi',
        data: {
          id: 'keybind-bottom',
          text: 'Open inventory',
          position: 'bottom-center',
          keybind: 'I',
          style: { backgroundColor: '#2b2d42' },
        },
      },
    ]);
  }, 2500);

  setTimeout(() => {
    debugData<string>([
      {
        action: 'textUiHide',
        data: 'keybind-left',
      },
    ]);
  }, 5000);

  setTimeout(() => {
    debugData([
      {
        action: 'textUiHide',
        data: undefined,
      },
    ]);
  }, 8000);
};