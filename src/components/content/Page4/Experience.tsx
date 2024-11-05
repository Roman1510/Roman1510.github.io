import { Canvas } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { FrontFlip } from './FrontFlip';

export type AnimationType = 'frontFlip' | 'backFlip' | 'cartwheel' | 'dance';

export interface ExperienceProps {
  onControlsMount?: (controls: {
    togglePlay: () => void;
    toggleSpeed: () => void;
    reset: () => void;
    loadAnimation: (type: AnimationType) => void;
    getState: () => {
      isPlaying: boolean;
      isSlowMotion: boolean;
      currentAnimation: AnimationType;
    };
  }) => void;
  initialAnimation?: AnimationType;
}

const Experience = ({
  onControlsMount,
  initialAnimation = 'frontFlip',
}: ExperienceProps) => {
  const offsetRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSlowMotion, setIsSlowMotion] = useState(false);
  const [currentAnimation, setCurrentAnimation] =
    useState<AnimationType>(initialAnimation);
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);

  const controls = {
    togglePlay: () => setIsPlaying((prev) => !prev),
    toggleSpeed: () => setIsSlowMotion((prev) => !prev),
    reset: () => {
      setIsPlaying(true);
      setIsSlowMotion(false);
    },
    loadAnimation: (type: AnimationType) => {
      setCurrentAnimation(type);
      setIsPlaying(true);
    },
    getState: () => ({
      isPlaying,
      isSlowMotion,
      currentAnimation,
    }),
  };

  useEffect(() => {
    onControlsMount?.(controls);
  }, [isPlaying, isSlowMotion, currentAnimation]);

  const handleOffsetChange = useCallback((_offset: number) => {
    offsetRef.current = _offset;
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#c8b1e4' }}>
      <Canvas camera={{ position: [0, 2.1, 8.5] }} shadows>
        <Suspense fallback={null}>
          <OrbitControls
            ref={orbitControlsRef}
            enableZoom={false}
            enablePan={false}
          />
          <FrontFlip
            isPlaying={isPlaying}
            isSlowMotion={isSlowMotion}
            offset={offsetRef.current}
            onOffsetChange={handleOffsetChange}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Experience;
