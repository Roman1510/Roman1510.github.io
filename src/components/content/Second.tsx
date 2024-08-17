import { useEffect, useRef, useState } from 'react'
import balls from '@/helpers/generateBalls'
import { Experience } from './Experience'
import useDeviceType from '@/hooks/useDeviceType'

export const Second = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const deviceType = useDeviceType()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting !== isVisible) {
          setIsVisible(entry.isIntersecting)
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.6,
      }
    )

    observerRef.current = observer

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    const handleResize = () => {
      if (sectionRef.current && observerRef.current) {
        observerRef.current.unobserve(sectionRef.current)
        observerRef.current.observe(sectionRef.current)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (sectionRef.current && observerRef.current) {
        observerRef.current.unobserve(sectionRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [deviceType, isVisible])

  return (
    <div
      className="section"
      ref={sectionRef}
      style={{ backgroundColor: '#9b72cf', height: '100vh' }}
    >
      {isVisible && (
        <div style={styles.wrapper}>
          <div style={styles.headerText}>
            <span className="title"> Hi there</span>
          </div>
          <Experience balls={balls} />
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
  } as React.CSSProperties,

  headerText: {
    position: 'absolute',
    top: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '64px',
    fontFamily: "'YourFontName', sans-serif",
    color: 'white',
    textAlign: 'center',
    userSelect: 'none',
    zIndex: 11,
  } as React.CSSProperties,
}
