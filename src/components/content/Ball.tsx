import { useRef } from 'react'
import { RigidBody, BallCollider, RapierRigidBody } from '@react-three/rapier'
import { Event } from 'three'
import useDeviceType from '@/hooks/useDeviceType'

interface IBallProps {
  position: [number, number, number]
  color: string
}

export const Ball = ({ position, color }: IBallProps) => {
  const api = useRef<RapierRigidBody>(null)
  const deviceType = useDeviceType()
  const handlePointerDown = (e: Event) => {
    e.stopPropagation()

    api.current?.applyImpulse(
      { x: 0, y: deviceType === 'desktop' ? 8 : 1, z: 0 },
      true
    )
    api.current?.applyTorqueImpulse(
      { x: Math.random() / 2, y: Math.random() / 2, z: Math.random() / 2 },
      true
    )
  }

  return (
    <RigidBody
      ref={api}
      colliders={false}
      enabledTranslations={[true, true, false]}
      linearDamping={0.8}
      angularDamping={0.8}
      restitution={0.5}
      position={position}
    >
      <BallCollider args={[deviceType === 'desktop' ? 0.48 : 0.25]} />
      <mesh castShadow receiveShadow onClick={handlePointerDown}>
        <sphereGeometry
          args={[deviceType === 'desktop' ? 0.48 : 0.25, 32, 32]}
        />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
