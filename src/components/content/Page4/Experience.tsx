import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';
import { Suspense } from 'react';

const Experience = () => {
  return (
    <div style={{ backgroundColor: '#808080' }}> {/* Grey Background */}
      <Canvas shadows>
        <Suspense fallback={null}>
          <OrbitControls />

          <Box position={[0, 0, 0]} args={[1, 1, 1]} castShadow receiveShadow>
            <meshStandardMaterial attach="material" color="orange" />
          </Box>

          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;
