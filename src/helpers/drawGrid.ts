import { Graphics as GraphicsImpl } from 'pixi.js'

export const drawGrid = (
  g: GraphicsImpl,
  tileSize: number,
  cols: number,
  rows: number,
  width: number,
  height: number
) => {
  g.clear()
  g.lineStyle(1, 0xcccccc, 1)

  for (let x = 0; x <= cols; x++) {
    g.moveTo(x * tileSize, 0)
    g.lineTo(x * tileSize, height)
  }

  for (let y = 0; y <= rows; y++) {
    g.moveTo(0, y * tileSize)
    g.lineTo(width, y * tileSize)
  }
}
