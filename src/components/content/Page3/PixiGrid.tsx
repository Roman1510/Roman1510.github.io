import { Container, Graphics, Stage } from '@pixi/react'
import { Graphics as GraphicsImpl } from 'pixi.js'

export const PixiGrid = () => {
  const TILE_SIZE = 32
  const COLS = 48
  const ROWS = 31
  const GAME_WIDTH = TILE_SIZE * COLS
  const GAME_HEIGHT = TILE_SIZE * ROWS

  const drawGrid = (g: GraphicsImpl) => {
    g.clear()
    g.lineStyle(1, 0xcccccc, 1)

    for (let x = 0; x <= COLS; x++) {
      g.moveTo(x * TILE_SIZE, 0)
      g.lineTo(x * TILE_SIZE, GAME_HEIGHT)
    }

    for (let y = 0; y <= ROWS; y++) {
      g.moveTo(0, y * TILE_SIZE)
      g.lineTo(GAME_WIDTH, y * TILE_SIZE)
    }
  }

  return (
    <Stage
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      options={{
        backgroundAlpha: 0,
        antialias: true,
      }}
    >
      <Container>
        <Graphics draw={drawGrid} />
      </Container>
    </Stage>
  )
}
