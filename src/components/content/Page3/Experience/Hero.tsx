import { useState, useRef, useCallback, useEffect } from 'react'
import { Sprite, Container, useTick } from '@pixi/react'
import { TILE_SIZE, GAME_WIDTH, GAME_HEIGHT } from '@/constants/game-world'
import { useHeroControls } from '@/hooks/useControls'
import { useSpriteAnimation } from '@/hooks/useSpriteAnimation'

interface IHeroProps {
  x?: number
  y?: number
  onMove: (x: number, y: number) => void
}
const DOUBLE_TILE = 64
const MOVE_SPEED = 0.04
const ANIMATION_SPEED = 0.5

export const Hero = ({
  x = DOUBLE_TILE * 2,
  y = DOUBLE_TILE * 2,
  onMove,
}: IHeroProps) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y })
  const { getCurrentDirection } = useHeroControls()
  const [currentDirection, setCurrentDirection] = useState<
    'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null
  >(null)
  const targetPosition = useRef<{ x: number; y: number } | null>(null)
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    onMove(x, y)
  }, [])

  const { sprite, updateSprite } = useSpriteAnimation({
    imagePath: '/hero.png',
    frameWidth: 64,
    frameHeight: 64,
  })

  const moveTowards = useCallback(
    (current: number, target: number, maxStep: number) => {
      const step = Math.min(Math.abs(target - current), maxStep)
      return current + Math.sign(target - current) * step
    },
    []
  )

  const setNextTarget = useCallback(
    (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (targetPosition.current) return

      const newTarget = {
        x: Math.round(position.x / DOUBLE_TILE) * DOUBLE_TILE,
        y: Math.round(position.y / DOUBLE_TILE) * DOUBLE_TILE,
      }

      switch (direction) {
        case 'UP':
          newTarget.y -= DOUBLE_TILE
          break
        case 'DOWN':
          newTarget.y += DOUBLE_TILE
          break
        case 'LEFT':
          newTarget.x -= DOUBLE_TILE
          break
        case 'RIGHT':
          newTarget.x += DOUBLE_TILE
          break
      }

      newTarget.x = Math.min(Math.max(newTarget.x, 0), GAME_WIDTH - DOUBLE_TILE)
      newTarget.y = Math.min(
        Math.max(newTarget.y, 0),
        GAME_HEIGHT - DOUBLE_TILE
      )

      if (newTarget.x !== position.x || newTarget.y !== position.y) {
        targetPosition.current = newTarget
      }
    },
    [position]
  )

  useTick((_delta, ticker) => {
    ticker.maxFPS = 30
    const direction = getCurrentDirection()

    if (!targetPosition.current && direction) {
      setNextTarget(direction)
      setCurrentDirection(direction)
    }

    if (targetPosition.current) {
      setIsMoving(true)
      const distance = Math.hypot(
        targetPosition.current.x - position.x,
        targetPosition.current.y - position.y
      )

      if (distance <= MOVE_SPEED * TILE_SIZE) {
        setPosition(targetPosition.current)
        targetPosition.current = null

        if (direction) {
          setCurrentDirection(direction)
          setNextTarget(direction)
        }
      } else {
        const newX = moveTowards(
          position.x,
          targetPosition.current.x,
          MOVE_SPEED * DOUBLE_TILE
        )
        const newY = moveTowards(
          position.y,
          targetPosition.current.y,
          MOVE_SPEED * DOUBLE_TILE
        )
        setPosition({ x: newX, y: newY })
        onMove(newX, newY)
      }
    } else {
      setIsMoving(false)
    }

    // Update the sprite animation
    updateSprite(currentDirection, isMoving, ANIMATION_SPEED)
  })

  const heroClickedHandler = () => {
    console.log('Hero clicked')
  }

  return (
    <Container>
      {sprite && (
        <Sprite
          texture={sprite.texture}
          scale={1}
          x={position.x}
          y={position.y}
          anchor={0}
          eventMode="dynamic"
          pointerdown={heroClickedHandler}
        />
      )}
    </Container>
  )
}
