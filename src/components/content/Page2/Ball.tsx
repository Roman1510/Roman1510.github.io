import { useRef } from 'react';
import { RigidBody, BallCollider, RapierRigidBody } from '@react-three/rapier';
import { Event } from 'three';
import { useDeviceType } from '@/hooks/useDeviceType';

interface IBallProps {
  position: [number, number, number];
}

export const Ball = ({ position }: IBallProps) => {
  const api = useRef<RapierRigidBody>(null);
  const deviceType = useDeviceType();

  const handlePointerDown = (e: Event) => {
    e.stopPropagation();

    api.current?.applyImpulse(
      { x: 0, y: deviceType === 'desktop' ? 6 : 1, z: 0 },
      true
    );
    api.current?.applyTorqueImpulse(
      { x: Math.random() / 10, y: Math.random() / 10, z: Math.random() / 10 },
      true
    );
  };

  return (
    <RigidBody
      ref={api}
      colliders={false}
      enabledTranslations={[true, true, false]}
      linearDamping={1}
      angularDamping={0.8}
      restitution={0.1}
      position={position}
    >
      <BallCollider args={[deviceType === 'desktop' ? 0.48 : 0.25]} />
      <mesh onClick={handlePointerDown}>
        <sphereGeometry args={[deviceType === 'desktop' ? 0.48 : 0.25, 5, 5]} />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
};
