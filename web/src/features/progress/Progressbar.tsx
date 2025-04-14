import React from 'react';
import { ActionIcon, Box, Text } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import ScaleFade from '../../transitions/ScaleFade';
import type { ProgressbarProps } from '../../typings';

const useStyles = createStyles((theme) => ({
  wrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 60,
    position: 'absolute',
  },
  container: {
    width: 350,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  header: {
    width: '100%',
    borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
    paddingBottom: 0,
    position: 'relative',
  },
  labelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: 'white',
    fontWeight: 700,
  },
  percentage: {
    fontSize: 16,
    fontWeight: 700,
    color: 'white',
  },
  progressContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  segmentContainer: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  segment: {
    height: 12,
    flex: 1,
    borderRadius: 4,
    marginRight: 4,
    marginLeft: 2,
    transform: 'skew(-15deg)',
  },
  activeSegment: {
    backgroundColor: '#FF7A00',
  },
  inactiveSegment: {
    backgroundColor: '#555',
  },
  hiddenProgressBar: {
    display: 'none',
    height: '100%',
    width: '100%',
    animation: 'progress-bar linear',
  },
}));

const Progressbar: React.FC = () => {
  const { classes } = useStyles();
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  const totalSegments = 30;

  React.useEffect(() => {
    let interval: NodeJS.Timeout;

    if (visible) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(100, (elapsed / duration) * 100);
        setProgress(newProgress);

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => setVisible(false), 200);
        }
      }, 16);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [visible, duration]);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setProgress(0);
  });

  const renderSegments = () => {
    const activeSegments = Math.floor((progress / 100) * totalSegments);

    return Array(totalSegments)
      .fill(0)
      .map((_, index) => (
        <Box
          key={index}
          className={`${classes.segment} ${index < activeSegments ? classes.activeSegment : classes.inactiveSegment}`}
        />
      ));
  };

  return (
    <Box className={classes.wrapper}>
      <ScaleFade visible={visible} onExitComplete={() => fetchNui('progressComplete')}>
        <Box className={classes.container}>
          <Box className={classes.header}>
            <Box className={classes.labelRow}>
              <Text className={classes.label}>{label}</Text>
              <Text className={classes.percentage}>{Math.floor(progress)}%</Text>
            </Box>
          </Box>

          <Box className={classes.progressContainer}>
            <Box className={classes.segmentContainer}>{renderSegments()}</Box>
          </Box>

          <Box
            className={classes.hiddenProgressBar}
            style={{
              animationDuration: `${duration}ms`,
            }}
            onAnimationEnd={() => setVisible(false)}
          />
        </Box>
      </ScaleFade>
    </Box>
  );
};

export default Progressbar;
