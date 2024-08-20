import { Graphics } from '@pixi/react'
import { TILE_SIZE } from '@/constants/game-world'
import { Graphics as GraphicsImpl } from 'pixi.js'

interface IHeroProps {
  x: number
  y: number
}

export const Hero = ({ x, y }: IHeroProps) => {
  const drawHero = (g: GraphicsImpl) => {
    g.clear()
    g.beginFill(0x000000)
    g.drawRect(0, 0, TILE_SIZE, TILE_SIZE)
    g.endFill()
  }

  return (
    <Graphics
      x={x}
      y={y}
      draw={drawHero}
      eventMode="dynamic"
      pointerdown={() => console.log('Hero clicked')}
    />
  )
}
