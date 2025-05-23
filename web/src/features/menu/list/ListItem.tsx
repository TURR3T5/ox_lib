import { Box, Group, Progress, Stack, Text, ThemeIcon } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import React, { forwardRef } from 'react';
import CustomCheckbox from './CustomCheckbox';
import type { MenuItem } from '../../../typings';
import { isIconUrl } from '../../../utils/isIconUrl';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import LibIcon from '../../../components/LibIcon';

interface Props {
  item: MenuItem;
  index: number;
  scrollIndex: number;
  checked: boolean;
}

const useStyles = createStyles((theme, params: { iconColor?: string }) => ({
  buttonContainer: {
    backgroundColor: theme.colors.dark[8],
    borderRadius: theme.radius.md,
    padding: 2,
    height: 60,
    opacity: 1,
    scrollMargin: 8,
    '&:focus': {
      backgroundColor: theme.colors.dark[7],
      opacity: 0.95,
      outline: 'none',
      boxShadow: `0 0 0 1.5px ${theme.colors.orange[7]}`,
    },
  },
  iconImage: {
    maxWidth: 32,
  },
  buttonWrapper: {
    paddingLeft: 5,
    paddingRight: 12,
    height: '100%',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    width: 30,
    height: 30,
  },
  icon: {
    color: params.iconColor || theme.colors.orange[7],
    opacity: 1,
  },
  label: {
    color: theme.colors.dark[2],
    textTransform: 'uppercase',
    fontSize: 12,
    verticalAlign: 'middle',
  },
  chevronIcon: {
    fontSize: 14,
    color: theme.colors.dark[2],
  },
  scrollIndexValue: {
    color: theme.colors.dark[2],
    textTransform: 'uppercase',
    fontSize: 14,
  },
  progressStack: {
    width: '100%',
    marginRight: 5,
  },
  progressLabel: {
    verticalAlign: 'middle',
    marginBottom: 3,
  },
}));

const ListItem = forwardRef<Array<HTMLDivElement | null>, Props>(({ item, index, scrollIndex, checked }, ref) => {
  const { classes } = useStyles({ iconColor: item.iconColor });

  return (
    <Box
      tabIndex={index}
      className={classes.buttonContainer}
      key={`item-${index}`}
      ref={(element: HTMLDivElement) => {
        if (ref && element) {
          // @ts-ignore i cba
          ref.current = [...ref.current, element];
        }
      }}
    >
      <Group gap={15} wrap="nowrap" className={classes.buttonWrapper}>
        {item.icon && (
          <Box className={classes.iconContainer}>
            {typeof item.icon === 'string' && isIconUrl(item.icon) ? (
              <img src={item.icon} alt="Missing image" className={classes.iconImage} />
            ) : (
              <ThemeIcon variant="light" size="lg" color="orange.7" fz={16}>
                <LibIcon
                  icon={item.icon as IconProp}
                  className={classes.icon}
                  fixedWidth
                  size="lg"
                  animation={item.iconAnimation}
                />
              </ThemeIcon>
            )}
          </Box>
        )}
        {Array.isArray(item.values) ? (
          <Group justify="space-between" w="100%">
            <Stack gap={0} justify="space-between">
              <Text className={classes.label}>{item.label}</Text>
              <Text>
                {typeof item.values[scrollIndex] === 'object'
                  ? // @ts-ignore for some reason even checking the type TS still thinks it's a string
                    item.values[scrollIndex].label
                  : item.values[scrollIndex]}
              </Text>
            </Stack>
            <Group gap={1} justify="center">
              <LibIcon icon="chevron-left" className={classes.chevronIcon} />
              <Text className={classes.scrollIndexValue}>
                {scrollIndex + 1}/{item.values.length}
              </Text>
              <LibIcon icon="chevron-right" className={classes.chevronIcon} />
            </Group>
          </Group>
        ) : item.checked !== undefined ? (
          <Group justify="space-between" w="100%">
            <Text>{item.label}</Text>
            <CustomCheckbox checked={checked}></CustomCheckbox>
          </Group>
        ) : item.progress !== undefined ? (
          <Stack className={classes.progressStack} gap={0}>
            <Text className={classes.progressLabel}>{item.label}</Text>
            <Progress
              value={item.progress}
              color={item.colorScheme || 'dark.0'}
              styles={(theme) => ({ root: { backgroundColor: theme.colors.dark[3] } })}
            />
          </Stack>
        ) : (
          <Text>{item.label}</Text>
        )}
      </Group>
    </Box>
  );
});

export default React.memo(ListItem);
