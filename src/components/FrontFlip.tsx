import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import { GLTF } from 'three-stdlib';
import type { FootContacts } from './ContactFloor';

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
  position?: [number, number, number];
  rotation?: [number, number, number];
  contacts: React.MutableRefObject<FootContacts>;
}

interface ParticleSystem {
  source: THREE.SkinnedMesh;
  points: THREE.Points;
  vertexIndices: Uint32Array;
  positions: Float32Array;
  vertex: THREE.Vector3;
}

const MAX_PARTICLES_PER_MESH = 2500;
const PARTICLE_COLORS = [0x9fffe0, 0xd7b5ff];

export function FrontFlip({
  isPlaying = true,
  isSlowMotion = false,
  position = [-0.6, 0, -3.3],
  rotation = [
    THREE.MathUtils.degToRad(-11),
    THREE.MathUtils.degToRad(15),
    THREE.MathUtils.degToRad(10),
  ],
  contacts,
  ...props
}: FrontFlipProps) {
  const group = useRef<THREE.Group>(null);
  const jointsRef = useRef<THREE.SkinnedMesh>(null);
  const surfaceRef = useRef<THREE.SkinnedMesh>(null);
  const particleSystems = useRef<ParticleSystem[]>([]);
  const footBones = useRef<{ left: THREE.Bone | null; right: THREE.Bone | null }>({
    left: null,
    right: null,
  });
  const previousFootContact = useRef({ left: 0, right: 0 });
  const footPulse = useRef({ left: 0, right: 0 });
  const previousAnimationTime = useRef(0);
  const { nodes, materials, animations } = useGLTF(
    '/front-flip.glb'
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const actionRef = useRef<THREE.AnimationAction | null>(null);

  useEffect(() => {
    nodes.mixamorigHips.traverse((object) => {
      if (object.name.endsWith('LeftToe_End')) {
        footBones.current.left = object as THREE.Bone;
      } else if (object.name.endsWith('RightToe_End')) {
        footBones.current.right = object as THREE.Bone;
      }
    });

    const flipAction = actions['Armature|mixamo.com|Layer0'];

    if (flipAction) {
      actionRef.current = flipAction;
      flipAction.setLoop(THREE.LoopRepeat, Infinity);
      flipAction.play();

      return () => {
        flipAction.stop();
      };
    }
  }, [actions, nodes.mixamorigHips]);

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
    const systems: ParticleSystem[] = [];
    const meshes = [
      { mesh: jointsRef.current, color: PARTICLE_COLORS[0] },
      { mesh: surfaceRef.current, color: PARTICLE_COLORS[1] },
    ];

    meshes.forEach(({ mesh, color }) => {
      if (!mesh?.parent) return;

      const positionAttribute = mesh.geometry.getAttribute('position');
      const stride = Math.max(1, Math.ceil(positionAttribute.count / MAX_PARTICLES_PER_MESH));
      const vertexIndices = new Uint32Array(Math.ceil(positionAttribute.count / stride));
      const positions = new Float32Array(vertexIndices.length * 3);

      for (let particle = 0; particle < vertexIndices.length; particle += 1) {
        vertexIndices[particle] = particle * stride;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
      );
      const material = new THREE.PointsMaterial({
        color,
        size: 3,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
      });
      const points = new THREE.Points(geometry, material);
      points.position.copy(mesh.position);
      points.quaternion.copy(mesh.quaternion);
      points.scale.copy(mesh.scale);
      points.frustumCulled = false;
      mesh.parent.add(points);
      mesh.visible = false;

      systems.push({
        source: mesh,
        points,
        vertexIndices,
        positions,
        vertex: new THREE.Vector3(),
      });
    });

    particleSystems.current = systems;

    return () => {
      systems.forEach(({ source, points }) => {
        source.parent?.remove(points);
        points.geometry.dispose();
        (points.material as THREE.Material).dispose();
        source.visible = true;
      });
      particleSystems.current = [];
    };
  }, [nodes]);

  useFrame((_, delta) => {
    particleSystems.current.forEach(({ source, points, vertexIndices, positions, vertex }) => {
      const positionAttribute = source.geometry.getAttribute('position');
      source.skeleton.update();

      for (let particle = 0; particle < vertexIndices.length; particle += 1) {
        vertex.fromBufferAttribute(positionAttribute, vertexIndices[particle]);
        source.applyBoneTransform(vertexIndices[particle], vertex);
        positions[particle * 3] = vertex.x;
        positions[particle * 3 + 1] = vertex.y;
        positions[particle * 3 + 2] = vertex.z;
      }

      (points.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    });

    group.current?.updateMatrixWorld(true);
    const floorY = 0.25;
    const contactRange = 0.8;
    const leftFoot = footBones.current.left;
    const rightFoot = footBones.current.right;

    if (leftFoot && rightFoot) {
      const leftPosition = leftFoot.getWorldPosition(new THREE.Vector3());
      const rightPosition = rightFoot.getWorldPosition(new THREE.Vector3());
      const leftIntensity = THREE.MathUtils.clamp(
        1 - Math.abs(leftPosition.y - floorY) / contactRange,
        0,
        1
      );
      const rightIntensity = THREE.MathUtils.clamp(
        1 - Math.abs(rightPosition.y - floorY) / contactRange,
        0,
        1
      );

      if (leftIntensity > 0.65 && previousFootContact.current.left <= 0.65) {
        footPulse.current.left = 1;
      }
      if (rightIntensity > 0.65 && previousFootContact.current.right <= 0.65) {
        footPulse.current.right = 1;
      }

      footPulse.current.left *= Math.exp(-delta * 2.8);
      footPulse.current.right *= Math.exp(-delta * 2.8);
      previousFootContact.current.left = leftIntensity;
      previousFootContact.current.right = rightIntensity;

      contacts.current.left.set(
        leftPosition.x,
        leftPosition.z,
        leftIntensity,
        footPulse.current.left
      );
      contacts.current.right.set(
        rightPosition.x,
        rightPosition.z,
        rightIntensity,
        footPulse.current.right
      );

      const action = actionRef.current;
      if (action) {
        const duration = action.getClip().duration;
        const landingStart = duration * 0.88;
        const animationTime = action.time % duration;

        if (
          animationTime >= landingStart &&
          previousAnimationTime.current < landingStart
        ) {
          footPulse.current.left = 1;
          footPulse.current.right = 1;
          contacts.current.left.w = 1;
          contacts.current.right.w = 1;
        }

        previousAnimationTime.current = animationTime;
      }
    }
  });

  return (
    <group ref={group} {...props} position={position} rotation={rotation} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
          <skinnedMesh
            ref={jointsRef}
            name="Alpha_Joints"
            geometry={nodes.Alpha_Joints.geometry}
            material={materials.Alpha_Joints_MAT}
            skeleton={nodes.Alpha_Joints.skeleton}
            visible={false}
          />
          <skinnedMesh
            ref={surfaceRef}
            name="Alpha_Surface"
            geometry={nodes.Alpha_Surface.geometry}
            material={materials.Alpha_Body_MAT}
            skeleton={nodes.Alpha_Surface.skeleton}
            visible={false}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/front-flip.glb');
