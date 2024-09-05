import { useCallback, useEffect, useRef, useState } from 'react';
import { Graphics } from '@pixi/react';
import { Graphics as GraphicsImpl } from 'pixi.js';
import { TILE_SIZE, GAME_WIDTH, GAME_HEIGHT } from '@/constants/game-world';

interface IHeroProps {
  x: number;
  y: number;
}

const MOVE_SPEED = 0.1;

export const Hero = ({ x, y }: IHeroProps) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y });
  const animFrameRef = useRef<number | null>(null);
  const keys = useRef<string[]>([]);

  const drawHero = (g: GraphicsImpl) => {
    g.clear();
    g.beginFill(0x000000);
    g.drawRect(0, 0, TILE_SIZE * 2, TILE_SIZE * 2);
    g.endFill();
  };

  const getLastKey = useCallback(() => keys.current[0], []);

  useEffect(() => {
    const updatePosition = () => {
      const lastKey = getLastKey();

      let xDirection = 0;
      let yDirection = 0;

      if (lastKey === 'ArrowUp' || lastKey === 'w') {
        yDirection = -1;
      } else if (lastKey === 'ArrowDown' || lastKey === 's') {
        yDirection = 1;
      } else if (lastKey === 'ArrowLeft' || lastKey === 'a') {
        xDirection = -1;
      } else if (lastKey === 'ArrowRight' || lastKey === 'd') {
        xDirection = 1;
      }

      if (xDirection !== 0 || yDirection !== 0) {
        setPosition((prevPosition) => {
          const dx = xDirection * TILE_SIZE * MOVE_SPEED;
          const dy = yDirection * TILE_SIZE * MOVE_SPEED;

          const newX = prevPosition.x + dx;
          const newY = prevPosition.y + dy;

          const clampedX = Math.min(
            Math.max(newX, 0),
            GAME_WIDTH - TILE_SIZE * 2
          );
          const clampedY = Math.min(
            Math.max(newY, 0),
            GAME_HEIGHT - TILE_SIZE * 2
          );

          return { x: clampedX, y: clampedY };
        });
      }
    };

    const tick = () => {
      updatePosition();
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [getLastKey]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (!keys.current.includes(key)) {
        keys.current.unshift(key);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key;
      keys.current = keys.current.filter((k) => k !== key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <Graphics
      x={position.x}
      y={position.y}
      draw={drawHero}
      eventMode="dynamic"
      pointerdown={() => console.log('Hero clicked')}
    />
  );
};
