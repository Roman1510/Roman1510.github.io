import React, { useEffect, useRef } from 'react'

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const katakana =
      'アイウエオカキクケコлサシЪスセソタチツテ日トナニヌネノハヒフヘホマ012з45789ミムメモヤｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝЙユヨラリルレロワヲン'
    const latin = katakana.split('')

    const fontSize = 19

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    resizeCanvas()

    let columns = Math.floor(canvas.width / fontSize)
    const rainDrops = Array(columns).fill(1)

    const draw = () => {
      context.fillStyle = 'rgba(83, 43, 136, 0.21)'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.fillStyle = '#9fffcb'
      context.font = `${fontSize}px monospace`

      for (let i = 0; i < rainDrops.length; i++) {
        const text = latin[Math.floor(Math.random() * latin.length)]

        context.save()

        const x = i * fontSize
        const y = rainDrops[i] * fontSize

        context.translate(x + fontSize / 2, y + fontSize / 2)
        context.rotate(-Math.PI / 2.1)
        context.translate(-fontSize / 2, -fontSize / 2)

        context.fillText(text, 0, 0)

        context.restore()

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0
        }
        rainDrops[i]++
      }
    }

    const intervalId = setInterval(draw, 60)

    const handleResize = () => {
      resizeCanvas()
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
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxSizing: 'border-box',
  } as React.CSSProperties,

  canvas: {
    width: '110%',
    height: '110%',
    backgroundColor: 'transparent',
  } as React.CSSProperties,
}
