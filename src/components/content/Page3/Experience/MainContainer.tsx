import {
  useRef,
  useState,
  useMemo,
  PropsWithChildren,
  useCallback,
} from 'react';
import { Container as ContainerImpl, Texture } from 'pixi.js';
import { Container } from '@pixi/react';
import { Hero } from './Hero';
import { Level } from './Level';
import { GAME_WIDTH, TILE_SIZE } from '@/constants/game-world';

interface IMainContainerProps {
  canvasSize: number;
}

const SCALE_FACTOR = 1.2;

const MainContainer = ({
  canvasSize,
  children,
}: PropsWithChildren<IMainContainerProps>) => {
  const [heroPosition, setHeroPosition] = useState({
    x: GAME_WIDTH / 2,
    y: GAME_WIDTH / 2,
  });

  const containerRef = useRef<ContainerImpl>(null);

  const updateHeroPosition = useCallback((x: number, y: number) => {
    setHeroPosition({ x: x + TILE_SIZE / 2, y: y + TILE_SIZE / 2 });
  }, []);

  const containerPosition = useMemo(() => {
    const containerX =
      canvasSize / 2 - (heroPosition.x + TILE_SIZE / 2) * SCALE_FACTOR;
    const containerY =
      canvasSize / 2 - (heroPosition.y + TILE_SIZE / 2) * SCALE_FACTOR;

    return { containerX, containerY };
  }, [canvasSize, heroPosition]);

  const texture = useMemo(() => {
    const imagePath = '/hero.png';
    return Texture.from(imagePath);
  }, []);

  return (
    <Container
      ref={containerRef}
      scale={SCALE_FACTOR}
      x={containerPosition.containerX}
      y={containerPosition.containerY}
    >
      {children}
      <Level />
      <Hero texture={texture} onMove={updateHeroPosition} />
    </Container>
  );
};

export default MainContainer;
