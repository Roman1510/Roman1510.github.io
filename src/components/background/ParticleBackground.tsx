import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import particle from '@/assets/particle-min.png'

const ParticleBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mouseX = useRef<number>(0);
  const mouseY = useRef<number>(0);
  const mouseMoving = useRef<boolean>(false);
  const mouseClick = useRef<boolean>(false);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const particles = useRef<THREE.Group | null>(null);

  const MAX_MOUSE_MOVE = 0.1;
  const MOUSE_MOVE_THRESHOLD = 0.0001;

  useEffect(() => {
    const scene = new THREE.Scene();
    camera.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.current.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);

    const particleCount = 260;
    particles.current = new THREE.Group();

    const textureLoader = new THREE.TextureLoader();
    const particleTexture = textureLoader.load(particle);

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
      size: 0.055,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    particles.current.add(particleSystem);

    scene.add(particles.current);

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
    const simulateInitialMouseMove = () => {
      const initialMouseMoveEvent = new MouseEvent('mousemove', {
        clientX: window.innerWidth / 2,  // Initial X position
        clientY: window.innerHeight / 2, // Initial Y position
      });
      handleMouseMove(initialMouseMoveEvent);
    };

    // Call the function to simulate the initial mouse position
    simulateInitialMouseMove();
    const handleMouseStop = () => {
      if (!mouseClick.current) {
        mouseMoving.current = false;
      }
      mouseClick.current = false;
    };

    const updateParticleRotation = () => {
      if (!mouseMoving.current) {
        if (particles.current && (Math.abs(particles.current.rotation.x) > MOUSE_MOVE_THRESHOLD || Math.abs(particles.current.rotation.y) > MOUSE_MOVE_THRESHOLD)) {
          if (particles.current.rotation.x) particles.current.rotation.x *= 0.55;
          if (particles.current.rotation.y) particles.current.rotation.y *= 0.55;
        }
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);


      if (camera.current) {
        camera.current.position.x += (mouseX.current * 5 - camera.current.position.x) * 0.05;
        camera.current.position.y += (-mouseY.current * 5 - camera.current.position.y) * 0.05;


        if (camera.current) camera.current.lookAt(scene.position);

        updateParticleRotation();


        if (mouseMoving.current || (particles.current && (Math.abs(particles.current.rotation.x) > MOUSE_MOVE_THRESHOLD || Math.abs(particles.current.rotation.y) > MOUSE_MOVE_THRESHOLD))) {
          renderer.render(scene, camera.current);
        }
      }
    };

    animate();

    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;

      if (camera.current) {
        camera.current.aspect = newWidth / newHeight;
        camera.current.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);


    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseStop);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    // GSAP 
    const particlesCurrent = particles.current;
    const initialRotation = { x: -0.5, y: -0.5 };

    if (particlesCurrent) {
      gsap.set(particlesCurrent.rotation, initialRotation); // Initial rotation

      // cosmic rotation animation
      gsap.from(camera.current!.position, {
        z: 20, // start posetion
        duration: 3,
        ease: 'power1.inOut',
        onComplete: () => {
          const animateCosmic = () => {
            gsap.to(particlesCurrent.rotation, {
              x: initialRotation.x + 0.001,
              y: initialRotation.y + 0.001,
              ease: 'power1.out',
              onComplete: animateCosmic,
            });
          };
          animateCosmic();
        },
      });
    }
  }, []);

  const containerStyle: React.CSSProperties = {
    zIndex: -1,
  };

  return <div ref={containerRef} style={containerStyle} />;
};

export default ParticleBackground;
