import { Canvas, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { Physics, CuboidCollider } from '@react-three/rapier'
import { Ball } from './Ball'
import { generateEmojiTextures } from '@/helpers/generateEmojiTexture'

interface IExperienceProps {
  balls: { position: [number, number, number]; color: string }[]
}

export const Experience = ({ balls }: IExperienceProps) => {
  const textures = generateEmojiTextures(balls.map((ball) => ball.color))

  return (
    <Canvas dpr={1} orthographic camera={{ position: [0, 0, 12], zoom: 180 }}>
      <spotLight decay={0} position={[8, 17, 8.5]} angle={0.4} />
      <Physics gravity={[0, -8, 0]}>
        {balls.map((ball, index) => (
          <Ball
            key={index}
            position={ball.position}
            texture={textures[index]}
          />
        ))}
        <Walls />
      </Physics>
      <Environment preset="forest" />
    </Canvas>
  )
}

const Walls = () => {
  const { width, height } = useThree((state) => state.viewport)

  return (
    <>
      <CuboidCollider
        position={[0, -height / 2 - 1, 0]}
        args={[width / 2, 1, 1]}
      />

      <CuboidCollider
        position={[-width / 2 - 1, 0, 0]}
        args={[1, height * 10, 1]}
      />

      <CuboidCollider
        position={[width / 2 + 1, 0, 0]}
        args={[1, height * 10, 1]}
      />
    </>
  )
}
