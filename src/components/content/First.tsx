import React, { useEffect, useRef, useState } from 'react'
import { MatrixRain } from './First/MatrixRain'

export const First = () => {
  const [isVisible, setIsVisible] = useState(false)
  const matrixRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.7,
      }
    )

    if (matrixRef.current) {
      observer.observe(matrixRef.current)
    }

    return () => {
      if (matrixRef.current) {
        observer.unobserve(matrixRef.current)
      }
    }
  }, [])

  return (
    <div className="section" style={styles.container}>
      <div className="title" style={styles.title}>
        <p>Roman Vinnick</p>
      </div>
      <div style={styles.wrapper} ref={matrixRef}>
        {isVisible && <MatrixRain />}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#532b88',
    margin: 0,
    padding: 0,
  } as React.CSSProperties,

  title: {
    padding: '1rem',
    position: 'absolute',
    color: '#fff',
    fontSize: '5rem',
    zIndex: '11',
  } as React.CSSProperties,

  wrapper: {
    width: '50rem',
    height: '50rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '10',
  } as React.CSSProperties,
}
