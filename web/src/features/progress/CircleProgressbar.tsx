import React, { useEffect } from 'react';
import { RingProgress, Stack, Text, useMantineTheme } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { keyframes } from '@emotion/react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { CircleProgressbarProps } from '../../typings';

const progressCircle = keyframes`
  0% { stroke-dasharray: 0, ${33.5 * 2 * Math.PI}; }
  100% { stroke-dasharray: ${33.5 * 2 * Math.PI}, 0; }
`;

const useStyles = createStyles((theme, params: { position: 'middle' | 'bottom'; duration: number }) => ({
  container: {
    width: '100%',
    height: params.position === 'middle' ? '100%' : '20%',
    bottom: 0,
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progress: {
    '> svg > circle:nth-of-type(1)': {
      stroke: theme.colors.dark[5],
    },
    '> svg > circle:nth-of-type(2)': {
      transition: 'none',
      animation: `${progressCircle} linear forwards`,
      animationDuration: `${params.duration}ms`,
    },
  },
  value: {
    textAlign: 'center',
    fontFamily: 'Roboto Mono',
    textShadow: theme.shadows.sm,
    color: theme.colors.gray[3],
  },
  label: {
    textAlign: 'center',
    textShadow: theme.shadows.sm,
    color: theme.colors.gray[3],
    height: 25,
  },
  wrapper: {
    marginTop: params.position === 'middle' ? 25 : undefined,
  },
}));

const CircleProgressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [progressDuration, setProgressDuration] = React.useState(0);
  const [position, setPosition] = React.useState<'middle' | 'bottom'>('middle');
  const [value, setValue] = React.useState(0);
  const [label, setLabel] = React.useState('');
  const theme = useMantineTheme();
  const { classes } = useStyles({ position, duration: progressDuration });

  useNuiEvent('progressCancel', () => {
    setValue(99);
    setVisible(false);
  });

  useNuiEvent<CircleProgressbarProps>('circleProgress', (data) => {
    if (visible) return;
    setVisible(true);
    setValue(0);
    setLabel(data.label || '');
    setProgressDuration(data.duration);
    setPosition(data.position || 'middle');
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (visible && value < 100) {
      const onePercent = progressDuration * 0.01;
      interval = setInterval(() => {
        setValue((previousValue) => {
          const newValue = previousValue + 1;
          if (newValue >= 100) {
            clearInterval(interval);
            setTimeout(() => setVisible(false), 200);
          }
          return newValue;
        });
      }, onePercent);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visible, progressDuration, value]);

  return (
    <Stack gap={0} className={classes.container}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
        <Stack gap={0} align="center" className={classes.wrapper}>
          <RingProgress
            size={90}
            thickness={7}
            sections={[{ value: value, color: 'orange.7' }]}
            className={classes.progress}
            label={<Text className={classes.value}>{value}%</Text>}
          />
          {label && <Text className={classes.label}>{label}</Text>}
        </Stack>
      </ScaleFade>
    </Stack>
  );
};

export default CircleProgressbar;
