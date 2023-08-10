import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseX = useRef<number>(0);
  const mouseY = useRef<number>(0);
  const mouseMoving = useRef<boolean>(false); // Track if the mouse is moving
  const mouseClick = useRef<boolean>(false); // Track if a click occurred

  const MAX_MOUSE_MOVE = 0.1;
  const MOUSE_MOVE_THRESHOLD = 0.0001; // Set a small threshold for mouse movement

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);

    const particleCount = 400;
    const particles = new THREE.Group();

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load('../../public/particle.png');

    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 10;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 10;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.04,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    particles.add(particleSystem);

    scene.add(particles);

    const handleMouseMove = (event: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      mouseX.current = (event.clientX - windowHalfX) / windowHalfX;
      mouseY.current = (event.clientY - windowHalfY) / windowHalfY;

      // Limit the maximum movement
      mouseX.current = Math.min(Math.max(mouseX.current, -MAX_MOUSE_MOVE), MAX_MOUSE_MOVE);
      mouseY.current = Math.min(Math.max(mouseY.current, -MAX_MOUSE_MOVE), MAX_MOUSE_MOVE);

      // Mark the mouse as moving
      mouseMoving.current = true;
    };

    const handleMouseStop = () => {
      // Mark the mouse as stopped, but check if a click occurred
      if (!mouseClick.current) {
        mouseMoving.current = false;
      }
      mouseClick.current = false;
    };



    const updateParticleRotation = () => {
      if (mouseMoving.current) {
        particles.rotation.x = mouseY.current * 0.1;
        particles.rotation.y = mouseX.current * 0.1;
      } else if (Math.abs(particles.rotation.x) > MOUSE_MOVE_THRESHOLD || Math.abs(particles.rotation.y) > MOUSE_MOVE_THRESHOLD) {
        // Gradually reduce particle rotation when the mouse stops and the rotation is above the threshold
        particles.rotation.x *= 0.55;
        particles.rotation.y *= 0.55;
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);

      // Update camera position based on mouse position
      camera.position.x += (mouseX.current * 5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY.current * 5 - camera.position.y) * 0.05;

      // Look at the center of the scene
      camera.lookAt(scene.position);

      updateParticleRotation();

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseStop);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseStop);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  const containerStyle: React.CSSProperties = {
    zIndex: -1,
  };

  return <div ref={containerRef} style={containerStyle} />;
};

export default ParticleBackground;
