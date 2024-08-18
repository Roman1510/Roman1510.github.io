import { usePlane } from '@react-three/cannon'
import { Mesh } from 'three'

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

export default Plane
