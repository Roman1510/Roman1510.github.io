import { useRef, useEffect, useState, useCallback } from 'react'
import { Container as ContainerImpl, Graphics as GraphicsImpl } from 'pixi.js'
import { Container, Stage, Graphics } from '@pixi/react'
import { Hero } from './Hero'
import { Level } from './Level'
// import GridHelper from './GridHelper'
import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE } from '@/constants/game-world'

const SCALE_FACTOR = 1.5
const VIEW_WIDTH = GAME_WIDTH / SCALE_FACTOR
const VIEW_HEIGHT = GAME_HEIGHT / SCALE_FACTOR
const CIRCLE_RADIUS = 280

const getCenter = () => ({
  x: VIEW_WIDTH / 2 + TILE_SIZE * 1.5,
  y: VIEW_HEIGHT / 2 + TILE_SIZE * 1.5,
})

export const PixiGrid = () => {
  const [heroPosition, setHeroPosition] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 })
  const containerRef = useRef<ContainerImpl>(null)
  const maskRef = useRef<GraphicsImpl>(null)


  useEffect(() => {
    if (containerRef.current && maskRef.current) {
      containerRef.current.mask = maskRef.current
    }
  }, [])

  const updateHeroPosition = (x: number, y: number) => {
    setHeroPosition({ x, y })
  }


  const drawCircle = useCallback(
    (g: GraphicsImpl, fillColor: number) => {
      const { x, y } = getCenter()
      g.clear()
      g.beginFill(fillColor)
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

        <Graphics draw={(g) => drawCircle(g, 0x000000)} />

        <Container
          ref={containerRef}
          scale={SCALE_FACTOR}
          x={containerX}
          y={containerY}
        >

          <Level />
          <Hero onMove={updateHeroPosition} />
          {/* <GridHelper /> */}
        </Container>


        <Graphics draw={(g) => drawCircle(g, 0xFFFFFF)} ref={maskRef} />
      </Stage>
    </div>
  )
}
