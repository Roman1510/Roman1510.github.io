import {
  COLS,
  GAME_HEIGHT,
  GAME_WIDTH,
  ROWS,
  TILE_SIZE,
} from '@/constants/game-world'
import { drawGrid } from '@/helpers/drawGrid'
import { Graphics } from '@pixi/react'

const GridHelper = () => {
  return (
    <Graphics
      draw={(g) =>
        drawGrid(g, TILE_SIZE, COLS, ROWS, GAME_WIDTH, GAME_HEIGHT, {
          x: 0,
          y: TILE_SIZE,
        })
      }
    />
  )
}

export default GridHelper
