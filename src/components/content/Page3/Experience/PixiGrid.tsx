import { useRef, useEffect, useState } from 'react'
import { Container, Stage, Graphics } from '@pixi/react'
import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE } from '@/constants/game-world'
import { Hero } from './Hero'
import GridHelper from './GridHelper'
import { Level } from './Level'
import * as PIXI from 'pixi.js'

const SCALE_FACTOR = 1.5
const VIEW_WIDTH = GAME_WIDTH / SCALE_FACTOR
const VIEW_HEIGHT = GAME_HEIGHT / SCALE_FACTOR

export const PixiGrid = () => {
  const [heroPosition, setHeroPosition] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 })
  const containerRef = useRef<PIXI.Container>(null)
  const maskRef = useRef<PIXI.Graphics>(null)

  useEffect(() => {
    if (containerRef.current && maskRef.current) {
      containerRef.current.mask = maskRef.current
    }
  }, [])

  const updateHeroPosition = (x: number, y: number) => {
    setHeroPosition({ x, y })
  }


  const drawCircleMask = (g: PIXI.Graphics) => {
    const radius = 280

    g.clear()
    g.beginFill(0xFFFFFF)
    g.drawCircle(VIEW_WIDTH / 2 + TILE_SIZE * 1.5, VIEW_HEIGHT / 2 + TILE_SIZE * 1.5, radius)
    g.endFill()
  }

  const containerX = VIEW_WIDTH / 2 - heroPosition.x * SCALE_FACTOR
  const containerY = VIEW_HEIGHT / 2 - heroPosition.y * SCALE_FACTOR

  return (
    <div
      style={{
        width: '80vw',
        maxWidth: '100%',
        aspectRatio: '1',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Stage
        width={VIEW_WIDTH}
        height={VIEW_HEIGHT}
        options={{
          backgroundAlpha: 0,
          antialias: true,
          resolution: 1,
          autoDensity: false,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Container
          ref={containerRef}
          scale={SCALE_FACTOR}
          x={containerX}
          y={containerY}
        >
          <GridHelper />
          <Level />
          <Hero onMove={updateHeroPosition} />
        </Container>

        <Graphics draw={drawCircleMask} ref={maskRef} />
      </Stage>
    </div>
  )
}
