import { useRef, useEffect, useState, useCallback } from 'react';
import { Graphics as GraphicsImpl } from 'pixi.js';
import { Stage, Graphics } from '@pixi/react';
import MainContainer from './MainContainer';

const NUM_STARS = 100;

export const PixiGrid = () => {
  const [canvasSize, setCanvasSize] = useState(0);

  const maskRef = useRef<GraphicsImpl>(null);
  const backgroundRef = useRef<GraphicsImpl>(null);

  const updateCanvasSize = useCallback(() => {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.9;
    setCanvasSize(size);
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [updateCanvasSize]);

  const getCenter = useCallback(
    () => ({
      x: canvasSize / 2,
      y: canvasSize / 2,
    }),
    [canvasSize]
  );

  const getRandomPositionInCircle = useCallback(
    (centerX: number, centerY: number, radius: number) => {
      let x, y, distanceFromCenter;
      do {
        x = Math.random() * radius * 2 - radius;
        y = Math.random() * radius * 2 - radius;
        distanceFromCenter = Math.sqrt(x * x + y * y);
      } while (distanceFromCenter > radius);
      return { x: centerX + x, y: centerY + y };
    },
    []
  );

  useEffect(() => {
    if (backgroundRef.current) {
      const g = backgroundRef.current;
      const { x, y } = getCenter();
      const radius = canvasSize / 2;

      g.clear();
      g.beginFill(0x000000);
      g.drawCircle(x, y, radius);
      g.endFill();

      g.beginFill(0xffffff);
      for (let i = 0; i < NUM_STARS; i++) {
        const { x: starX, y: starY } = getRandomPositionInCircle(x, y, radius);
        g.drawCircle(starX, starY, Math.random() * 2 + 1);
      }
      g.endFill();
    }
  }, [canvasSize, getCenter, getRandomPositionInCircle]);

  const drawMask = useCallback(
    (g: GraphicsImpl) => {
      const { x, y } = getCenter();
      g.clear();
      g.beginFill(0xffffff);
      g.drawCircle(x, y, canvasSize / 2);
      g.endFill();
    },
    [canvasSize, getCenter]
  );
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Stage
        width={canvasSize}
        height={canvasSize}
        options={{
          backgroundAlpha: 0,
          antialias: true,
          resolution: window.devicePixelRatio || 1,
          autoDensity: true,
        }}
      >
        <Graphics ref={backgroundRef} />
        <Graphics draw={drawMask} ref={maskRef} />
        <MainContainer canvasSize={canvasSize} />
      </Stage>
    </div>
  );
};
