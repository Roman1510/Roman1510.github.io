import { useMemo, useRef } from 'react'
import { RigidBody, BallCollider, RapierRigidBody } from '@react-three/rapier'
import { Event, CanvasTexture } from 'three'
import { useDeviceType } from '@/hooks/useDeviceType'

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

  const textTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 2048
    const context = canvas.getContext('2d')
    const emojis = [
      '💻',
      '🎧',
      '👨‍💻',
      '🖥️',
      '⌨️',
      '🕹️',
      '🧑‍💻',
      '🥋',
      '🥊',
      '🤼',
      '🎮',
      '💪',
      '👟',
      '📚',
      '☕',
      '🍃',
    ]
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

    if (context) {
      context.fillStyle = color
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.font = '550px sans-serif'
      context.textAlign = 'right'
      context.textBaseline = 'middle'

      context.fillText(randomEmoji, canvas.width / 4, canvas.height / 4)
    }

    return new CanvasTexture(canvas)
  }, [color])

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
      <mesh onClick={handlePointerDown}>
        <sphereGeometry
          args={[deviceType === 'desktop' ? 0.48 : 0.25, 32, 32]}
        />
        <meshStandardMaterial map={textTexture} />
      </mesh>
    </RigidBody>
  )
}
