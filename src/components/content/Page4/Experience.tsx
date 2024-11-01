import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { Suspense } from 'react';
import { FrontFlip } from './FrontFlip';

const Experience = () => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#c8b1e4' }}>
      <Canvas shadows >
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} enablePan={false} />
          <Float floatingRange={[0, 0.2]} floatIntensity={4}>
            <FrontFlip />
          </Float>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;
