import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import type { ProgressbarProps } from '../../typings';
import { motion, AnimatePresence } from 'framer-motion';

const Progressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
  });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[350px] h-[45px] z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-full h-full rounded-sm bg-muted overflow-hidden shadow-lg">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: duration / 1000,
                ease: 'linear',
              }}
              onAnimationComplete={() => {
                setVisible(false);
                fetchNui('progressComplete');
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-foreground drop-shadow-sm max-w-full px-2 truncate">
                {label}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Progressbar;
