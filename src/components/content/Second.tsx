import { useEffect, useRef, useState } from 'react'
import balls from '@/helpers/generateBalls'
import { Experience } from './Experience'

export const Second = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
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
  }, [])

  return (
    <div
      className="section"
      ref={sectionRef}
      style={{ backgroundColor: '#9b72cf', height: '100vh' }}
    >
      {isVisible && (
        <div style={styles.wrapper}>
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
}
