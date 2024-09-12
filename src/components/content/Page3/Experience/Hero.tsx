import { useState } from 'react';
import { Sprite, Container, useTick } from '@pixi/react';
import { TILE_SIZE, GAME_WIDTH, GAME_HEIGHT } from '@/constants/game-world';
import { useHeroControls } from '@/hooks/useControls';
import { useSpriteAnimation } from '@/hooks/useSpriteAnimation';

interface IHeroProps {
  x?: number;
  y?: number;
}

const MOVE_SPEED = 6; // Adjusted for 60 FPS

export const Hero = ({ x = TILE_SIZE * 4, y = TILE_SIZE * 9 }: IHeroProps) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y });
  const { getDirection } = useHeroControls();
  const [currentDirection, setCurrentDirection] = useState<
    'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null
  >(null);

  const { sprite } = useSpriteAnimation({
    imagePath: '/hero.png',
    frameWidth: 64,
    frameHeight: 64,
    direction: currentDirection,
  });

  useTick((delta) => {
    const direction = getDirection();

    if (direction !== currentDirection) {
      setCurrentDirection(direction!);
    }

    let xDirection = 0;
    let yDirection = 0;

    if (direction === 'UP') yDirection = -1;
    if (direction === 'DOWN') yDirection = 1;
    if (direction === 'LEFT') xDirection = -1;
    if (direction === 'RIGHT') xDirection = 1;

    if (xDirection !== 0 || yDirection !== 0) {
      setPosition((prevPosition) => {
        const dx = xDirection * MOVE_SPEED * delta;
        const dy = yDirection * MOVE_SPEED * delta;

        const newX = prevPosition.x + dx;
        const newY = prevPosition.y + dy;

        const clampedX = Math.min(Math.max(newX, 0), GAME_WIDTH - TILE_SIZE);
        const clampedY = Math.min(Math.max(newY, 0), GAME_HEIGHT - TILE_SIZE);

        return { x: clampedX, y: clampedY };
      });
    }
  });

  const heroClickedHandler = () => {
    console.log('Hero clicked');
  };

  return (
    <Container>
      {sprite && (
        <Sprite
          texture={sprite.texture}
          scale={1.3}
          x={position.x}
          y={position.y}
          anchor={0}
          eventMode="dynamic"
          pointerdown={heroClickedHandler}
        />
      )}
    </Container>
  );
};
