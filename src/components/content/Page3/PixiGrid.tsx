import { Container, Graphics, Stage } from '@pixi/react'
import { drawGrid } from '@/helpers/drawGrid'
import {
  COLS,
  GAME_HEIGHT,
  GAME_WIDTH,
  ROWS,
  TILE_SIZE,
} from '@/constants/game-world'

export const PixiGrid = () => {
  return (
    <Stage
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      options={{
        backgroundAlpha: 0,
        antialias: true,
      }}
    >
      <Container eventMode="static">
        <Graphics
          draw={(g) =>
            drawGrid(g, TILE_SIZE, COLS, ROWS, GAME_WIDTH, GAME_HEIGHT)
          }
        />
      </Container>
    </Stage>
  )
}
