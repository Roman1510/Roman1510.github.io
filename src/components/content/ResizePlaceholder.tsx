import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

const ResizePlaceholder: React.FC = () => {
  const [isResizing, setIsResizing] = useState(false)
  const emojiRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const handleResize = () => {
      setIsResizing(true)

      clearTimeout(timeoutId)

      timeoutId = setTimeout(() => {
        setIsResizing(false)
      }, 1000)
    }

    window.addEventListener('resize', handleResize)

    if (emojiRef.current) {
      gsap.to(emojiRef.current, {
        rotation: 360,
        repeat: -1,
        ease: 'linear',
        duration: 1.5,
      })
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  if (!isResizing) return null

  return (
    <div style={styles.container}>
      <div style={styles.text}>
        <span
          role="img"
          aria-label="Smiley face"
          style={styles.emoji}
          ref={emojiRef}
        >
          😊
        </span>
        Resizing is being applied
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, purple, green)',
    zIndex: 9999,
    pointerEvents: 'none',
  } as React.CSSProperties,
  text: {
    fontSize: '24px',
    color: 'white',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  emoji: {
    fontSize: '40px',
    marginRight: '10px',
  } as React.CSSProperties,
}

export default ResizePlaceholder
