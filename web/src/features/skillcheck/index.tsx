import { useRef, useState, useEffect } from 'react';
import { useNuiEvent } from '../../hooks/useNuiEvent';
import Indicator from './indicator';
import { fetchNui } from '../../utils/fetchNui';
import { Box } from '@mantine/core';
import { createStyles } from '@mantine/emotion';
import type { GameDifficulty, SkillCheckProps } from '../../typings';

export const circleCircumference = 2 * 50 * Math.PI;

const getRandomAngle = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

const difficultyOffsets = {
  easy: 50,
  medium: 40,
  hard: 25,
};

const getRandomColor = () => `hsl(${Math.random() * 360}, 70%, 50%)`;
const getRandomDarkColor = () => `hsl(${Math.random() * 360}, 70%, 30%)`;

const useStyles = createStyles((theme, params: { difficultyOffset: number }) => ({
  svg: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    r: 50,
    width: 500,
    height: 500,
  },
  track: {
    fill: 'transparent',
    stroke: theme.colors.dark[5],
    strokeWidth: 8,
    r: 50,
    cx: 250,
    cy: 250,
    strokeDasharray: circleCircumference,
    '@media (min-height: 1440px)': {
      strokeWidth: 10,
      r: 65,
      strokeDasharray: 2 * 65 * Math.PI,
    },
    filter: 'url(#noiseFilter)',
  },
  skillArea: {
    fill: 'transparent',
    stroke: 'url(#skillAreaGradient)',
    strokeWidth: 8,
    r: 50,
    cx: 250,
    cy: 250,
    strokeDasharray: circleCircumference,
    strokeDashoffset: circleCircumference - (Math.PI * 50 * params.difficultyOffset) / 180,
    '@media (min-height: 1440px)': {
      strokeWidth: 10,
      r: 65,
      strokeDasharray: 2 * 65 * Math.PI,
      strokeDashoffset: 2 * 65 * Math.PI - (Math.PI * 65 * params.difficultyOffset) / 180,
    },
    filter: 'url(#distortionFilter)',
  },
  indicator: {
    stroke: 'url(#indicatorGradient)',
    strokeWidth: 16,
    fill: 'transparent',
    r: 50,
    cx: 250,
    cy: 250,
    strokeDasharray: circleCircumference,
    strokeDashoffset: circleCircumference - 3,
    '@media (min-height: 1440px)': {
      strokeWidth: 18,
      r: 65,
      strokeDasharray: 2 * 65 * Math.PI,
      strokeDashoffset: 2 * 65 * Math.PI - 5,
    },
    filter: 'url(#blurFilter)',
  },
  button: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.colors.dark[5],
    width: 25,
    height: 25,
    textAlign: 'center',
    borderRadius: 5,
    fontSize: 16,
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (min-height: 1440px)': {
      width: 30,
      height: 30,
      fontSize: 22,
    },
  },
  noiseElement: {
    animation: 'drift 3s infinite alternate',
    opacity: 0.2,
  },
  '@keyframes drift': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(3px, 3px)' },
  },
  '@keyframes pulse': {
    '0%': { opacity: 0.7, filter: 'blur(0px)' },
    '50%': { opacity: 1, filter: 'blur(0.3px)' },
    '100%': { opacity: 0.7, filter: 'blur(0px)' },
  },
  pulseAnimation: {
    animation: 'pulse 0.8s infinite',
  },
}));

