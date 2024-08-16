import { useRef } from 'react'
import { RigidBody, BallCollider, RapierRigidBody } from '@react-three/rapier'
import { Event } from 'three'

interface IBallProps {
  position: [number, number, number]
  color: string
}

export const Ball = ({ position, color }: IBallProps) => {
  const api = useRef<RapierRigidBody>(null)

  const handlePointerDown = (e: Event) => {
    e.stopPropagation()

    api.current?.applyImpulse({ x: 0, y: 10, z: 0 }, true)
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
      linearDamping={1}
      angularDamping={1}
      restitution={0.5}
      position={position}
    >
      <BallCollider args={[0.48]} />
      <mesh castShadow receiveShadow onClick={handlePointerDown}>
        <sphereGeometry args={[0.48, 32, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </RigidBody>
  )
}
