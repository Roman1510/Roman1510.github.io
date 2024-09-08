import { Container, Stage } from '@pixi/react'
import { GAME_HEIGHT, GAME_WIDTH } from '@/constants/game-world'
import { Hero } from './Hero'
import GridHelper from './GridHelper'
import { Level } from './Level'

export const PixiGrid = () => {
  const aspectRatio = GAME_WIDTH / GAME_HEIGHT

  return (
    <div
      style={{
        width: '80vw',
        maxWidth: '100%',
        aspectRatio: `${aspectRatio}`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Stage
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        options={{
          backgroundAlpha: 0,
          antialias: true,
          resolution: 1,
          autoDensity: false,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Container>
          <GridHelper />
          <Level />
          <Hero />
        </Container>
      </Stage>
    </div>
  )
}
