import React from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import { fetchNui } from '../../utils/fetchNui';
import type { ProgressbarProps } from '../../typings';
import { motion, AnimatePresence } from 'framer-motion';

const Progressbar: React.FC = () => {
  const [visible, setVisible] = React.useState(false);
  const [label, setLabel] = React.useState('');
  const [duration, setDuration] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [startTime, setStartTime] = React.useState(0);

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
        <div className="fixed left-1/2 bottom-20 w-[400px] z-50 -skew-x-1">
          <motion.div
            initial={{
              opacity: 0,
              y: 50,
              x: '-50%',
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: '-50%',
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 50,
              x: '-50%',
              scale: 0.95,
            }}
            transition={{ duration: 0.3 }}
          >
            <div className="gaming-card rounded-lg p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-white uppercase tracking-wider">{label}</span>
                <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
              </div>

              <div className="flex gap-1 justify-center items-center mb-4">
                {segments.map((segment) => {
                  const segmentProgress = Math.max(0, Math.min(1, (progress - segment * 5) / 5));
                  const isCompleted = progress >= (segment + 1) * 5;

                  return (
                    <motion.div
                      key={segment}
                      className="bg-secondary/50 w-[8px] h-[16px] relative overflow-hidden rounded-sm"
                      style={{ skewX: '-5deg' }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: segment * 0.02, duration: 0.2 }}
                    >
                      <motion.div
                        className="absolute left-0 top-0 w-full bg-gradient-to-t from-primary via-primary/90 to-primary/80 rounded-sm"
                        initial={{ height: '0%' }}
                        animate={{ height: `${segmentProgress * 100}%` }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        style={{ transformOrigin: 'bottom' }}
                      />

                      {isCompleted && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent rounded-sm"
                          animate={{
                            y: ['-100%', '100%'],
                            opacity: [0, 1, 0],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: segment * 0.05,
                          }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Progressbar;
