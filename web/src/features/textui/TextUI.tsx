import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { TextUiPosition, TextUiProps } from '../../typings';
import MarkdownComponents from '../../config/MarkdownComponents';
import LibIcon from '../../components/LibIcon';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const TextUI: React.FC = () => {
  const [data, setData] = React.useState<TextUiProps>({
    text: '',
    position: 'right-center',
  });
  const [visible, setVisible] = React.useState(false);

  useNuiEvent<TextUiProps>('textUi', (data) => {
    if (!data.position) data.position = 'right-center';
    setData(data);
    setVisible(true);
  });

  useNuiEvent('textUiHide', () => setVisible(false));

  const getMotionProps = (position: TextUiPosition) => {
    const baseProps = {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 },
    };

    switch (position) {
      case 'top-center':
        return {
          ...baseProps,
          initial: { ...baseProps.initial, x: '-50%' },
          animate: { ...baseProps.animate, x: '-50%' },
          exit: { ...baseProps.exit, x: '-50%' },
        };
      case 'bottom-center':
        return {
          ...baseProps,
          initial: { ...baseProps.initial, x: '-50%' },
          animate: { ...baseProps.animate, x: '-50%' },
          exit: { ...baseProps.exit, x: '-50%' },
        };
      case 'left-center':
        return {
          ...baseProps,
          initial: { ...baseProps.initial, y: '-50%' },
          animate: { ...baseProps.animate, y: '-50%' },
          exit: { ...baseProps.exit, y: '-50%' },
        };
      case 'right-center':
      default:
        return {
          ...baseProps,
          initial: { ...baseProps.initial, y: '-50%' },
          animate: { ...baseProps.animate, y: '-50%' },
          exit: { ...baseProps.exit, y: '-50%' },
        };
    }
  };

  const getPositionClasses = (position: TextUiPosition) => {
    switch (position) {
      case 'top-center':
        return 'top-8 left-1/2';
      case 'bottom-center':
        return 'bottom-8 left-1/2';
      case 'left-center':
        return 'left-8 top-1/2';
      case 'right-center':
      default:
        return 'right-8 top-1/2';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <div className={cn('fixed z-50 -skew-x-1', getPositionClasses(data.position || 'right-center'))}>
          <motion.div {...getMotionProps(data.position || 'right-center')} transition={{ duration: 0.2 }}>
            <div className="gaming-card rounded-lg p-4 max-w-sm" style={data.style}>
              <div className="flex gap-3 items-center">
                {data.icon && (
                  <div
                    className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
                    style={{ color: data.iconColor || 'hsl(var(--primary))' }}
                  >
                    <LibIcon icon={data.icon} fixedWidth animation={data.iconAnimation} className="w-5 h-5" />
                  </div>
                )}
                <div className="text-sm leading-relaxed text-muted-foreground">
                  <ReactMarkdown components={MarkdownComponents} remarkPlugins={[remarkGfm]}>
                    {data.text}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TextUI;