const SkillCheck: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const dataRef = useRef<{ difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] } | null>(null);
  const dataIndexRef = useRef<number>(0);
  const [skillCheck, setSkillCheck] = useState<SkillCheckProps>({
    angle: 0,
    difficultyOffset: 50,
    difficulty: 'easy',
    key: 'e',
  });

  const [skillAreaColor1, setSkillAreaColor1] = useState(getRandomColor());
  const [skillAreaColor2, setSkillAreaColor2] = useState(getRandomDarkColor());
  const [indicatorColor1, setIndicatorColor1] = useState(getRandomColor());
  const [indicatorColor2, setIndicatorColor2] = useState(getRandomDarkColor());
  const [noiseElements, setNoiseElements] = useState<Array<{ cx: number; cy: number; r: number; fill: string }>>([]);
  const [turbulenceFrequency, setTurbulenceFrequency] = useState(0.05);

  const { classes } = useStyles({ difficultyOffset: skillCheck.difficultyOffset });

  const generateNoiseElements = () => {
    const newElements = [];
    for (let i = 0; i < 20; i++) {
      newElements.push({
        cx: 250 + Math.sin(i * 0.5) * (30 + Math.random() * 20),
        cy: 250 + Math.cos(i * 0.5) * (30 + Math.random() * 20),
        r: 1 + Math.random() * 3,
        fill: getRandomColor(),
      });
    }
    setNoiseElements(newElements);
  };

  const randomizeVisuals = () => {
    setSkillAreaColor1(getRandomColor());
    setSkillAreaColor2(getRandomDarkColor());
    setIndicatorColor1(getRandomColor());
    setIndicatorColor2(getRandomDarkColor());
    setTurbulenceFrequency(0.02 + Math.random() * 0.08);
    generateNoiseElements();
  };

  useNuiEvent('startSkillCheck', (data: { difficulty: GameDifficulty | GameDifficulty[]; inputs?: string[] }) => {
    dataRef.current = data;
    dataIndexRef.current = 0;
    const gameData = Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty;
    const offset = typeof gameData === 'object' ? gameData.areaSize : difficultyOffsets[gameData];
    const randomKey = data.inputs ? data.inputs[Math.floor(Math.random() * data.inputs.length)] : 'e';

    randomizeVisuals();

    setSkillCheck({
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: gameData,
      keys: data.inputs?.map((input) => input.toLowerCase()),
      key: randomKey.toLowerCase(),
    });

    setVisible(true);
  });

  useNuiEvent('skillCheckCancel', () => {
    setVisible(false);
    fetchNui('skillCheckOver', false);
  });

  useEffect(() => {
    generateNoiseElements();
  }, []);

  const handleComplete = (success: boolean) => {
    if (!dataRef.current) return;
    if (!success || !Array.isArray(dataRef.current.difficulty)) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    if (dataIndexRef.current >= dataRef.current.difficulty.length - 1) {
      setVisible(false);
      return fetchNui('skillCheckOver', success);
    }

    randomizeVisuals();

    dataIndexRef.current++;
    const data = dataRef.current.difficulty[dataIndexRef.current];
    const key = dataRef.current.inputs
      ? dataRef.current.inputs[Math.floor(Math.random() * dataRef.current.inputs.length)]
      : 'e';
    const offset = typeof data === 'object' ? data.areaSize : difficultyOffsets[data];
    setSkillCheck((prev) => ({
      ...prev,
      angle: -90 + getRandomAngle(120, 360 - offset),
      difficultyOffset: offset,
      difficulty: data,
      key: key.toLowerCase(),
    }));
  };

  return (
    <>
      {visible && (
        <>
          <svg className={classes.svg}>
            <defs>
              {}
              <linearGradient id="skillAreaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={skillAreaColor1} />
                <stop offset="100%" stopColor={skillAreaColor2} />
              </linearGradient>
              <linearGradient id="indicatorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={indicatorColor1} />
                <stop offset="100%" stopColor={indicatorColor2} />
              </linearGradient>

              {}
              <filter id="noiseFilter">
                <feTurbulence
                  type="turbulence"
                  baseFrequency={turbulenceFrequency}
                  numOctaves="2"
                  result="turbulence"
                />
                <feDisplacementMap
                  in2="turbulence"
                  in="SourceGraphic"
                  scale="2"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>

              {}
              <filter id="distortionFilter">
                <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" seed={Math.random() * 100} />
                <feDisplacementMap in="SourceGraphic" scale="5" />
              </filter>

              {}
              <filter id="blurFilter">
                <feGaussianBlur stdDeviation="0.5" />
              </filter>
            </defs>

            {}
            <circle className={`${classes.track} ${classes.pulseAnimation}`} />

            {}
            <circle transform={`rotate(${skillCheck.angle}, 250, 250)`} className={classes.skillArea} />

            {}
            <g className={classes.noiseElement}>
              {noiseElements.map((element, i) => (
                <circle key={i} cx={element.cx} cy={element.cy} r={element.r} fill={element.fill} />
              ))}
            </g>

            <Indicator
              angle={skillCheck.angle}
              offset={skillCheck.difficultyOffset}
              multiplier={
                skillCheck.difficulty === 'easy'
                  ? 0.5
                  : skillCheck.difficulty === 'medium'
                    ? 0.65
                    : skillCheck.difficulty === 'hard'
                      ? 1
                      : skillCheck.difficulty.speedMultiplier
              }
              handleComplete={handleComplete}
              className={`${classes.indicator} ${classes.pulseAnimation}`}
              skillCheck={skillCheck}
            />
          </svg>
          <Box className={classes.button}>{skillCheck.key.toUpperCase()}</Box>
        </>
      )}
    </>
  );
};

export default SkillCheck;
