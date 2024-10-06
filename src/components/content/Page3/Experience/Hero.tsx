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


const MOVE_SPEED = 0.04;
const ANIMATION_SPEED = 0.55;

export const Hero = ({
  x=0,
  y=0,
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

      newTarget.x = Math.min(
        Math.max(newTarget.x, 0),
        GAME_WIDTH - TILE_SIZE
      );
      newTarget.y = Math.min(
        Math.max(newTarget.y, 0),
        GAME_HEIGHT - TILE_SIZE
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
       
        position.current = { ...targetPosition.current };
        targetPosition.current = null;
  
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
          scale={0.5}
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
