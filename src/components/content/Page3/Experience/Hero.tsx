import { useRef, useCallback, useState } from 'react';
import { Sprite, Container, useTick } from '@pixi/react';
import { TILE_SIZE, GAME_WIDTH, GAME_HEIGHT } from '@/constants/game-world';
import { useHeroControls } from '@/hooks/useControls';
import { useSpriteAnimation } from '@/hooks/useSpriteAnimation';
import { Texture } from 'pixi.js';

interface IHeroProps {
  x?: number;
  y?: number;
  texture: Texture;
  onMove: (x: number, y: number) => void;
}

const DOUBLE_TILE = 64;
const MOVE_SPEED = 0.04;
const ANIMATION_SPEED = 0.5;

export const Hero = ({
  x = DOUBLE_TILE * 2,
  y = DOUBLE_TILE * 2,
  texture,
  onMove,
}: IHeroProps) => {
  const position = useRef<{ x: number; y: number }>({ x, y });
  const { getCurrentDirection } = useHeroControls();
  const [currentDirection, setCurrentDirection] = useState<
    'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null
  >(null);
  const targetPosition = useRef<{ x: number; y: number } | null>(null);
  const isMoving = useRef(false);

  const { sprite, updateSprite } = useSpriteAnimation({
    texture,
    frameWidth: 64,
    frameHeight: 64,
  });

  const moveTowards = useCallback(
    (current: number, target: number, maxStep: number) => {
      const step = Math.min(Math.abs(target - current), maxStep);
      return current + Math.sign(target - current) * step;
    },
    []
  );

  const setNextTarget = useCallback(
    (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (targetPosition.current) return;

      const newTarget = {
        x: Math.round(position.current.x / DOUBLE_TILE) * DOUBLE_TILE,
        y: Math.round(position.current.y / DOUBLE_TILE) * DOUBLE_TILE,
      };

      switch (direction) {
        case 'UP':
          newTarget.y -= DOUBLE_TILE;
          break;
        case 'DOWN':
          newTarget.y += DOUBLE_TILE;
          break;
        case 'LEFT':
          newTarget.x -= DOUBLE_TILE;
          break;
        case 'RIGHT':
          newTarget.x += DOUBLE_TILE;
          break;
      }

      newTarget.x = Math.min(
        Math.max(newTarget.x, 0),
        GAME_WIDTH - DOUBLE_TILE
      );
      newTarget.y = Math.min(
        Math.max(newTarget.y, 0),
        GAME_HEIGHT - DOUBLE_TILE
      );

      if (
        newTarget.x !== position.current.x ||
        newTarget.y !== position.current.y
      ) {
        targetPosition.current = newTarget;
      }
    },
    []
  );

  useTick((delta, ticker) => {
    ticker.maxFPS = 30;
    const direction = getCurrentDirection();

    if (!targetPosition.current && direction) {
      setNextTarget(direction);
      setCurrentDirection(direction);
    }

    if (targetPosition.current) {
      isMoving.current = true;
      const distance = Math.hypot(
        targetPosition.current.x - position.current.x,
        targetPosition.current.y - position.current.y
      );

      if (distance <= MOVE_SPEED * TILE_SIZE * delta) {
        position.current = targetPosition.current;
        targetPosition.current = null;

        if (direction) {
          setCurrentDirection(direction);
          setNextTarget(direction);
        }
      } else {
        const newX = moveTowards(
          position.current.x,
          targetPosition.current.x,
          MOVE_SPEED * DOUBLE_TILE * delta
        );
        const newY = moveTowards(
          position.current.y,
          targetPosition.current.y,
          MOVE_SPEED * DOUBLE_TILE * delta
        );
        position.current = { x: newX, y: newY };
        onMove(newX, newY);
      }
    } else {
      isMoving.current = false;
    }

    updateSprite(currentDirection, isMoving.current, ANIMATION_SPEED);
  });

  const heroClickedHandler = () => {
    console.log('Hero clicked');
  };

  return (
    <Container>
      {sprite && (
        <Sprite
          texture={sprite.texture}
          scale={1}
          x={position.current.x}
          y={position.current.y}
          anchor={0}
          eventMode="dynamic"
          pointerdown={heroClickedHandler}
        />
      )}
    </Container>
  );
};
