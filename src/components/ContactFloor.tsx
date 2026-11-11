import { useFrame } from '@react-three/fiber';
import { useMemo, type MutableRefObject } from 'react';
import * as THREE from 'three';

export interface FootContacts {
  left: THREE.Vector4;
  right: THREE.Vector4;
}

interface ContactFloorProps {
  contacts: MutableRefObject<FootContacts>;
}

const vertexShader = `
  varying vec3 vWorldPosition;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform vec4 uLeftContact;
  uniform vec4 uRightContact;
  varying vec3 vWorldPosition;

  float contactGlow(vec4 contact, vec2 worldPosition) {
    float distanceToContact = distance(worldPosition, contact.xy);
    float core = exp(-distanceToContact * distanceToContact * 38.0);
    float ringRadius = 0.12 + (1.0 - contact.w) * 0.62;
    float ring = 1.0 - smoothstep(0.025, 0.09, abs(distanceToContact - ringRadius));
    float outerFlash = exp(-distanceToContact * distanceToContact * 8.0) * contact.w;
    return contact.z * core * 1.6
      + ring * contact.w * 2.5
      + outerFlash * contact.w * 1.4;
  }

  void main() {
    vec2 worldPosition = vWorldPosition.xz;
    float glow = contactGlow(uLeftContact, worldPosition)
      + contactGlow(uRightContact, worldPosition);
    vec3 purple = vec3(0.62, 0.24, 1.0);
    float alpha = clamp(glow, 0.0, 1.0);

    gl_FragColor = vec4(purple, alpha);
  }
`;

export const ContactFloor = ({ contacts }: ContactFloorProps) => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uLeftContact: { value: new THREE.Vector4() },
          uRightContact: { value: new THREE.Vector4() },
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    []
  );

  useFrame(() => {
    const { left, right } = contacts.current;
    material.uniforms.uLeftContact.value.copy(left);
    material.uniforms.uRightContact.value.copy(right);
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.45, 0]}>
      <planeGeometry args={[160, 160]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};
