import { Container, Stage, TilingSprite } from '@pixi/react'
import { GAME_HEIGHT, GAME_WIDTH } from '@/constants/game-world'
import { Hero } from './Hero'
import GridHelper from './GridHelper'

export const PixiGrid = () => {
  return (
    <Stage
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      options={{
        backgroundAlpha: 0,
        antialias: true,
        resolution: 1,
        autoDensity: false,
      }}
    >
      <Container>
        <GridHelper />
        <TilingSprite
          image={'/tilemap.png'}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          tilePosition={{ x: 0, y: 0 }}
          tileScale={{ x: 2, y: 2 }}
        />
        <Hero />
      </Container>
    </Stage>
  )
}
