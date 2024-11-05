import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { GLTF } from 'three-stdlib';

type GLTFResult = GLTF & {
  nodes: {
    Alpha_Joints: THREE.SkinnedMesh;
    Alpha_Surface: THREE.SkinnedMesh;
    mixamorigHips: THREE.Bone;
  };
  materials: {
    Alpha_Joints_MAT: THREE.MeshPhysicalMaterial;
    Alpha_Body_MAT: THREE.MeshPhysicalMaterial;
  };
};

interface FrontFlipProps {
  isPlaying?: boolean;
  isSlowMotion?: boolean;
  offset?: number;
  onOffsetChange?: (currentOffset: number) => void;
}

export function FrontFlip({
  isPlaying = true,
  isSlowMotion = false,
  offset = 0,
  onOffsetChange,
  ...props
}: FrontFlipProps) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    '/front-flip.glb'
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const actionRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    const flipAction = actions['Armature|mixamo.com|Layer0'];

    if (flipAction) {
      actionRef.current = flipAction;
      flipAction.setLoop(THREE.LoopRepeat, Infinity);
      flipAction.play();

      return () => {
        flipAction.stop();
      };
    }
  }, [actions]);

  useEffect(() => {
    const action = actionRef.current;
    if (action) {
      action.paused = !isPlaying;
    }
  }, [isPlaying]);

  useEffect(() => {
    const action = actionRef.current;
    if (action) {
      action.setEffectiveTimeScale(isSlowMotion ? 0.012 : 0.8);
    }
  }, [isSlowMotion]);

  useEffect(() => {
    const action = actionRef.current;
    if (action && action.getClip()) {
      const clipDuration = action.getClip().duration;
      action.time = offset * clipDuration;
      action.paused = !isPlaying;
      action.play();
    }
  }, [offset]);

  // New useEffect to update the parent with the current offset
  useEffect(() => {
    const action = actionRef.current;
    if (!action || !onOffsetChange) return;

    const updateOffset = () => {
      const clipDuration = action.getClip().duration;
      const currentOffset = action.time / clipDuration;
      onOffsetChange(currentOffset);
    };

    // Update offset on each frame
    const interval = setInterval(updateOffset, 50); // adjust the interval as needed

    return () => clearInterval(interval);
  }, []);

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
  );
}

useGLTF.preload('/front-flip.glb');
