import { useRef, useEffect, useState, useCallback } from 'react'
import { Container as ContainerImpl, Graphics as GraphicsImpl } from 'pixi.js'
import { Container, Stage, Graphics } from '@pixi/react'
import { Hero } from './Hero'
import { Level } from './Level'
import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE } from '@/constants/game-world'

const SCALE_FACTOR = 1.5
const VIEW_WIDTH = GAME_WIDTH / SCALE_FACTOR
const VIEW_HEIGHT = GAME_HEIGHT / SCALE_FACTOR
const CIRCLE_RADIUS = 280
const NUM_STARS = 100

const getCenter = () => ({
  x: VIEW_WIDTH / 2 + TILE_SIZE * 1.5,
  y: VIEW_HEIGHT / 2 + TILE_SIZE * 1.5,
})


const getRandomPositionInCircle = (centerX: number, centerY: number, radius: number) => {
  let x, y, distanceFromCenter
  do {
    x = Math.random() * radius * 2 - radius
    y = Math.random() * radius * 2 - radius
    distanceFromCenter = Math.sqrt(x * x + y * y)
  } while (distanceFromCenter > radius)
  return { x: centerX + x, y: centerY + y }
}

export const PixiGrid = () => {
  const [heroPosition, setHeroPosition] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 })
  const containerRef = useRef<ContainerImpl>(null)
  const maskRef = useRef<GraphicsImpl>(null)
  const backgroundRef = useRef<GraphicsImpl>(null)

  useEffect(() => {
    if (containerRef.current && maskRef.current) {
      containerRef.current.mask = maskRef.current
    }
  }, [])

  useEffect(() => {
    if (backgroundRef.current) {
      const g = backgroundRef.current
      const { x, y } = getCenter()


      g.clear()
      g.beginFill(0x000000)
      g.drawCircle(x, y, CIRCLE_RADIUS)
      g.endFill()


      g.beginFill(0xFFFFFF)
      for (let i = 0; i < NUM_STARS; i++) {
        const { x: starX, y: starY } = getRandomPositionInCircle(x, y, CIRCLE_RADIUS)
        g.drawCircle(starX, starY, Math.random() * 2 + 1)
      }
      g.endFill()
    }
  }, [])

  const updateHeroPosition = (x: number, y: number) => {
    setHeroPosition({ x, y })
  }

  const drawMask = useCallback(
    (g: GraphicsImpl) => {
      const { x, y } = getCenter()
      g.clear()
      g.beginFill(0xFFFFFF)
      g.drawCircle(x, y, CIRCLE_RADIUS)
      g.endFill()
    },
    []
  )

  const containerX = VIEW_WIDTH / 2 - heroPosition.x * SCALE_FACTOR
  const containerY = VIEW_HEIGHT / 2 - heroPosition.y * SCALE_FACTOR

  return (
    <div>
      <Stage
        width={VIEW_WIDTH}
        height={VIEW_HEIGHT}
        options={{
          backgroundAlpha: 0,
          antialias: true,
          resolution: 1,
          autoDensity: true,
        }}
      >

        <Graphics ref={backgroundRef} />

        <Container
          ref={containerRef}
          scale={SCALE_FACTOR}
          x={containerX}
          y={containerY}
        >
          <Level />
          <Hero onMove={updateHeroPosition} />

        </Container>


        <Graphics draw={drawMask} ref={maskRef} />
      </Stage>
    </div>
  )
}
