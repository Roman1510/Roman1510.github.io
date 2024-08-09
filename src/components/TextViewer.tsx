import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

export const TextViewer = () => {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Canvas
        style={{ background: 'white' }}
        camera={{ position: [2, 2, 2], fov: 75 }}
      >
        <RotatingBox />
      </Canvas>
    </div>
  );
};

const RotatingBox = () => {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += 0.01;
      ref.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={ref}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};
