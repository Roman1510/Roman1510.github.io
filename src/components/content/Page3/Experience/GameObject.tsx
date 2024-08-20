import { Graphics } from '@pixi/react'
import { TILE_SIZE } from '@/constants/game-world'
import { Color, Graphics as GraphicsImpl } from 'pixi.js'

interface IGameObjectProps {
  x: number
  y: number
}

export const GameObject = ({ x, y }: IGameObjectProps) => {
  const drawHero = (g: GraphicsImpl) => {
    g.clear()
    g.beginFill(new Color('red'))
    g.drawRect(0, 0, TILE_SIZE, TILE_SIZE)
    g.endFill()
  }

  return (
    <Graphics
      x={x}
      y={y}
      draw={drawHero}
      eventMode="static"
      pointerdown={() => console.log('GameObject clicked')}
    />
  )
}
