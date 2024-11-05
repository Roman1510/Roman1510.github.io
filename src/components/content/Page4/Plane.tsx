import { shaderMaterial } from '@react-three/drei';
import { extend, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, AdditiveBlending } from 'three';

const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart: new Color('hotpink'),
    uColorEnd: new Color('white'),
  },

  `
    varying vec2 vUv;
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;
      gl_Position = projectionPosition;
      vUv = uv;
    }
  `,

  `
    uniform float uTime;
    uniform vec3 uColorStart;
    uniform vec3 uColorEnd;
    varying vec2 vUv;

    void main() {
      vec3 color = mix(uColorStart, uColorEnd, 0.5); // Simple color mixing
      gl_FragColor = vec4(color, 1.0); // Ensure full opacity
    }
  `
);

extend({ PortalMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      portalMaterial: any;
    }
  }
}

export const Plane = (props: any) => {
  const portalMaterial = useRef<THREE.ShaderMaterial>(null);
  useFrame((_state, delta) => {
    if (portalMaterial.current)
      portalMaterial.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh {...props}>
      <boxGeometry args={[5, 5, 5]} />
      <portalMaterial
        ref={portalMaterial}
        blending={AdditiveBlending}
        uColorStart="hotpink"
        uColorEnd="white"
      />
    </mesh>
  );
};
