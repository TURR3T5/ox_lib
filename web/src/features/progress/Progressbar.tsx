import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import type { ProgressbarProps } from '../../typings';
import { motion, AnimatePresence } from 'framer-motion';
import { useKeyPress } from '../../hooks/useKeyPress';

const Progressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [startTime, setStartTime] = React.useState(0);
  const xKeyPressed = useKeyPress('x');

  React.useEffect(() => {
    if (xKeyPressed && visible) {
      setVisible(false);
      fetchNui('progressCancel');
    }
  }, [xKeyPressed, visible]);

  useNuiEvent('progressCancel', () => setVisible(false));

  useNuiEvent<ProgressbarProps>('progress', (data) => {
    setVisible(true);
    setLabel(data.label);
    setDuration(data.duration);
    setProgress(0);
    setStartTime(Date.now());
  });

  React.useEffect(() => {
    if (!visible || duration === 0) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        setVisible(false);
        fetchNui('progressComplete');
      }
    }, 16);

    return () => clearInterval(interval);
  }, [visible, duration, startTime]);

  const segments = Array.from({ length: 20 }, (_, i) => i);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed left-1/2 top-1/2 w-[500px] z-50"
          initial={{
            opacity: 0,
            y: 50,
            x: '-50%',
            scale: 0.95,
            skewX: '-1deg',
          }}
          animate={{
            opacity: 1,
            y: '-50%',
            x: '-50%',
            scale: 1,
            skewX: '-1deg',
          }}
          exit={{
            opacity: 0,
            y: 50,
            x: '-50%',
            scale: 0.95,
            skewX: '-1deg',
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="gaming-card rounded-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-white uppercase tracking-wider">{label}</span>
              <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
            </div>

            <div className="flex gap-1 h-8 mb-4">
              {segments.map((segment) => {
                const segmentProgress = Math.max(0, Math.min(1, (progress - segment * 5) / 5));
                const isActive = progress > segment * 5;

                return (
                  <motion.div
                    key={segment}
                    className="flex-1 bg-secondary/30 relative overflow-hidden"
                    style={{
                      transform: 'skewX(-12deg)',
                      transformOrigin: 'bottom',
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: segment * 0.02 }}
                  >
                    <motion.div
                      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary to-primary/80"
                      initial={{ height: '0%' }}
                      animate={{ height: `${segmentProgress * 100}%` }}
                      transition={{ duration: 0.1 }}
                    />
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{ x: ['0%', '100%'] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center">
              <span className="text-xs text-muted-foreground">Tryk X for at annullere</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Progressbar;
