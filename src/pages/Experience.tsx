import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const Experience: React.FC = () => {
  const projectsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const tl = gsap.timeline();
    // using random in gsap to 'dance'
    projectsRef.current.forEach((project, index) => {
      if (project) {
        const startPosX = gsap.utils.random(-50, window.innerWidth + 50);
        const startPosY = gsap.utils.random(-50, window.innerHeight + 50);
        const startRotation = gsap.utils.random(-180, 180);

        tl.from(project, {
          x: startPosX,
          y: startPosY,
          rotation: startRotation,
          opacity: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.5)',
          delay: 0.1 * index,
        });
      }
    });
    // just putting all to 0
    gsap.set(projectsRef.current.filter((project) => project), {
      opacity: 0,
      x: 0,
      y: 0,
    });
    // i put the tiles on page here
    tl.play();
  }, []);

  const cleanAnimation = () => {
    projectsRef.current.forEach((project, index) => {
      if (project) {
        gsap.to(project, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.1 * index, // delay for smooth reset (important)
        });
      }
    });
  };

  return (
    <div className="hero-section bg-indigo-900 bg-opacity-50 text-white h-screen flex flex-col justify-center items-center absolute inset-0">
      <div className="max-w-screen-lg mx-auto px-4">
        <p className="text-white text-lg text-center">
          'Sup! Here's a glimpse of my project experiences:
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              ref={(el) => (projectsRef.current[index] = el)}
              className="bg-yellow-300 rounded-lg p-2 text-center transition-transform transform"
            >
              <h2 className="text-indigo-900 text-lg font-semibold mb-2">Project {String.fromCharCode(65 + index)}</h2>
              <p className="text-gray-700">
                Placeholder description for Project {String.fromCharCode(65 + index)}.
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={cleanAnimation}
          className="mt-8 bg-indigo-500 hover:bg-indigo-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          C'mon! Fix it!
        </button>
      </div>
    </div>
  );
};

export default Experience;
