import { GAME_HEIGHT, GAME_WIDTH } from '@/constants/game-world';
import { TilingSprite } from '@pixi/react';

export const Level = () => {
  return (
    <TilingSprite
      image={'/tilemap.png'}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      tilePosition={{ x: 0, y: 0 }}
      tileScale={{ x: 2, y: 2 }}
    />
  );
};
