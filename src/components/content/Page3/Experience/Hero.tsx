import { useCallback, useEffect, useRef, useState } from 'react'
import { Graphics } from '@pixi/react'
import { Graphics as GraphicsImpl } from 'pixi.js'
import { TILE_SIZE, GAME_WIDTH, GAME_HEIGHT } from '@/constants/game-world'

interface IHeroProps {
  x: number
  y: number
}

const MOVE_SPEED = 0.1

export const Hero = ({ x, y }: IHeroProps) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y })
  const animFrameRef = useRef<number | null>(null)
  const keysPressed = useRef<Set<string>>(new Set())

  const drawHero = (g: GraphicsImpl) => {
    g.clear()
    g.beginFill(0x000000)
    g.drawRect(0, 0, TILE_SIZE * 2, TILE_SIZE * 2)
    g.endFill()
  }

  const snapToGrid = useCallback((x: number, y: number) => {
    const snappedX = Math.round(x / TILE_SIZE) * TILE_SIZE
    const snappedY = Math.round(y / TILE_SIZE) * TILE_SIZE
    return { x: snappedX, y: snappedY }
  }, [])

  useEffect(() => {
    const updatePosition = () => {
      let xDirection = 0
      let yDirection = 0

      if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w')) {
        yDirection -= 1
      } else if (
        keysPressed.current.has('ArrowDown') ||
        keysPressed.current.has('s')
      ) {
        yDirection += 1
      } else if (
        keysPressed.current.has('ArrowLeft') ||
        keysPressed.current.has('a')
      ) {
        xDirection -= 1
      } else if (
        keysPressed.current.has('ArrowRight') ||
        keysPressed.current.has('d')
      ) {
        xDirection += 1
      }

      if (xDirection !== 0 || yDirection !== 0) {
        setPosition((prevPosition) => {
          const dx = xDirection * TILE_SIZE * MOVE_SPEED
          const dy = yDirection * TILE_SIZE * MOVE_SPEED

          const newX = prevPosition.x + dx
          const newY = prevPosition.y + dy

          const clampedX = Math.min(
            Math.max(newX, 0),
            GAME_WIDTH - TILE_SIZE * 2
          )
          const clampedY = Math.min(
            Math.max(newY, 0),
            GAME_HEIGHT - TILE_SIZE * 2
          )

          return { x: clampedX, y: clampedY }
        })
      } else {
        setPosition((prevPosition) =>
          snapToGrid(prevPosition.x, prevPosition.y)
        )
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
  }, [snapToGrid])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.key)
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key)

      if (keysPressed.current.size === 0) {
        setPosition((prevPosition) =>
          snapToGrid(prevPosition.x, prevPosition.y)
        )
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [snapToGrid])

  return (
    <Graphics
      x={position.x}
      y={position.y}
      draw={drawHero}
      eventMode="dynamic"
      pointerdown={() => console.log('Hero clicked')}
    />
  )
}
