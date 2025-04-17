import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { Box, Group, Stack, ThemeIcon, rgba } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import ReactMarkdown from 'react-markdown';
import ScaleFade from '../../transitions/ScaleFade';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';

const useStyles = createStyles((theme) => ({
  wrapper: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    display: 'flex',
  },
  rightCenter: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  leftCenter: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topCenter: {
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  bottomCenter: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  container: {
    fontSize: 16,
    padding: 12,
    margin: 8,
    backgroundColor: theme.colors.dark[6],
    color: theme.colors.dark[0],
    fontFamily: 'Roboto',
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.sm,
  },
  keybind: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 30,
    height: 30,
    borderRadius: theme.radius.sm,
    padding: '0 8px',
    fontFamily: 'Roboto Mono',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
}));

const TextUI: React.FC = () => {
  const [items, setItems] = React.useState<TextUiProps[]>([]);
  const { classes, cx } = useStyles();

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center';
    if (!data.id) data.id = Math.random().toString(36).substring(2, 9);

    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.id !== data.id);
      return [...newItems, data];
    });
  });

  useNuiEvent<string | undefined>('textUiHide', (id) => {
    if (id) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    } else {
      setItems([]);
    }
  });

  const itemsByPosition: Record<TextUiPosition, TextUiProps[]> = {
    'right-center': [],
    'left-center': [],
    'top-center': [],
    'bottom-center': [],
  };

  items.forEach((item) => {
    const position = item.position || 'right-center';
    itemsByPosition[position].push(item);
  });

  const getPositionClass = (position: TextUiPosition) => {
    switch (position) {
      case 'right-center':
        return classes.rightCenter;
      case 'left-center':
        return classes.leftCenter;
      case 'top-center':
        return classes.topCenter;
      case 'bottom-center':
        return classes.bottomCenter;
      default:
        return classes.rightCenter;
    }
  };

  return (
    <>
      {Object.entries(itemsByPosition).map(([position, positionItems]) => {
        if (positionItems.length === 0) return null;

        return (
          <Box className={cx(classes.wrapper, getPositionClass(position as TextUiPosition))} key={position}>
            <Stack gap={4}>
              {positionItems.map((item) => (
                <ScaleFade visible={true} key={item.id}>
                  <Box style={item.style} className={classes.container}>
                    <Group gap={12}>
                      {item.keybind ? (
                        <ThemeIcon size="lg" variant="light" color="orange.7">
                          <Box className={classes.keybind}>{item.keybind.toUpperCase()}</Box>
                        </ThemeIcon>
                      ) : (
                        item.icon && (
                          <ThemeIcon size="lg" variant="light" color="orange.7">
                            <LibIcon
                              icon={item.icon}
                              fixedWidth
                              size="lg"
                              animation={item.iconAnimation}
                              style={{
                                color: item.iconColor,
                                alignSelf: !item.alignIcon || item.alignIcon === 'center' ? 'center' : 'start',
                              }}
                            />
                          </ThemeIcon>
                        )
                      )}
                      <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                        {item.text}
                      </ReactMarkdown>
                    </Group>
                  </Box>
                </ScaleFade>
              ))}
            </Stack>
          </Box>
        );
      })}
    </>
  );
};

export default TextUI;
