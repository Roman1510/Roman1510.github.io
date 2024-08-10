import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Text, OrbitControls } from '@react-three/drei'

export const TextViewer = () => {
  return (
    <div style={{ position: 'relative', width: '70%', height: '70%' }}>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: '#532b88',
          color: 'white',
          fontSize: '24px',
          padding: '20px',
          lineHeight: '1.6',
          overflow: 'hidden',
          whiteSpace: 'pre-wrap',
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sit
        amet sem id orci viverra pellentesque. Sed cursus venenatis sem, a
        ultrices lectus. Proin aliquam nisi ut sem vulputate, ac consequat mi
        tristique. Mauris blandit libero in arcu fermentum, et viverra urna
        sodales. Vestibulum ut erat et sapien aliquam pharetra. Quisque quis
        ligula eget libero finibus efficitur. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Curabitur sit amet sem id orci viverra
        pellentesque. Sed cursus venenatis sem, a ultrices lectus. Proin aliquam
        nisi ut sem vulputate, ac consequat mi tristique. Mauris blandit libero
        in arcu fermentum, et viverra urna sodales. Vestibulum ut erat et sapien
        aliquam pharetra. Quisque quis ligula eget libero finibus efficitur.
      </div>

      <Canvas
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#532b88',
        }}
        camera={{ position: [0, 0, 2], fov: 50 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <GlassText />

        <OrbitControls />
      </Canvas>
    </div>
  )
}

const GlassText = () => {
  const ref = useRef(null)

  return (
    <Text ref={ref} position={[0, 0, 0]} fontSize={1} color="white">
      Roman Vinnick
      <meshPhysicalMaterial
        attach="material"
        color="white"
        roughness={0}
        transmission={1}
        thickness={0.5}
        clearcoat={1}
        clearcoatRoughness={0}
        envMapIntensity={1}
        metalness={0.9}
      />
    </Text>
  )
}
