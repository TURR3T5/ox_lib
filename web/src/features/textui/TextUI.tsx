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

  const getPositionClasses = (position: TextUiPosition) => {
    switch (position) {
      case 'top-center':
        return 'top-8 left-1/2 -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-8 left-1/2 -translate-x-1/2';
      case 'left-center':
        return 'left-8 top-1/2 -translate-y-1/2';
      case 'right-center':
      default:
        return 'right-8 top-1/2 -translate-y-1/2';
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={cn('fixed z-50', getPositionClasses(data.position || 'right-center'))}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <div className="gaming-card rounded-lg p-4 max-w-sm gaming-skew" style={data.style}>
            <div className={cn('flex gap-3', data.alignIcon === 'center' ? 'items-center' : 'items-start')}>
              {data.icon && (
                <div
                  className="flex-shrink-0 flex items-center justify-center"
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
      )}
    </AnimatePresence>
  );
};

export default TextUI;
