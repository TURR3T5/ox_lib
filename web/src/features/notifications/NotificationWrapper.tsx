import { useNuiEvent } from '../../hooks/useNuiEvent';
import { toast, Toaster } from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { Box, Center, Group, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import React, { useState } from 'react';
import tinycolor from 'tinycolor2';
import type { NotificationProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';
import { keyframes } from '@emotion/react';

// Define animations
const slideInFromTop = keyframes`
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideInFromBottom = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideOutToRight = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(100%); }
`;

const slideOutToLeft = keyframes`
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-100%); }
`;

const slideOutToTop = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-100%); }
`;

const slideOutToBottom = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(100%); }
`;

const durationCircle = keyframes`
  0% { stroke-dasharray: 0, ${15.1 * 2 * Math.PI}; }
  100% { stroke-dasharray: ${15.1 * 2 * Math.PI}, 0; }
`;

const useStyles = createStyles((theme) => {
  return {
    container: {
      width: 300,
      height: 'fit-content',
      backgroundColor: theme.colors.dark[6],
      color: theme.colors.dark[0],
      padding: 12,
      borderRadius: theme.radius.sm,
      fontFamily: 'Roboto',
      boxShadow: theme.shadows.sm,
    },
    title: {
      fontWeight: 500,
      lineHeight: 'normal',
    },
    description: {
      fontSize: 12,
      color: theme.colors.dark[2],
      fontFamily: 'Roboto',
      lineHeight: 'normal',
    },
    descriptionOnly: {
      fontSize: 14,
      color: theme.colors.dark[2],
      fontFamily: 'Roboto',
      lineHeight: 'normal',
    },
    animationIn: {
      animation: `${slideInFromTop} 0.2s ease-out forwards`,
    },
    animationInBottom: {
      animation: `${slideInFromBottom} 0.2s ease-out forwards`,
    },
    animationOutRight: {
      animation: `${slideOutToRight} 0.4s ease-in forwards`,
    },
    animationOutLeft: {
      animation: `${slideOutToLeft} 0.4s ease-in forwards`,
    },
    animationOutTop: {
      animation: `${slideOutToTop} 0.4s ease-in forwards`,
    },
    animationOutBottom: {
      animation: `${slideOutToBottom} 0.4s ease-in forwards`,
    },
    circleAnimation: {
      '& > svg > circle:nth-of-type(2)': {
        animation: `${durationCircle} linear forwards reverse`,
      },
    },
  };
});

const Notifications: React.FC = () => {
  const { classes } = useStyles();
  const [toastKey, setToastKey] = useState(0);

  // Helper function to determine which animation class to use
  const getAnimationClass = (visible: boolean, position: string) => {
    if (visible) {
      return position.includes('bottom') ? classes.animationInBottom : classes.animationIn;
    } else {
      if (position.includes('right')) {
        return classes.animationOutRight;
      } else if (position.includes('left')) {
        return classes.animationOutLeft;
      } else if (position === 'top-center') {
        return classes.animationOutTop;
      } else if (position === 'bottom') {
        return classes.animationOutBottom;
      } else {
        return classes.animationOutRight;
      }
    }
  };

  useNuiEvent<NotificationProps>('notify', (data) => {
    if (!data.title && !data.description) return;

    const toastId = data.id?.toString();
    const duration = data.duration || 3000;

    let iconColor: string;
    let position = data.position || 'top-right';

    data.showDuration = data.showDuration !== undefined ? data.showDuration : true;

    if (toastId) setToastKey((prevKey) => prevKey + 1);

    // Backwards compat with old notifications
    switch (position) {
      case 'top':
        position = 'top-center';
        break;
      case 'bottom':
        position = 'bottom-center';
        break;
    }

    if (!data.icon) {
      switch (data.type) {
        case 'error':
          data.icon = 'circle-xmark';
          break;
        case 'success':
          data.icon = 'circle-check';
          break;
        case 'warning':
          data.icon = 'circle-exclamation';
          break;
        default:
          data.icon = 'circle-info';
          break;
      }
    }

    if (!data.iconColor) {
      switch (data.type) {
        case 'error':
          iconColor = 'red.6';
          break;
        case 'success':
          iconColor = 'teal.6';
          break;
        case 'warning':
          iconColor = 'yellow.6';
          break;
        default:
          iconColor = 'blue.6';
          break;
      }
    } else {
      iconColor = tinycolor(data.iconColor).toRgbString();
    }

    toast.custom(
      (t) => (
        <Box className={`${classes.container} ${getAnimationClass(t.visible, position)}`} sx={data.style}>
          <Group wrap="nowrap" gap={12}>
            {data.icon && (
              <>
                {data.showDuration ? (
                  <RingProgress
                    key={toastKey}
                    size={38}
                    thickness={2}
                    sections={[{ value: 100, color: iconColor }]}
                    style={{ alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start' }}
                    styles={{
                      root: {
                        '> svg > circle:nth-of-type(2)': {
                          animation: `${durationCircle} linear forwards reverse`,
                          animationDuration: `${duration}ms`,
                        },
                        margin: -3,
                      },
                    }}
                    label={
                      <Center>
                        <ThemeIcon
                          color={iconColor}
                          radius="xl"
                          size={32}
                          variant={tinycolor(iconColor).getAlpha() < 0 ? undefined : 'light'}
                        >
                          <LibIcon icon={data.icon} fixedWidth color={iconColor} animation={data.iconAnimation} />
                        </ThemeIcon>
                      </Center>
                    }
                  />
                ) : (
                  <ThemeIcon
                    color={iconColor}
                    radius="xl"
                    size={32}
                    variant={tinycolor(iconColor).getAlpha() < 0 ? undefined : 'light'}
                    style={{ alignSelf: !data.alignIcon || data.alignIcon === 'center' ? 'center' : 'start' }}
                  >
                    <LibIcon icon={data.icon} fixedWidth color={iconColor} animation={data.iconAnimation} />
                  </ThemeIcon>
                )}
              </>
            )}
            <Stack gap={0}>
              {data.title && <Text className={classes.title}>{data.title}</Text>}
              {data.description && (
                <div className={`${!data.title ? classes.descriptionOnly : classes.description} description`}>
                  <ReactMarkdown components={MarkdownComponents}>{data.description}</ReactMarkdown>
                </div>
              )}
            </Stack>
          </Group>
        </Box>
      ),
      {
        id: toastId,
        duration: duration,
        position: position,
      }
    );
  });

  return <Toaster />;
};

export default Notifications;
