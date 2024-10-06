import { useRef, useCallback, useState, useEffect } from 'react';
import { Sprite, Container, useTick } from '@pixi/react';
import { TILE_SIZE, } from '@/constants/game-world';
import { useHeroControls } from '@/hooks/useControls';
import { useSpriteAnimation } from '@/hooks/useSpriteAnimation';
import { Texture } from 'pixi.js';
import { canWalk } from './collisionMap';

interface IHeroProps {
  texture: Texture;
  onMove: (gridX: number, gridY: number) => void;
}

const MOVE_SPEED = 0.03;
const ANIMATION_SPEED = 0.45;

export const Hero = ({
  texture,
  onMove,
}: IHeroProps) => {

  const gridPosition = useRef<{ gridX: number; gridY: number }>({ gridX: 0, gridY: 0 });
  const position = useRef<{ x: number; y: number }>({ x: 3 * TILE_SIZE, y: 5 * TILE_SIZE });
  const { getCurrentDirection } = useHeroControls();
  const [currentDirection, setCurrentDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null>(null);
  const targetPosition = useRef<{ x: number; y: number } | null>(null);
  const isMoving = useRef(false);

  //initializing =>
  useEffect(() => {
    gridPosition.current.gridX = Math.floor(position.current.x / TILE_SIZE);
    gridPosition.current.gridY = Math.floor(position.current.y / TILE_SIZE);
    onMove?.(gridPosition.current.gridX, gridPosition.current.gridY);
  }, [])


  const { sprite, updateSprite } = useSpriteAnimation({
    texture,
    frameWidth: 64,
    frameHeight: 64,
  });

  const moveTowards = useCallback(
    (current: number, target: number, maxStep: number) => {
      const step = Math.min(Math.abs(target - current), maxStep);
      return Math.round(current + Math.sign(target - current) * step);
    },
    []
  );

  const setNextTarget = useCallback(
    (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (targetPosition.current) return;

      const newTarget = {
        x: Math.round(position.current.x / TILE_SIZE) * TILE_SIZE,
        y: Math.round(position.current.y / TILE_SIZE) * TILE_SIZE,
      };

      switch (direction) {
        case 'UP':
          newTarget.y -= TILE_SIZE;
          break;
        case 'DOWN':
          newTarget.y += TILE_SIZE;
          break;
        case 'LEFT':
          newTarget.x -= TILE_SIZE;
          break;
        case 'RIGHT':
          newTarget.x += TILE_SIZE;
          break;
      }


      if (
        canWalk(
          Math.floor(newTarget.y / TILE_SIZE),
          Math.floor(newTarget.x / TILE_SIZE)
        ) &&
        (newTarget.x !== position.current.x ||
          newTarget.y !== position.current.y)
      ) {
        targetPosition.current = newTarget;
      }
    },
    []
  );

  useTick((delta) => {
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
        position.current = { ...targetPosition.current };
        targetPosition.current = null;

        gridPosition.current.gridX = Math.floor(position.current.x / TILE_SIZE);
        gridPosition.current.gridY = Math.floor(position.current.y / TILE_SIZE);

        onMove(gridPosition.current.gridX, gridPosition.current.gridY);

        if (direction) {
          setCurrentDirection(direction);
          setNextTarget(direction);
        }
      } else {
        const newX = moveTowards(
          position.current.x,
          targetPosition.current.x,
          MOVE_SPEED * TILE_SIZE * delta
        );
        const newY = moveTowards(
          position.current.y,
          targetPosition.current.y,
          MOVE_SPEED * TILE_SIZE * delta
        );
        position.current = { x: newX, y: newY };
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
          scale={0.5}
          x={position.current.x}
          y={position.current.y}
          anchor={[0, 0.5]}
          eventMode="dynamic"
          pointerdown={heroClickedHandler}
        />
      )}
    </Container>
  );
};
