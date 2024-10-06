import { GAME_HEIGHT, GAME_WIDTH,   } from '@/constants/game-world';
import { Sprite } from '@pixi/react';

export const Level = () => {
  return (
    <Sprite
      image={'/tilemap.png'}
      width={GAME_WIDTH}
      height={GAME_HEIGHT} 
      scale={2}
    />
  );
};
