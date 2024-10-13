import { useRef } from 'react';
import { Sprite, Container, useTick } from '@pixi/react';
import { Texture } from 'pixi.js';
import { useAnimation } from '@/hooks/useAnimation';
import { TILE_SIZE } from '@/constants/game-world';

interface ICoinProps {
  texture: Texture;
  x: number;
  y: number;
}

const ANIMATION_SPEED = 60;

export const Coin = ({ texture, x, y }: ICoinProps) => {
  const rotation = useRef(0);
  const frameCount = useRef(0);

  const { sprite, updateSprite } = useAnimation({
    texture,
    frameWidth: 16,
    frameHeight: 16,
    totalFrames: 5,
    animationSpeed: ANIMATION_SPEED,
  });

  useTick((delta) => {
    frameCount.current += delta * 60;
    updateSprite(Math.floor(frameCount.current));
  });

  return (
    <Container rotation={rotation.current} x={x * TILE_SIZE} y={y * TILE_SIZE}>
      {sprite && (
        <Sprite
          texture={sprite.texture}
          scale={1.3}
          anchor={[-0.2, -0.1]}
        />
      )}
    </Container>
  );

}