import { Graphics as GraphicsImpl } from 'pixi.js'

interface Offset {
  x?: number
  y?: number
}

export const drawGrid = (
  g: GraphicsImpl,
  tileSize: number,
  cols: number,
  rows: number,
  width: number,
  height: number,
  offset: Offset = { x: 0, y: 0 }
) => {
  const { x = 0, y = 0 } = offset

  g.clear()
  g.lineStyle(1, 0xcccccc, 1)

  for (let col = 0; col <= cols; col++) {
    const xPos = col * tileSize * 2 + x
    g.moveTo(xPos, y)
    g.lineTo(xPos, height + y)
  }

  for (let row = 0; row <= rows; row++) {
    const yPos = row * tileSize * 2 + y
    g.moveTo(x, yPos)
    g.lineTo(width + x, yPos)
  }
}
