import { useEffect, useRef, useState } from 'react'
import { Graphics } from '@pixi/react'
import { Graphics as GraphicsImpl } from 'pixi.js'
import { TILE_SIZE } from '@/constants/game-world'

interface IHeroProps {
  x: number
  y: number
}

const MOVE_SPEED = 0.1

export const Hero = ({ x, y }: IHeroProps) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y })
  const [targetPosition, setTargetPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const keysPressed = useRef<Set<string>>(new Set())

  const drawHero = (g: GraphicsImpl) => {
    g.clear()
    g.beginFill(0x000000)
    g.drawRect(0, 0, TILE_SIZE, TILE_SIZE)
    g.endFill()
  }

  useEffect(() => {
    const updatePosition = () => {
      if (targetPosition) {
        setPosition((prevPosition) => {
          const dx = targetPosition.x - prevPosition.x
          const dy = targetPosition.y - prevPosition.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < TILE_SIZE * MOVE_SPEED) {
            setTargetPosition(null)
            return targetPosition
          }

          const moveX = (dx / distance) * MOVE_SPEED * TILE_SIZE
          const moveY = (dy / distance) * MOVE_SPEED * TILE_SIZE

          return {
            x: prevPosition.x + moveX,
            y: prevPosition.y + moveY,
          }
        })
      }
    }

    const tick = () => {
      updatePosition()
      animFrameRef.current = requestAnimationFrame(tick)
    }

    if (targetPosition) {
      animFrameRef.current = requestAnimationFrame(tick)
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [targetPosition])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.key)

      if (targetPosition) return

      let newPosition = { ...position }
      let xDirection = 0
      let yDirection = 0

      if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w'))
        yDirection -= 1
      if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('s'))
        yDirection += 1
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a'))
        xDirection -= 1
      if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d'))
        xDirection += 1

      if (xDirection || yDirection) {
        newPosition = {
          x: position.x + xDirection * TILE_SIZE,
          y: position.y + yDirection * TILE_SIZE,
        }
        setTargetPosition(newPosition)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key)

      if (keysPressed.current.size === 0 && !targetPosition) {
        setTargetPosition(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [position, targetPosition])

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
