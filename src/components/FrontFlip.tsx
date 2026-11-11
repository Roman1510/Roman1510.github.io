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
  onReady?: () => void;
  position?: [number, number, number];
  rotation?: [number, number, number];
  contacts: React.MutableRefObject<FootContacts>;
}

interface ParticleSystem {
  source: THREE.SkinnedMesh;
  points: THREE.Points;
  material: THREE.ShaderMaterial;
  vertexIndices: Uint32Array;
  positions: Float32Array;
  effectOrigins: Float32Array;
  cloudPositions: Float32Array;
  scatterDirections: Float32Array;
  scatterDistances: Float32Array;
  cloudDrift: Float32Array;
  cloudPhases: Float32Array;
  vertex: THREE.Vector3;
  hasEffectOrigin: boolean;
}

interface ArmTrail {
  bone: THREE.Bone;
  points: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  positions: Float32Array;
  timestamps: Float32Array;
  count: number;
  nextSampleAt: number;
  position: THREE.Vector3;
}

const MAX_PARTICLES_PER_MESH = 1500;
const ARM_TRAIL_CAPACITY = 36;
const ARM_TRAIL_SAMPLE_INTERVAL = 0.022;
const ARM_TRAIL_LIFETIME = 0.58;
const PARTICLE_COLORS = [0xffe9a6, 0xffc85c];
const ARM_TRAIL_COLORS = [0xb895ff, 0xffc875];
const DISSOLVE_START = 0.78;
const DISSOLVE_FADE_START = 0.28;
const CLOUD_START = 0.94;
const ASSEMBLY_END = 0.22;
const CLOUD_RADIUS_MIN = 72;
const CLOUD_RADIUS_RANGE = 144;
const CLOUD_DRIFT_MIN = 10;
const CLOUD_DRIFT_RANGE = 26;
const NORMAL_ANIMATION_SPEED = 0.76;
const SLOW_MOTION_ANIMATION_SPEED = 0.0132;

const particleVertexShader = `
  uniform float uSize;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize;
  }
`;

const particleFragmentShader = `
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
    float alpha = 1.0 - smoothstep(0.38, 0.5, distanceFromCenter);
    gl_FragColor = vec4(uColor, uOpacity * alpha);
  }
`;

const armTrailVertexShader = `
  attribute float aAlpha;
  uniform float uSize;
  varying float vAlpha;

  void main() {
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = uSize * (0.55 + aAlpha * 0.8);
    vAlpha = aAlpha;
  }
`;

const armTrailFragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
    float glow = 1.0 - smoothstep(0.08, 0.5, distanceFromCenter);
    gl_FragColor = vec4(uColor, vAlpha * glow * 0.82);
  }
