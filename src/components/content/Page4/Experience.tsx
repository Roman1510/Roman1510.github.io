import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Float } from '@react-three/drei';
import { Suspense } from 'react';

const Experience = () => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#c8b1e4' }}>
      <Canvas shadows >
        <Suspense fallback={null}>
          <OrbitControls enableZoom={true} enablePan={false} />
          <Float floatingRange={[0, 0.2]} floatIntensity={4}>
            <Box rotation={[0, 10, 0]} position={[0, 0, 0]} args={[1, 1, 1]} castShadow receiveShadow>
              <meshStandardMaterial attach="material" color="orange" />
            </Box>
          </Float>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;
