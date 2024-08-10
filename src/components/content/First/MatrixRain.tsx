import React, { useEffect, useRef } from 'react'

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const katakana =
      'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const latin = katakana.split('')

    const fontSize = 16
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    resizeCanvas()

    let columns = Math.floor(canvas.width / fontSize)
    const rainDrops = Array(columns).fill(1)

    const draw = () => {
      context.fillStyle = 'rgba(155, 114, 207, 0.1)'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.fillStyle = '#0F0'
      context.font = `${fontSize}px monospace`

      for (let i = 0; i < rainDrops.length; i++) {
        const text = latin[Math.floor(Math.random() * latin.length)]

        context.save()

        const x = i * fontSize
        const y = rainDrops[i] * fontSize

        context.translate(x + fontSize / 2, y + fontSize / 2)
        context.rotate(Math.PI)
        context.translate(-fontSize / 2, -fontSize / 2)

        context.fillText(text, 0, 0)

        context.restore()

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0
        }
        rainDrops[i]++
      }
    }

    const intervalId = setInterval(draw, 30)

    const handleResize = () => {
      resizeCanvas()

      columns = Math.floor(canvas.width / fontSize)
      rainDrops.length = columns
      rainDrops.fill(1)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />
    </div>
  )
}

const styles = {
  container: {
    width: '40rem',
    height: '40rem',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: '#9b72cf',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  canvas: {
    width: '100%',
    height: '110%',
  } as React.CSSProperties,
}
