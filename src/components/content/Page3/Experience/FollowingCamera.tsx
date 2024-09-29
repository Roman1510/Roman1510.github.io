import { useRef, useEffect, PropsWithChildren } from 'react';
import { Container, Graphics } from '@pixi/react';
import { Graphics as PIXIGraphics } from 'pixi.js';
import { TILE_SIZE } from '@/constants/game-world';

interface FollowingCameraProps {
  radius: number;
  zoom: number;
  heroPosition: { x: number; y: number };
  canvasSize: number;
}

export const FollowingCamera = ({
  radius,
  zoom,
  heroPosition,
  canvasSize,
  children,
}: PropsWithChildren<FollowingCameraProps>) => {
  const maskRef = useRef<PIXIGraphics>(null);
  const containerRef = useRef<PIXIGraphics>(null);

  useEffect(() => {
    if (maskRef.current) {
      maskRef.current.clear();
      maskRef.current.beginFill(0xffffff);
      maskRef.current.drawCircle(canvasSize / 2, canvasSize / 2, radius);
      maskRef.current.endFill();
    }
  }, [radius, canvasSize]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.x =
        canvasSize / 2 - heroPosition.x * zoom - TILE_SIZE;
      containerRef.current.y =
        canvasSize / 2 - heroPosition.y * zoom - TILE_SIZE;
    }
  }, [heroPosition, zoom, canvasSize]);

  return (
    <Container>
      <Graphics draw={() => {}} ref={maskRef} />
      <Container mask={maskRef.current}>
        <Container ref={containerRef} scale={zoom}>
          {children}
        </Container>
      </Container>
    </Container>
  );
};
