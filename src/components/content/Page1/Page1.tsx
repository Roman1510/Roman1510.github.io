import { CSSProperties, useEffect, useRef, useState } from 'react';
import { MatrixRain } from './MatrixRain';
import { useDeviceType } from '@/hooks/useDeviceType';

export const Page1 = () => {
  const [isVisible, setIsVisible] = useState(true);
  const matrixRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const titleContainerRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const deviceType = useDeviceType();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting !== isVisible) {
          setIsVisible(entry.isIntersecting);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.4,
      }
    );

    observerRef.current = observer;

    if (matrixRef.current) {
      observer.observe(matrixRef.current);
    }

    const handleResize = () => {
      if (matrixRef.current && observerRef.current) {
        observerRef.current.unobserve(matrixRef.current);
        observerRef.current.observe(matrixRef.current);
      }
    };

    if (matrixRef.current) {
      observer.observe(matrixRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      if (matrixRef.current && observerRef.current) {
        observerRef.current.unobserve(matrixRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [deviceType, isVisible]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (titleRef.current && titleContainerRef.current) {
        const { width, height, top, left } =
          titleContainerRef.current.getBoundingClientRect();
        const xAxis = (width / 2 - (e.clientX - left)) / 50;
        const yAxis = (height / 2 - (e.clientY - top)) / 50;
        titleRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
      }
    };

    const handleMouseLeave = () => {
      if (titleRef.current) {
        titleRef.current.style.transform = 'rotateY(0deg) rotateX(0deg)';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="section" style={styles.container}>
      <div
        className="title-container"
        ref={titleContainerRef}
        style={styles.titleContainer}
      >
        <div className="title" ref={titleRef}>
          {'Roman1510github.io'.split('').map((char, index) => (
            <span key={index} data-text={char}>
              {char}
            </span>
          ))}
        </div>
      </div>
      <div style={styles.wrapper} ref={matrixRef}>
        {isVisible && matrixRef.current && <MatrixRain />}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#532b88',
    margin: 0,
    padding: 0,
    position: 'relative',
  } as CSSProperties,

  titleContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 11,
    cursor: 'default',
    userSelect: 'none',
  } as CSSProperties,

  wrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  } as CSSProperties,
};
