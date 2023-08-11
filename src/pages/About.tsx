import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const About: React.FC = () => {
  const squaresRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const tl = gsap.timeline();

    squaresRef.current.forEach((square, index) => {
      const startPos = index % 2 === 0 ? -100 : window.innerWidth + 100;
      tl.from(square, {
        x: startPos,
        opacity: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });
    });

    gsap.set(squaresRef.current, { opacity: 0, x: 0 });

    tl.play();
  }, []);

  const handleHover = (square: HTMLDivElement) => {
    gsap.to(square, {
      scale: 1.05,
      boxShadow: '0 0 10px rgba(137, 134, 87, 0.617)',
      duration: 0.1,
    });
  };

  const handleHoverEnd = (square: HTMLDivElement) => {
    gsap.to(square, {
      scale: 1,
      boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
      duration: 0.1,
    });
  };

  return (
    <div className="hero-section bg-indigo-900 bg-opacity-50 text-white h-screen flex flex-col justify-center items-center absolute inset-0">
      <div className="max-w-screen-lg mx-auto px-4">
        <p className="text-white text-lg text-center">
          'Sup! so this is what I actually do on a daily basis:
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div
            ref={(el) => (squaresRef.current[0] = el!)}
            className="bg-yellow-300 rounded-lg p-4 text-center transition-transform transform"
            onMouseEnter={() => handleHover(squaresRef.current[0]!)}
            onMouseLeave={() => handleHoverEnd(squaresRef.current[0]!)}
          >
            <h2 className="text-indigo-900 text-xl font-semibold mb-2">Responsive Design</h2>
            <p className="text-gray-700">
              Creating beautiful, user-friendly websites that work seamlessly across all devices.
            </p>
          </div>
          <div
            ref={(el) => (squaresRef.current[1] = el!)}
            className="bg-white rounded-lg p-4 text-center transition-transform transform"
            onMouseEnter={() => handleHover(squaresRef.current[1]!)}
            onMouseLeave={() => handleHoverEnd(squaresRef.current[1]!)}
          >
            <h2 className="text-indigo-900 text-xl font-semibold mb-2">Frontend Development</h2>
            <p className="text-gray-700">
              Building interactive and dynamic web applications using the latest frontend technologies.
            </p>
          </div>
          <div
            ref={(el) => (squaresRef.current[2] = el!)}
            className="bg-yellow-300 rounded-lg p-4 text-center transition-transform transform"
            onMouseEnter={() => handleHover(squaresRef.current[2]!)}
            onMouseLeave={() => handleHoverEnd(squaresRef.current[2]!)}
          >
            <h2 className="text-indigo-900 text-xl font-semibold mb-2">Full Stack Solutions</h2>
            <p className="text-gray-700">
              Developing end-to-end solutions, from concept to deployment, with a focus on performance and security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
