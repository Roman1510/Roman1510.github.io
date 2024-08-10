import React, { useEffect, useRef } from 'react'

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rainDropsRef = useRef<number[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const katakana =
      '᨟ཫᨕᨐᨂᨁ アイウエオカキクケコлサシЪスセソタチツテ日トナニヌネノハヒフヘホマ 012з45789 ミムメモヤｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝЙ ユヨラリルレロワヲンアウエオカキケコサシスセソタツテナニヌネハヒホマミムメモヤヨラリ'
    const latin = katakana.split('')

    const fontSize = 19
    let columns = Math.floor(canvas.width / fontSize)
    rainDropsRef.current = Array(columns).fill(1)

    const resizeCanvas = () => {
      const newColumns = Math.floor(canvas.clientWidth / fontSize)
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      if (newColumns > rainDropsRef.current.length) {
        rainDropsRef.current.push(
          ...Array(newColumns - rainDropsRef.current.length).fill(1)
        )
      } else {
        rainDropsRef.current.length = newColumns
      }
    }

    resizeCanvas()

    const draw = () => {
      context.fillStyle = 'rgba(83, 43, 136, 0.21)'
      context.fillRect(0, 0, canvas.width, canvas.height)

      context.fillStyle = '#9fffcb'
      context.font = `${fontSize}px monospace`

      for (let i = 0; i < rainDropsRef.current.length; i++) {
        const text = latin[Math.floor(Math.random() * latin.length)]

        const x = i * fontSize
        const y = rainDropsRef.current[i] * fontSize

        context.fillText(text, x, y)

        if (y > canvas.height && Math.random() > 0.975) {
          rainDropsRef.current[i] = 0
        }
        rainDropsRef.current[i]++
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
