import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import { FrontFlip } from './FrontFlip';

export interface ExperienceProps {
  onControlsMount?: (controls: {
    togglePlay: () => void;
    toggleSpeed: () => void;
    reset: () => void;
    getState: () => {
      isPlaying: boolean;
      isSlowMotion: boolean;
    };
  }) => void;
}

const Experience = ({ onControlsMount }: ExperienceProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSlowMotion, setIsSlowMotion] = useState(false);

  // Create control handlers
  const controls = {
    togglePlay: () => setIsPlaying(prev => !prev),
    toggleSpeed: () => setIsSlowMotion(prev => !prev),
    reset: () => {
      setIsPlaying(true);
      setIsSlowMotion(false);
    },
    getState: () => ({
      isPlaying,
      isSlowMotion
    })
  };

  // Expose controls to parent
  useEffect(() => {
    onControlsMount?.(controls);
  }, [isPlaying, isSlowMotion]); // Re-run when states change

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#c8b1e4' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <OrbitControls enableZoom={false} enablePan={false} />
          <FrontFlip
            isPlaying={isPlaying}
            isSlowMotion={isSlowMotion}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;