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
  effectOrigins: Float32Array;
  cloudPositions: Float32Array;
  scatterDirections: Float32Array;
  scatterDistances: Float32Array;
  vertex: THREE.Vector3;
  hasEffectOrigin: boolean;
}

const MAX_PARTICLES_PER_MESH = 2500;
const PARTICLE_COLORS = [0xffe9a6, 0xffc85c];
const DISSOLVE_START = 0.84;
const CLOUD_START = 0.91;
const ASSEMBLY_END = 0.16;
const CLOUD_RADIUS_MIN = 12;
const CLOUD_RADIUS_RANGE = 28;

type ParticlePhase = 'character' | 'dissolving' | 'cloud' | 'assembling';

const random01 = (seed: number) => {
  const value = Math.sin(seed * 127.1) * 43758.5453;
  return value - Math.floor(value);
};

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
  const particlePhase = useRef<ParticlePhase>('character');
  const animationSpeed = useRef(0.8);
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
      const speed =
        isSlowMotion && particlePhase.current === 'character' ? 0.012 : 0.8;
      action.setEffectiveTimeScale(speed);
      animationSpeed.current = speed;
    }
  }, [isSlowMotion, actions]);

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
      const effectOrigins = new Float32Array(vertexIndices.length * 3);
      const cloudPositions = new Float32Array(vertexIndices.length * 3);
      const scatterDirections = new Float32Array(vertexIndices.length * 3);
      const scatterDistances = new Float32Array(vertexIndices.length);

      for (let particle = 0; particle < vertexIndices.length; particle += 1) {
        vertexIndices[particle] = particle * stride;

        const vertical = random01(particle + color) * 2 - 1;
        const angle = random01(particle + color + 1) * Math.PI * 2;
        const horizontal = Math.sqrt(1 - vertical * vertical);
        scatterDirections[particle * 3] = horizontal * Math.cos(angle);
        scatterDirections[particle * 3 + 1] = vertical;
        scatterDirections[particle * 3 + 2] = horizontal * Math.sin(angle);
        scatterDistances[particle] =
          CLOUD_RADIUS_MIN + random01(particle + color + 2) * CLOUD_RADIUS_RANGE;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
      );
      const material = new THREE.PointsMaterial({
        color,
        size: 3.5,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
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
        effectOrigins,
        cloudPositions,
        scatterDirections,
        scatterDistances,
        vertex: new THREE.Vector3(),
        hasEffectOrigin: false,
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
    const action = actionRef.current;
    const duration = action?.getClip().duration ?? 0;
    const animationTime = duration > 0 ? (action?.time ?? 0) % duration : 0;
    const animationProgress = duration > 0 ? animationTime / duration : 0;
    const wrapped = duration > 0 &&
      previousAnimationTime.current > duration * CLOUD_START &&
      animationTime < duration * ASSEMBLY_END;

    if (particlePhase.current === 'character' && animationProgress >= DISSOLVE_START) {
      particlePhase.current = 'dissolving';
    } else if (
      particlePhase.current === 'dissolving' &&
      animationProgress >= CLOUD_START
    ) {
      particlePhase.current = 'cloud';
    } else if (particlePhase.current === 'cloud' && wrapped) {
      particlePhase.current = 'assembling';
    } else if (
      particlePhase.current === 'assembling' &&
      animationProgress >= ASSEMBLY_END
    ) {
      particlePhase.current = 'character';
    }

    const speed =
      isSlowMotion && particlePhase.current === 'character' ? 0.012 : 0.8;
    if (action && animationSpeed.current !== speed) {
      action.setEffectiveTimeScale(speed);
      animationSpeed.current = speed;
    }

    const dissolveProgress = THREE.MathUtils.clamp(
      (animationProgress - DISSOLVE_START) / (CLOUD_START - DISSOLVE_START),
      0,
      1
    );
    const assemblyProgress = THREE.MathUtils.clamp(
      animationProgress / ASSEMBLY_END,
      0,
      1
    );
    const ease = (value: number) => value * value * (3 - 2 * value);

    particleSystems.current.forEach((system) => {
      const {
        source,
        points,
        vertexIndices,
        positions,
        effectOrigins,
        cloudPositions,
        scatterDirections,
        scatterDistances,
        vertex,
      } = system;
      const positionAttribute = source.geometry.getAttribute('position');
      source.skeleton.update();

      for (let particle = 0; particle < vertexIndices.length; particle += 1) {
        vertex.fromBufferAttribute(positionAttribute, vertexIndices[particle]);
        source.applyBoneTransform(vertexIndices[particle], vertex);
        positions[particle * 3] = vertex.x;
        positions[particle * 3 + 1] = vertex.y;
        positions[particle * 3 + 2] = vertex.z;
      }

      if (particlePhase.current === 'character') {
        system.hasEffectOrigin = false;
        (points.material as THREE.PointsMaterial).opacity = 0.9;
        (points.material as THREE.PointsMaterial).size = 3.5;
      } else if (particlePhase.current === 'dissolving') {
        if (!system.hasEffectOrigin) {
          effectOrigins.set(positions);
          system.hasEffectOrigin = true;
        }

        const spread = ease(dissolveProgress);
        for (let particle = 0; particle < vertexIndices.length; particle += 1) {
          const index = particle * 3;
          const scatterDistance = scatterDistances[particle] * spread;
          for (let axis = 0; axis < 3; axis += 1) {
            positions[index + axis] =
              effectOrigins[index + axis] +
              scatterDirections[index + axis] * scatterDistance;
          }
        }
        cloudPositions.set(positions);
        (points.material as THREE.PointsMaterial).opacity = 0.9 - spread * 0.28;
        (points.material as THREE.PointsMaterial).size = 3 + spread * 1.2;
      } else if (particlePhase.current === 'cloud') {
        positions.set(cloudPositions);
        (points.material as THREE.PointsMaterial).opacity = 0.62;
        (points.material as THREE.PointsMaterial).size = 4.2;
      } else {
        const reassembly = ease(assemblyProgress);
        for (let particle = 0; particle < vertexIndices.length; particle += 1) {
          const index = particle * 3;
          for (let axis = 0; axis < 3; axis += 1) {
            positions[index + axis] = THREE.MathUtils.lerp(
              cloudPositions[index + axis],
              positions[index + axis],
              reassembly
            );
          }
        }

        (points.material as THREE.PointsMaterial).opacity = 0.62 + reassembly * 0.28;
        (points.material as THREE.PointsMaterial).size = 4.2 - reassembly * 1.2;
      }

      (points.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    });

    group.current?.updateMatrixWorld(true);
    const floorY = 0.45;
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

      if (action) {
        const landingStart = duration * 0.88;

        if (
          animationTime >= landingStart &&
          previousAnimationTime.current < landingStart
        ) {
          footPulse.current.left = 1;
          footPulse.current.right = 1;
          contacts.current.left.w = 1;
          contacts.current.right.w = 1;
        }
      }
    }
    previousAnimationTime.current = animationTime;
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
