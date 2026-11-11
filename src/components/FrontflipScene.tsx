import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { folder, useControls } from 'leva';
import { FrontFlip } from './FrontFlip';
import { MathUtils, Vector3, Vector4 } from 'three';
import { ContactFloor, type FootContacts } from './ContactFloor';

const CameraController = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const radius = 5.8;
  const target = useMemo(() => new Vector3(0, 1, -2), []);

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' && event.buttons === 0) return;
    setMousePosition({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: (event.clientY / window.innerHeight) * 2 - 1,
    });
  };

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useFrame(({ camera }) => {
    const angleX = mousePosition.x * 0.14;
    const elevation = 0.24 - mousePosition.y * 0.08;

    camera.position.x = radius * Math.sin(angleX) * Math.cos(elevation);
    camera.position.z = target.z + radius * Math.cos(angleX) * Math.cos(elevation);
    camera.position.y = target.y + radius * Math.sin(elevation);

    camera.lookAt(target);
  });

  return null;
};

const FrontflipScene = ({ isSlowMotion }: { isSlowMotion: boolean }) => {
  const contacts = useRef<FootContacts>({
    left: new Vector4(-0.6, -3.3, 0, 0),
    right: new Vector4(-0.6, -3.3, 0, 0),
  });
  const character = useControls('Character', {
    Position: folder({
      positionX: { value: -0.6, min: -5, max: 5, step: 0.01 },
      positionY: { value: 0, min: -5, max: 5, step: 0.01 },
      positionZ: { value: -3.3, min: -5, max: 5, step: 0.01 },
    }),
    Rotation: folder({
      rotationX: { value: -11, min: -180, max: 180, step: 1 },
      rotationY: { value: 15, min: -180, max: 180, step: 1 },
      rotationZ: { value: 10, min: -180, max: 180, step: 1 },
    }),
  });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 3.9, 5.75] }}>
        <CameraController />
        <Suspense fallback={null}>
          <ContactFloor contacts={contacts} />
          <FrontFlip
            isPlaying
            isSlowMotion={isSlowMotion}
            contacts={contacts}
            position={[
              character.positionX,
              character.positionY,
              character.positionZ,
            ]}
            rotation={[
              MathUtils.degToRad(character.rotationX),
              MathUtils.degToRad(character.rotationY),
              MathUtils.degToRad(character.rotationZ),
            ]}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FrontflipScene;
