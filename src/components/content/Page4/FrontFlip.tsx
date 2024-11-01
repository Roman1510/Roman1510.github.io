import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Alpha_Joints: THREE.SkinnedMesh
    Alpha_Surface: THREE.SkinnedMesh
    mixamorigHips: THREE.Bone
  }
  materials: {
    Alpha_Joints_MAT: THREE.MeshPhysicalMaterial
    Alpha_Body_MAT: THREE.MeshPhysicalMaterial
  }
}

export function FrontFlip(props: JSX.IntrinsicElements['group']) {
  const group = useRef<THREE.Group>(null)
  const { nodes, materials, animations } = useGLTF('/front-flip.glb') as GLTFResult
  const { actions } = useAnimations(animations, group)


  useEffect(() => {

    const flipAction = actions['Armature|mixamo.com|Layer0']

    if (flipAction) {

      flipAction.reset()

      flipAction.play()

      flipAction.setLoop(THREE.LoopRepeat, Infinity)

      flipAction.setEffectiveTimeScale(1)
    }
  }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            name="Alpha_Joints"
            geometry={nodes.Alpha_Joints.geometry}
            material={materials.Alpha_Joints_MAT}
            skeleton={nodes.Alpha_Joints.skeleton}
          />
          <skinnedMesh
            name="Alpha_Surface"
            geometry={nodes.Alpha_Surface.geometry}
            material={materials.Alpha_Body_MAT}
            skeleton={nodes.Alpha_Surface.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/front-flip.glb')