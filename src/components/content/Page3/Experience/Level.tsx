import { GAME_HEIGHT, GAME_WIDTH, OFFSET_Y, } from '@/constants/game-world';
import { Sprite } from '@pixi/react';
import GridHelper from './GridHelper';

export const Level = () => {
  return (
    <>
      <Sprite
        image={'/tilemap.png'}
        width={GAME_WIDTH}
        height={GAME_HEIGHT + OFFSET_Y}
        scale={1}
        y={(OFFSET_Y)}
      />
      <GridHelper />
    </>
  );
};
