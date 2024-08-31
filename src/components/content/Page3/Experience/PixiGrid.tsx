import { Container, Graphics, Stage, TilingSprite } from '@pixi/react'
import { drawGrid } from '@/helpers/drawGrid'
import {
  COLS,
  GAME_HEIGHT,
  GAME_WIDTH,
  ROWS,
  TILE_SIZE,
} from '@/constants/game-world'
import { Hero } from './Hero'
import { GameObject } from './GameObject'

export const PixiGrid = () => {
  return (
    <Stage
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      options={{
        backgroundAlpha: 0,
        antialias: true,
        resolution: 1,
        autoDensity: false,
      }}
    >
      <Container>
        <Graphics
          draw={(g) =>
            drawGrid(g, TILE_SIZE, COLS, ROWS, GAME_WIDTH, GAME_HEIGHT)
          }
        />
        <TilingSprite
          image={'/tilemap.png'}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          tilePosition={{ x: 0, y: 0 }}
          tileScale={{ x: 2, y: 2 }}
        />
        <Hero x={0} y={0} />
        <GameObject x={TILE_SIZE * 10} y={TILE_SIZE * 5} />
      </Container>
    </Stage>
  )
}
