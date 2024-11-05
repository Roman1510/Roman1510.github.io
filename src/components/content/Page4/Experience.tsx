import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useState, useEffect, useRef, useCallback } from 'react';
import { FrontFlip } from './FrontFlip';
import { Vector3 } from 'three';

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

const CameraController = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const radius = 10;

  const handleMouseMove = (event: MouseEvent) => {
    setMousePosition({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: (event.clientY / window.innerHeight) * 2 - 1,
    });
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ camera }) => {
    const angleX = mousePosition.x * Math.PI * 0.04;
    const angleY = mousePosition.y * Math.PI * 0.01;

    camera.position.x = radius * Math.sin(angleX) * Math.cos(angleY);
    camera.position.z = radius * Math.cos(angleX) * Math.cos(angleY);
    camera.position.y = radius * Math.sin(angleY);

    camera.lookAt(new Vector3(0, 2, -2));
  });

  return null;
};

const Experience = ({
  onControlsMount,
  initialAnimation = 'frontFlip',
}: ExperienceProps) => {
  const offsetRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isSlowMotion, setIsSlowMotion] = useState(false);

  const [currentAnimation, setCurrentAnimation] =
    useState<AnimationType>(initialAnimation);

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
      <Canvas camera={{ position: [0, 13.1, 0] }} shadows>
        <CameraController />
        <Suspense fallback={null}>
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
