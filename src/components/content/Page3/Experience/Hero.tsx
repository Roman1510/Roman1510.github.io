import { useRef, useCallback, useEffect } from 'react'
import { Sprite, Container, useTick } from '@pixi/react'
import { ANIMATION_SPEED, DEFAULT_X_POS, DEFAULT_Y_POS, MOVE_SPEED, TILE_SIZE } from '@/constants/game-world'
import { useHeroControls } from '@/hooks/useControls'
import { Texture } from 'pixi.js'
import { canWalk } from './collisionMap'
import { useHeroAnimation } from '@/hooks/useHeroAnimation'
import { Direction } from '@/types/game-world'

interface IHeroProps {
  texture: Texture
  onMove: (gridX: number, gridY: number) => void
}

export const Hero = ({ texture, onMove }: IHeroProps) => {
  const position = useRef({ x: DEFAULT_X_POS, y: DEFAULT_Y_POS })
  const targetPosition = useRef<{ x: number; y: number } | null>(null)
  const currentDirection = useRef<Direction | null>(null)
  const { getControlsDirection } = useHeroControls()
  const isMoving = useRef(false)

  // Initialize grid position
  useEffect(() => {
    onMove(Math.floor(position.current.x / TILE_SIZE), Math.floor(position.current.y / TILE_SIZE))
  }, [onMove])

  const { sprite, updateSprite } = useHeroAnimation({ texture, frameWidth: 64, frameHeight: 64 })

  const moveTowards = useCallback(
    (current: number, target: number, maxStep: number) => {
      return Math.round(current + Math.sign(target - current) * Math.min(Math.abs(target - current), maxStep))
    },
    []
  )

  const checkCanMove = useCallback((direction: Direction) => {
    const { x, y } = position.current
    const newTarget = {
      x: Math.round(x / TILE_SIZE) * TILE_SIZE + (direction === 'LEFT' ? -TILE_SIZE : direction === 'RIGHT' ? TILE_SIZE : 0),
      y: Math.round(y / TILE_SIZE) * TILE_SIZE + (direction === 'UP' ? -TILE_SIZE : direction === 'DOWN' ? TILE_SIZE : 0),
    }

    return canWalk(Math.floor(newTarget.y / TILE_SIZE), Math.floor(newTarget.x / TILE_SIZE))
  }, [])

  const setNextTarget = useCallback((direction: Direction) => {
    if (targetPosition.current) return

    const { x, y } = position.current
    const newTarget = {
      x: Math.round(x / TILE_SIZE) * TILE_SIZE + (direction === 'LEFT' ? -TILE_SIZE : direction === 'RIGHT' ? TILE_SIZE : 0),
      y: Math.round(y / TILE_SIZE) * TILE_SIZE + (direction === 'UP' ? -TILE_SIZE : direction === 'DOWN' ? TILE_SIZE : 0),
    }

    // Always update the visual direction
    currentDirection.current = direction

    // Only set target position if we can actually move there
    if (checkCanMove(direction) && (newTarget.x !== x || newTarget.y !== y)) {
      targetPosition.current = newTarget
      isMoving.current = true
    } else {
      isMoving.current = false
    }
  }, [checkCanMove])

  useTick((delta) => {
    const nextDirection = getControlsDirection()

    // Always update direction if it changes, even if we're not moving
    if (nextDirection && (!isMoving.current || nextDirection !== currentDirection.current)) {
      setNextTarget(nextDirection)
    }

    if (targetPosition.current) {
      const { x, y } = position.current
      const { x: targetX, y: targetY } = targetPosition.current
      const distance = Math.hypot(targetX - x, targetY - y)

      if (distance <= MOVE_SPEED * TILE_SIZE * delta) {
        // Complete the movement
        position.current = { ...targetPosition.current }
        targetPosition.current = null
        onMove(Math.floor(x / TILE_SIZE), Math.floor(y / TILE_SIZE))
        isMoving.current = false

        // Check for next movement
        if (nextDirection) {
          setNextTarget(nextDirection)
        }
      } else {
        // Continue movement
        position.current = {
          x: moveTowards(x, targetX, MOVE_SPEED * TILE_SIZE * delta),
          y: moveTowards(y, targetY, MOVE_SPEED * TILE_SIZE * delta),
        }
      }
    }

    updateSprite(currentDirection.current!, isMoving.current, ANIMATION_SPEED)
  })

  return (
    <Container>
      {sprite && (
        <Sprite
          texture={sprite.texture}
          scale={0.5}
          x={position.current.x}
          y={position.current.y}
          anchor={[0, 0.4]}
          eventMode="dynamic"
          pointerdown={() => console.log('Hero clicked')}
        />
      )}
    </Container>
  )
}