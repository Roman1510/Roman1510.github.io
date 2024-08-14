import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Physics, useSphere, usePlane } from '@react-three/cannon'
import { Event, Mesh } from 'three'

interface IBallProps {
  position: [number, number, number]
  color: string
}

const Ball = ({ position, color }: IBallProps) => {
  const [ref, api] = useSphere<Mesh>(() => ({
    mass: 1,
    position,
    args: [0.5],
  }))

  const handlePointerDown = (e: Event) => {
    e.stopPropagation()

    const impulse: [number, number, number] = [
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 10,
    ]

    api.applyImpulse(impulse, [0, 0, 0])
  }

  return (
    <mesh ref={ref} castShadow receiveShadow onPointerDown={handlePointerDown}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

const Plane = () => {
  const [ref] = usePlane<Mesh>(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }))

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry args={[100, 100]} />
      <shadowMaterial color="#171717" opacity={0.5} />
    </mesh>
  )
}

export const Second = () => {
  return (
    <div
      className="section"
      style={{ backgroundColor: '#9b72cf', height: '100vh' }}
    >
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <Physics gravity={[0, -9.81, 0]}>
          <Plane />
          <Ball position={[0, 2, 0]} color="red" />
          <Ball position={[2, 5, 0]} color="blue" />
          <Ball position={[-2, 8, 0]} color="green" />
        </Physics>
        <OrbitControls />
      </Canvas>
      <div className="title" style={{ padding: '50px' }}>
        <p
          style={{
            padding: '50px',
            userSelect: 'none',
            position: 'absolute',
            top: '0',
            left: '0',
            color: 'white',
            fontSize: '24px',
          }}
        >
          Tha
        </p>
      </div>
    </div>
  )
}