`;

type ParticlePhase = 'character' | 'dissolving' | 'cloud' | 'assembling';

const random01 = (seed: number) => {
  const value = Math.sin(seed * 127.1) * 43758.5453;
  return value - Math.floor(value);
};

export function FrontFlip({
  isPlaying = true,
  isSlowMotion = false,
  onReady,
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
  const armBones = useRef<{ left: THREE.Bone | null; right: THREE.Bone | null }>({
    left: null,
    right: null,
  });
  const armTrails = useRef<ArmTrail[]>([]);
  const footBones = useRef<{ left: THREE.Bone | null; right: THREE.Bone | null }>({
    left: null,
    right: null,
  });
  const previousFootContact = useRef({ left: 0, right: 0 });
  const footPulse = useRef({ left: 0, right: 0 });
  const previousAnimationTime = useRef(0);
  const particleElapsedTime = useRef(0);
  const particlePhase = useRef<ParticlePhase>('character');
  const animationSpeed = useRef(NORMAL_ANIMATION_SPEED);
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
      } else if (object.name.endsWith('LeftHand')) {
        armBones.current.left = object as THREE.Bone;
      } else if (object.name.endsWith('RightHand')) {
        armBones.current.right = object as THREE.Bone;
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
      const speed = isSlowMotion
        ? SLOW_MOTION_ANIMATION_SPEED
        : NORMAL_ANIMATION_SPEED;
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
      const cloudDrift = new Float32Array(vertexIndices.length * 3);
      const cloudPhases = new Float32Array(vertexIndices.length);

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

        const driftVertical = random01(particle + color + 3) * 2 - 1;
        const driftAngle = random01(particle + color + 4) * Math.PI * 2;
        const driftHorizontal = Math.sqrt(1 - driftVertical * driftVertical);
        const driftMagnitude =
          CLOUD_DRIFT_MIN + random01(particle + color + 5) * CLOUD_DRIFT_RANGE;
        cloudDrift[particle * 3] =
          driftHorizontal * Math.cos(driftAngle) * driftMagnitude;
        cloudDrift[particle * 3 + 1] = driftVertical * driftMagnitude;
        cloudDrift[particle * 3 + 2] =
          driftHorizontal * Math.sin(driftAngle) * driftMagnitude;
        cloudPhases[particle] = random01(particle + color + 6) * Math.PI * 2;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
      );
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: 0.9 },
          uSize: { value: 2.8 },
        },
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
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
        material,
        vertexIndices,
        positions,
        effectOrigins,
        cloudPositions,
        scatterDirections,
        scatterDistances,
        cloudDrift,
        cloudPhases,
        vertex: new THREE.Vector3(),
        hasEffectOrigin: false,
      });
    });

    particleSystems.current = systems;
    onReady?.();

    return () => {
      systems.forEach(({ source, points }) => {
        source.parent?.remove(points);
        points.geometry.dispose();
        (points.material as THREE.Material).dispose();
        source.visible = true;
      });
      particleSystems.current = [];
    };
  }, [nodes, onReady]);

  useEffect(() => {
    const characterGroup = group.current;
    if (!characterGroup) return;

    const trails: ArmTrail[] = [];
    [armBones.current.left, armBones.current.right].forEach((bone, index) => {
      if (!bone) return;

      const positions = new Float32Array(ARM_TRAIL_CAPACITY * 3);
      const alphas = new Float32Array(ARM_TRAIL_CAPACITY);
      const timestamps = new Float32Array(ARM_TRAIL_CAPACITY);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
      );
      geometry.setAttribute(
        'aAlpha',
        new THREE.BufferAttribute(alphas, 1).setUsage(THREE.DynamicDrawUsage)
      );
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color(ARM_TRAIL_COLORS[index]) },
          uSize: { value: 13 },
        },
        vertexShader: armTrailVertexShader,
        fragmentShader: armTrailFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      });
      const points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      characterGroup.add(points);
      trails.push({
        bone,
        points,
        positions,
        timestamps,
        count: 0,
        nextSampleAt: 0,
        position: new THREE.Vector3(),
      });
    });

    armTrails.current = trails;

    return () => {
      trails.forEach(({ points }) => {
        characterGroup.remove(points);
        points.geometry.dispose();
        points.material.dispose();
      });
      armTrails.current = [];
    };
  }, [nodes]);

  useFrame(({ clock }, delta) => {
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

    const speed = isSlowMotion
      ? SLOW_MOTION_ANIMATION_SPEED
      : NORMAL_ANIMATION_SPEED;
    if (action && animationSpeed.current !== speed) {
      action.setEffectiveTimeScale(speed);
      animationSpeed.current = speed;
    }
    particleElapsedTime.current +=
      delta * (isSlowMotion ? SLOW_MOTION_ANIMATION_SPEED / NORMAL_ANIMATION_SPEED : 1);

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
    const cloudTime = particleElapsedTime.current;

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
        cloudDrift,
        cloudPhases,
        material,
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
        material.uniforms.uOpacity.value = 0.9;
        material.uniforms.uSize.value = 2.8;
      } else if (particlePhase.current === 'dissolving') {
        if (!system.hasEffectOrigin) {
          effectOrigins.set(positions);
          system.hasEffectOrigin = true;
        }

        const spread = ease(dissolveProgress);
        const fadeProgress = ease(
          THREE.MathUtils.clamp(
            (dissolveProgress - DISSOLVE_FADE_START) / (1 - DISSOLVE_FADE_START),
            0,
            1
          )
        );
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
        material.uniforms.uOpacity.value = 0.9 * (1 - fadeProgress);
        material.uniforms.uSize.value = 2.8 + spread * 0.6;
      } else if (particlePhase.current === 'cloud') {
        for (let particle = 0; particle < vertexIndices.length; particle += 1) {
          const index = particle * 3;
          const drift =
            Math.sin(cloudTime * 1.8 + cloudPhases[particle]) * 0.72 +
            Math.sin(cloudTime * 0.95 + cloudPhases[particle] * 1.7) * 0.28;
          for (let axis = 0; axis < 3; axis += 1) {
            positions[index + axis] =
              cloudPositions[index + axis] + cloudDrift[index + axis] * drift;
          }
        }
        material.uniforms.uOpacity.value = 0;
        material.uniforms.uSize.value = 3.4;
      } else {
        const reassembly = ease(assemblyProgress);
        for (let particle = 0; particle < vertexIndices.length; particle += 1) {
          const index = particle * 3;
          const drift =
            Math.sin(cloudTime * 1.8 + cloudPhases[particle]) * 0.72 +
            Math.sin(cloudTime * 0.95 + cloudPhases[particle] * 1.7) * 0.28;
          for (let axis = 0; axis < 3; axis += 1) {
            positions[index + axis] = THREE.MathUtils.lerp(
              cloudPositions[index + axis] + cloudDrift[index + axis] * drift,
              positions[index + axis],
              reassembly
            );
          }
        }

        material.uniforms.uOpacity.value = 0.9 * reassembly;
        material.uniforms.uSize.value = 3.4 - reassembly * 0.6;
      }

      (points.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
    });

    group.current?.updateMatrixWorld(true);
    const trailTime = clock.elapsedTime;
    const characterGroup = group.current;
    if (characterGroup) {
      armTrails.current.forEach((trail) => {
        if (
          particlePhase.current === 'character' &&
          trailTime >= trail.nextSampleAt
        ) {
          trail.bone.getWorldPosition(trail.position);
          characterGroup.worldToLocal(trail.position);

          if (trail.count === ARM_TRAIL_CAPACITY) {
            trail.positions.copyWithin(0, 3);
            trail.timestamps.copyWithin(0, 1);
            trail.count -= 1;
          }

          const index = trail.count;
          trail.positions[index * 3] = trail.position.x;
          trail.positions[index * 3 + 1] = trail.position.y;
          trail.positions[index * 3 + 2] = trail.position.z;
          trail.timestamps[index] = trailTime;
          trail.count += 1;
          trail.nextSampleAt = trailTime + ARM_TRAIL_SAMPLE_INTERVAL;
        }

        const alphas = trail.points.geometry.getAttribute('aAlpha') as THREE.BufferAttribute;
        for (let index = 0; index < trail.count; index += 1) {
          const age = trailTime - trail.timestamps[index];
          alphas.setX(index, THREE.MathUtils.clamp(1 - age / ARM_TRAIL_LIFETIME, 0, 1));
        }
        (trail.points.geometry.getAttribute('position') as THREE.BufferAttribute).needsUpdate = true;
        alphas.needsUpdate = true;
      });
    }

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
