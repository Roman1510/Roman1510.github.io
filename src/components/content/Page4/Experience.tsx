import { Canvas } from '@react-three/fiber'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useState, useEffect, useRef, useCallback } from 'react'
import { FrontFlip } from './FrontFlip'
import { useControls } from 'leva'

export type AnimationType = 'frontFlip' | 'backFlip' | 'cartwheel' | 'dance'

export interface ExperienceProps {
  onControlsMount?: (controls: {
    togglePlay: () => void
    toggleSpeed: () => void
    reset: () => void
    loadAnimation: (type: AnimationType) => void
    getState: () => {
      isPlaying: boolean
      isSlowMotion: boolean
      currentAnimation: AnimationType
    }
  }) => void
  initialAnimation?: AnimationType
}

const Experience = ({
  onControlsMount,
  initialAnimation = 'frontFlip',
}: ExperienceProps) => {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isSlowMotion, setIsSlowMotion] = useState(false)
  const [currentAnimation, setCurrentAnimation] =
    useState<AnimationType>(initialAnimation)
  const orbitControlsRef = useRef<OrbitControlsImpl>(null)

  const {
    cameraPosition,
    cameraRotation,
    autoRotate,
    autoRotateSpeed,
    enableDamping,
    dampingFactor,
    offset,
  } = useControls('Camera Controls', {
    cameraPosition: {
      value: { x: 5, y: 5, z: 5 },
      step: 0.1,
    },
    cameraRotation: {
      value: { x: 0, y: 0, z: 0 },
      step: 0.1,
    },
    autoRotate: false,
    autoRotateSpeed: {
      value: 2.0,
      min: 0.1,
      max: 10,
      step: 0.1,
    },
    enableDamping: true,
    dampingFactor: {
      value: 0.05,
      min: 0.01,
      max: 0.5,
      step: 0.01,
    },
    offset: {
      value: 0,
      min: 0,
      max: 1,
      step: 0.01,
    },
  })

  const controls = {
    togglePlay: () => setIsPlaying((prev) => !prev),
    toggleSpeed: () => setIsSlowMotion((prev) => !prev),
    reset: () => {
      setIsPlaying(true)
      setIsSlowMotion(false)
    },
    loadAnimation: (type: AnimationType) => {
      setCurrentAnimation(type)
      setIsPlaying(true)
    },
    getState: () => ({
      isPlaying,
      isSlowMotion,
      currentAnimation,
    }),
  }

  useEffect(() => {
    onControlsMount?.(controls)
  }, [isPlaying, isSlowMotion, currentAnimation])

  // Update camera position and rotation when controls change
  useEffect(() => {
    if (orbitControlsRef.current) {
      const controls = orbitControlsRef.current
      controls.object.position.set(
        cameraPosition.x,
        cameraPosition.y,
        cameraPosition.z
      )
      controls.object.rotation.set(
        cameraRotation.x,
        cameraRotation.y,
        cameraRotation.z
      )
      controls.update()
    }
  }, [cameraPosition, cameraRotation])

  const handleOffsetChange = useCallback((offset: number) => {
    console.log(offset, 'offset')
  }, [])

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#c8b1e4' }}>
      <Canvas shadows camera={{ position: [5, 5, 5] }}>
        <Suspense fallback={null}>
          <OrbitControls
            ref={orbitControlsRef}
            enableZoom={false}
            enablePan={false}
            autoRotate={autoRotate}
            autoRotateSpeed={autoRotateSpeed}
            enableDamping={enableDamping}
            dampingFactor={dampingFactor}
          />
          <FrontFlip
            isPlaying={isPlaying}
            isSlowMotion={isSlowMotion}
            offset={offset}
            onOffsetChange={handleOffsetChange}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default Experience
