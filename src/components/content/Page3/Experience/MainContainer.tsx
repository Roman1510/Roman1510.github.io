import { useState, useMemo, PropsWithChildren, useCallback } from 'react';
import { Texture } from 'pixi.js';
import { Container } from '@pixi/react';
import { Hero } from './Hero';
import { Level } from './Level';
import { TILE_SIZE } from '@/constants/game-world';
import { FollowingCamera } from './FollowingCamera';

interface IMainContainerProps {
  canvasSize: number;
}

const CAMERA_RADIUS = 300;
const INITIAL_ZOOM = 1.3;
const DOUBLE_TILE = TILE_SIZE * 2;

const MainContainer = ({
  canvasSize,
  children,
}: PropsWithChildren<IMainContainerProps>) => {
  const [heroPosition, setHeroPosition] = useState({
    x: DOUBLE_TILE * 2,
    y: DOUBLE_TILE * 2,
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

  return (
    <Container>
      {children}
      <FollowingCamera
        radius={CAMERA_RADIUS}
        zoom={zoom}
        heroPosition={heroPosition}
        canvasSize={canvasSize}
      >
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
