import { useCallback, useEffect, useState } from 'react';
import type { SkillCheckProps } from '../../typings';
import { useInterval } from '@mantine/hooks';

interface Props {
  angle: number;
  offset: number;
  multiplier: number;
  skillCheck: SkillCheckProps;
  className: string;
  handleComplete: (success: boolean, percentage?: number) => void;
}

const Indicator: React.FC<Props> = ({ angle, offset, multiplier, handleComplete, skillCheck, className }) => {
  const [indicatorAngle, setIndicatorAngle] = useState(-90);
  const [keyPressed, setKeyPressed] = useState<false | string>(false);
  const interval = useInterval(
    () =>
      setIndicatorAngle((prevState) => {
        const jitter = Math.random() * 0.05 - 0.025;
        return (prevState += multiplier + jitter);
      }),
    1
  );

  const keyHandler = useCallback(
    (e: KeyboardEvent) => {
      const capitalHetaCode = 880;
      const isNonLatin = e.key.charCodeAt(0) >= capitalHetaCode;
      var convKey = e.key.toLowerCase();
      if (isNonLatin) {
        if (e.code.indexOf('Key') === 0 && e.code.length === 4) {
          convKey = e.code.charAt(3);
        }

        if (e.code.indexOf('Digit') === 0 && e.code.length === 6) {
          convKey = e.code.charAt(5);
        }
      }
      setKeyPressed(convKey.toLowerCase());
    },
    [skillCheck]
  );

  useEffect(() => {
    setIndicatorAngle(-90);
    window.addEventListener('keydown', keyHandler);
    interval.start();

    const randomDelay = Math.random() * 50;
    setTimeout(() => {}, randomDelay);

    return () => {
      window.removeEventListener('keydown', keyHandler);
    };
  }, [skillCheck]);

  useEffect(() => {
    if (indicatorAngle + 90 >= 360) {
      interval.stop();
      handleComplete(false);
    }
  }, [indicatorAngle]);

  useEffect(() => {
    if (!keyPressed) return;

    if (skillCheck.keys && !skillCheck.keys?.includes(keyPressed)) return;

    interval.stop();

    window.removeEventListener('keydown', keyHandler);

    if (keyPressed !== skillCheck.key || indicatorAngle < angle || indicatorAngle > angle + offset) {
      handleComplete(false);
    } else {
      const hitPercentage = ((indicatorAngle - angle) / offset) * 100;
      handleComplete(true, Math.min(Math.max(hitPercentage, 0), 100));
    }

    setKeyPressed(false);
  }, [keyPressed]);

  return <circle transform={`rotate(${indicatorAngle}, 250, 250)`} className={className} />;
};

export default Indicator;
