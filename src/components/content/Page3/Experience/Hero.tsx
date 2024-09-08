import { useEffect, useRef, useState } from 'react'
import { Sprite, Container } from '@pixi/react'

import { TILE_SIZE, GAME_WIDTH, GAME_HEIGHT } from '@/constants/game-world'
import { useHeroControls } from '@/hooks/useControls'
import { useSpriteAnimation } from '@/hooks/useSpriteAnimation'

interface IHeroProps {
  x?: number
  y?: number
}

const MOVE_SPEED = 0.1

export const Hero = ({ x = TILE_SIZE * 4, y = TILE_SIZE * 9 }: IHeroProps) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x, y })
  const animFrameRef = useRef<number | null>(null)

  const { getDirection } = useHeroControls()

  const { sprite } = useSpriteAnimation({
    imagePath: '/hero.png',
    frameWidth: 64,
    frameHeight: 64,
  })

  // const drawHero = (g: GraphicsImpl) => {
  //   g.clear()
  //   g.beginFill(0x000000)
  //   g.drawRect(0, 0, TILE_SIZE * 2, TILE_SIZE * 2)
  //   g.endFill()
  // }

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

          const clampedX = Math.min(Math.max(newX, 0), GAME_WIDTH - TILE_SIZE)
          const clampedY = Math.min(Math.max(newY, 0), GAME_HEIGHT - TILE_SIZE)

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
    <Container>
      {sprite && (
        <Sprite
          texture={sprite.texture}
          scale={1.3}
          x={position.x}
          y={position.y}
          anchor={0.5}
          eventMode="dynamic"
          pointerdown={heroClickedHandler}
        />
      )}
      {/* <Graphics
        x={position.x}
        y={position.y}
        // draw={drawHero}
        eventMode="dynamic"
        pointerdown={heroClickedHandler}
      /> */}
    </Container>
  )
}
