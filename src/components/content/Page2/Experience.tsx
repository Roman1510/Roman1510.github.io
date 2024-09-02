import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Physics, CuboidCollider } from '@react-three/rapier';
import { EffectComposer, ASCII } from '@react-three/postprocessing';
import { Ball } from './Ball';
import { katakana } from '@/constants/common';

interface IExperienceProps {
  balls: { position: [number, number, number] }[];
}

export const Experience = ({ balls }: IExperienceProps) => {
  return (
    <Canvas dpr={0.7} orthographic camera={{ position: [0, 0, 12], zoom: 180 }}>
      <Physics gravity={[0, -8, 0]}>
        {balls.map((ball, index) => (
          <Ball key={index} position={ball.position} />
        ))}
        <Walls />
      </Physics>
      <Environment preset="park" />
      <EffectComposer>
        <ASCII color="green" characters={katakana} font="MatrixCode" />
      </EffectComposer>
    </Canvas>
  );
};

const Walls = () => {
  const { width, height } = useThree((state) => state.viewport);

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
  );
};
