import { useRef, useEffect, useState, useCallback } from 'react'
import { Container as ContainerImpl, Graphics as GraphicsImpl } from 'pixi.js'
import { Container, Stage, Graphics } from '@pixi/react'
import { Hero } from './Hero'
import { Level } from './Level'
import { GAME_WIDTH, TILE_SIZE } from '@/constants/game-world'

const SCALE_FACTOR = 1.2
const VIEW_WIDTH = GAME_WIDTH / SCALE_FACTOR
const NUM_STARS = 100

export const PixiGrid = () => {
  const [heroPosition, setHeroPosition] = useState({ x: GAME_WIDTH / 2, y: GAME_WIDTH / 2 })
  const [circleRadius, setCircleRadius] = useState(window.innerWidth / 4.5)
  const containerRef = useRef<ContainerImpl>(null)
  const maskRef = useRef<GraphicsImpl>(null)
  const backgroundRef = useRef<GraphicsImpl>(null)

  useEffect(() => {
    const handleResize = () => {
      setCircleRadius(window.innerWidth / 4.5)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (containerRef.current && maskRef.current) {
      containerRef.current.mask = maskRef.current
    }
  }, [])

  const getCenter = useCallback(() => ({
    x: VIEW_WIDTH / 2 + TILE_SIZE * 1.5,
    y: VIEW_WIDTH / 2 + TILE_SIZE * 1.5,
  }), [])

  const getRandomPositionInCircle = useCallback((centerX: number, centerY: number, radius: number) => {
    let x, y, distanceFromCenter
    do {
      x = Math.random() * radius * 2 - radius
      y = Math.random() * radius * 2 - radius
      distanceFromCenter = Math.sqrt(x * x + y * y)
    } while (distanceFromCenter > radius)
    return { x: centerX + x, y: centerY + y }
  }, [])

  useEffect(() => {
    if (backgroundRef.current) {
      const g = backgroundRef.current
      const { x, y } = getCenter()

      g.clear()
      g.beginFill(0x000000)
      g.drawCircle(x, y, circleRadius)
      g.endFill()

      g.beginFill(0xFFFFFF)
      for (let i = 0; i < NUM_STARS; i++) {
        const { x: starX, y: starY } = getRandomPositionInCircle(x, y, circleRadius)
        g.drawCircle(starX, starY, Math.random() * 2 + 1)
      }
      g.endFill()
    }
  }, [circleRadius])

  const updateHeroPosition = (x: number, y: number) => {
    setHeroPosition({ x, y })
  }

  const drawMask = useCallback(
    (g: GraphicsImpl) => {
      const { x, y } = getCenter()
      g.clear()
      g.beginFill(0xFFFFFF)
      g.drawCircle(x, y, circleRadius)
      g.endFill()
    },
    [circleRadius]
  )

  const containerX = VIEW_WIDTH / 2 - heroPosition.x * SCALE_FACTOR
  const containerY = VIEW_WIDTH / 2 - heroPosition.y * SCALE_FACTOR

  return (
    <div style={{ height: '105%' }}>
      <Stage
        width={VIEW_WIDTH}
        height={VIEW_WIDTH}
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
