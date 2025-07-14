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
          className="fixed bottom-20 left-1/2 w-[400px] h-[60px] z-50"
          initial={{
            opacity: 0,
            y: 50,
            x: '-50%',
            skewX: '-1deg',
          }}
          animate={{
            opacity: 1,
            y: 0,
            x: '-50%',
            skewX: '-1deg',
          }}
          exit={{
            opacity: 0,
            y: 50,
            x: '-50%',
            skewX: '-1deg',
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative w-full h-full rounded-lg gaming-card overflow-hidden shadow-2xl">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-primary/90 to-primary shadow-lg"
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
              <span className="text-sm font-bold text-white drop-shadow-lg max-w-full px-4 truncate uppercase tracking-wide">
                {label}
              </span>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse opacity-30" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Progressbar;
