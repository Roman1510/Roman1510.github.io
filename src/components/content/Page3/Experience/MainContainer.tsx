import { useRef, useState, useMemo } from 'react';
import { Container as ContainerImpl, Texture } from 'pixi.js';
import { Container } from '@pixi/react';
import { Hero } from './Hero';
import { Level } from './Level';
import { GAME_WIDTH, TILE_SIZE } from '@/constants/game-world';

interface IMainContainerProps {
  canvasSize: number;
}

const SCALE_FACTOR = 1.2;

const MainContainer = ({ canvasSize }: IMainContainerProps) => {
  const [heroPosition, setHeroPosition] = useState({
    x: GAME_WIDTH / 2,
    y: GAME_WIDTH / 2,
  });

  const containerRef = useRef<ContainerImpl>(null);

  const updateHeroPosition = (x: number, y: number) => {
    console.log('position changed');
    setHeroPosition({ x: x + TILE_SIZE / 2, y: y + TILE_SIZE / 2 });
  };

  const containerX =
    canvasSize / 2 - (heroPosition.x + TILE_SIZE / 2) * SCALE_FACTOR;
  const containerY =
    canvasSize / 2 - (heroPosition.y + TILE_SIZE / 2) * SCALE_FACTOR;

  const texture = useMemo(() => {
    const imagePath = '/hero.png';

    return Texture.from(imagePath);
  }, []);

  return (
    <Container
      ref={containerRef}
      scale={SCALE_FACTOR}
      x={containerX}
      y={containerY}
    >
      <Level />
      <Hero texture={texture} onMove={updateHeroPosition} />
    </Container>
  );
};

export default MainContainer;
