import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { folder, useControls } from 'leva';
import { FrontFlip } from './FrontFlip';
import * as THREE from 'three';
import { MathUtils, Vector3, Vector4 } from 'three';
import { ContactFloor, type FootContacts } from './ContactFloor';

const MOTE_COUNT = 96;

const moteVertexShader = `
  attribute float aPhase;
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uSpeed;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec3 animatedPosition = position;
    float time = uTime * uSpeed;
    animatedPosition.x += sin(time * 0.7 + aPhase) * 0.12;
    animatedPosition.y += sin(time * 0.45 + aPhase * 1.8) * 0.18;
    animatedPosition.z += cos(time * 0.55 + aPhase) * 0.08;

    vec4 viewPosition = modelViewMatrix * vec4(animatedPosition, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    vTwinkle = 0.58 + 0.42 * sin(time * 1.8 + aPhase * 2.4);
    gl_PointSize = aSize * (0.82 + vTwinkle * 0.35);
    vColor = aColor;
  }
`;

const moteFragmentShader = `
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
    float glow = 1.0 - smoothstep(0.08, 0.5, distanceFromCenter);
    gl_FragColor = vec4(vColor, glow * vTwinkle * 0.42);
  }
`;

function AmbientMotes({ isSlowMotion }: { isSlowMotion: boolean }) {
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(MOTE_COUNT * 3);
    const phases = new Float32Array(MOTE_COUNT);
    const sizes = new Float32Array(MOTE_COUNT);
    const colors = new Float32Array(MOTE_COUNT * 3);
    const lavender = new Vector3(0.63, 0.44, 1);
    const warmGold = new Vector3(1, 0.69, 0.35);

    for (let index = 0; index < MOTE_COUNT; index += 1) {
      const offset = index * 3;
      const seed = index + 1;
      const random = (value: number) => {
        const result = Math.sin(value * 127.1) * 43758.5453;
        return result - Math.floor(result);
      };

      positions[offset] = -0.6 + (random(seed) - 0.5) * 7;
      positions[offset + 1] = 1.7 + (random(seed + 11) - 0.5) * 5.5;
      positions[offset + 2] = -3.3 + (random(seed + 23) - 0.5) * 2.4;
      phases[index] = random(seed + 37) * Math.PI * 2;
      sizes[index] = 2 + random(seed + 53) * 3;
      const color = random(seed + 71) > 0.78 ? warmGold : lavender;
      colors[offset] = color.x;
      colors[offset + 1] = color.y;
      colors[offset + 2] = color.z;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: 1 },
      },
      vertexShader: moteVertexShader,
      fragmentShader: moteFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      toneMapped: false,
    });

    return { geometry, material };
  }, []);

  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
    material.uniforms.uSpeed.value = isSlowMotion ? 0.16 : 1;
  });

  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

const CameraController = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const radius = 5.8;
  const target = useMemo(() => new Vector3(0, 1, -2), []);

  const handlePointerMove = (event: PointerEvent) => {
    if (event.pointerType === 'touch' && event.buttons === 0) return;
    setMousePosition({
      x: (event.clientX / window.innerWidth) * 2 - 1,
      y: (event.clientY / window.innerHeight) * 2 - 1,
    });
  };

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useFrame(({ camera }) => {
    const angleX = mousePosition.x * 0.14;
    const elevation = 0.24 - mousePosition.y * 0.08;

    camera.position.x = radius * Math.sin(angleX) * Math.cos(elevation);
    camera.position.z = target.z + radius * Math.cos(angleX) * Math.cos(elevation);
    camera.position.y = target.y + radius * Math.sin(elevation);

    camera.lookAt(target);
  });

  return null;
};

const FrontflipScene = ({ isSlowMotion }: { isSlowMotion: boolean }) => {
  const contacts = useRef<FootContacts>({
    left: new Vector4(-0.6, -3.3, 0, 0),
    right: new Vector4(-0.6, -3.3, 0, 0),
  });
  const character = useControls('Character', {
    Position: folder({
      positionX: { value: -0.6, min: -5, max: 5, step: 0.01 },
      positionY: { value: 0, min: -5, max: 5, step: 0.01 },
      positionZ: { value: -3.3, min: -5, max: 5, step: 0.01 },
    }),
    Rotation: folder({
      rotationX: { value: -11, min: -180, max: 180, step: 1 },
      rotationY: { value: 15, min: -180, max: 180, step: 1 },
      rotationZ: { value: 10, min: -180, max: 180, step: 1 },
    }),
  });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas camera={{ position: [0, 3.9, 5.75] }}>
        <CameraController />
        <Suspense fallback={null}>
          <AmbientMotes isSlowMotion={isSlowMotion} />
          <ContactFloor contacts={contacts} />
          <FrontFlip
            isPlaying
            isSlowMotion={isSlowMotion}
            contacts={contacts}
            position={[
              character.positionX,
              character.positionY,
              character.positionZ,
            ]}
            rotation={[
              MathUtils.degToRad(character.rotationX),
              MathUtils.degToRad(character.rotationY),
              MathUtils.degToRad(character.rotationZ),
            ]}
          />
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default FrontflipScene;
