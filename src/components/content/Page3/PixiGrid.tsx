import { Container, Sprite, Stage } from '@pixi/react'
// import { BlurFilter, TextStyle } from 'pixi.js'
// import { useMemo } from 'react'

export const PixiGrid = () => {
  // const blurFilter = useMemo(() => new BlurFilter(0.3), [])
  const bunnyUrl = 'https://pixijs.io/pixi-react/img/bunny.png'

  return (
    <Stage width={1200} height={900} options={{ background: 0x1099bb }}>
      <Container x={200} y={200}>
        <Sprite image={bunnyUrl} x={0} y={0} />
      </Container>
    </Stage>
  )
}
