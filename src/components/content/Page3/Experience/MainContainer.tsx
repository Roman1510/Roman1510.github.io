import { useState, useMemo, PropsWithChildren, useCallback } from 'react';
import { Texture } from 'pixi.js';
import { Container } from '@pixi/react';
import { Hero } from './Hero';
import { Level } from './Level';
import { TILE_SIZE } from '@/constants/game-world';
import { FollowingCamera } from './FollowingCamera';
import StarBackground from './StarBackground';

interface IMainContainerProps {
  canvasSize: number;
}

const INITIAL_ZOOM = 2.5;
const LEVEL_SIZE = 20; 

const MainContainer = ({
  canvasSize,
  children,
}: PropsWithChildren<IMainContainerProps>) => {
  const [heroPosition, setHeroPosition] = useState({
    x: TILE_SIZE * 2,
    y: TILE_SIZE * 2,
  });
  const [zoom, setZoom] = useState(INITIAL_ZOOM);

  const updateHeroPosition = useCallback((x: number, y: number) => {
    setHeroPosition({ x, y });
  }, []);

  const texture = useMemo(() => {
    const imagePath = '/hero.png';
    return Texture.from(imagePath);
  }, []);

  const handleZoomChange = useCallback((delta: number) => {
    setZoom((prevZoom) => Math.max(0.5, Math.min(2, prevZoom + delta)));
  }, []);

  const viewportRadius = useMemo(() => canvasSize * 0.5, [canvasSize]);

  const levelSize = LEVEL_SIZE * TILE_SIZE;

  return (
    <Container>
      {children}
      <FollowingCamera
        radius={viewportRadius}
        zoom={zoom}
        heroPosition={heroPosition}
        canvasSize={canvasSize}
      >
        <StarBackground width={levelSize} height={levelSize} starCount={1100} scale={5} offset={{x:levelSize,y:levelSize}}/>
        <Level />
        <Hero
          texture={texture}
          onMove={updateHeroPosition}
          x={heroPosition.x}
          y={heroPosition.y}
        />
      </FollowingCamera>
    </Container>
  );
};

export default MainContainer;