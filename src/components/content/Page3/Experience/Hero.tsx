import { useEffect, useRef, useState } from 'react'
import { Graphics } from '@pixi/react'
import { Graphics as GraphicsImpl } from 'pixi.js'
import { TILE_SIZE, GAME_WIDTH, GAME_HEIGHT } from '@/constants/game-world'
import { useHeroControls } from '@/hooks/useControls'

interface IHeroProps {
  x?: number
  y?: number
}

const MOVE_SPEED = 0.1
const TILE_SIZE_DOUBLE = TILE_SIZE * 2

export const Hero = ({ x = 0, y = 0 }: IHeroProps) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y })
  const animFrameRef = useRef<number | null>(null)

  const { getDirection } = useHeroControls()

  const drawHero = (g: GraphicsImpl) => {
    g.clear()
    g.beginFill(0x000000)
    g.drawRect(0, 0, TILE_SIZE_DOUBLE, TILE_SIZE_DOUBLE)
    g.endFill()
  }

  useEffect(() => {
    const updatePosition = () => {
      const direction = getDirection()

      let xDirection = 0
      let yDirection = 0

      if (direction === 'UP') yDirection = -1
      if (direction === 'DOWN') yDirection = 1
      if (direction === 'LEFT') xDirection = -1
      if (direction === 'RIGHT') xDirection = 1

      if (xDirection !== 0 || yDirection !== 0) {
        setPosition((prevPosition) => {
          const dx = xDirection * TILE_SIZE * MOVE_SPEED
          const dy = yDirection * TILE_SIZE * MOVE_SPEED

          const newX = prevPosition.x + dx
          const newY = prevPosition.y + dy

          const clampedX = Math.min(
            Math.max(newX, 0),
            GAME_WIDTH - TILE_SIZE_DOUBLE
          )
          const clampedY = Math.min(
            Math.max(newY, 0),
            GAME_HEIGHT - TILE_SIZE_DOUBLE
          )

          return { x: clampedX, y: clampedY }
        })
      }
    }

    const tick = () => {
      updatePosition()
      animFrameRef.current = requestAnimationFrame(tick)
    }

    animFrameRef.current = requestAnimationFrame(tick)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [getDirection])

  const heroClickedHandler = () => {
    console.log('Hero clicked')
  }

  return (
    <Graphics
      x={position.x}
      y={position.y}
      draw={drawHero}
      eventMode="dynamic"
      pointerdown={heroClickedHandler}
    />
  )
}
