import React, { useEffect, useRef, useState } from 'react'

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rainDropsRef = useRef<number[]>([])
  const glitchEffectRef = useRef<{
    x: number
    y: number
    radius: number
    active: boolean
  }>({ x: 0, y: 0, radius: 0, active: false })
  const [glitchColor, setGlitchColor] = useState<string>('#ff0000') // Red color for glitch effect

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

      for (let i = 0; i < rainDropsRef.current.length; i++) {
        const text = latin[Math.floor(Math.random() * latin.length)]

        const x = i * fontSize
        const y = rainDropsRef.current[i] * fontSize

        context.save()

        context.translate(x, y)

        context.rotate(Math.PI) // Rotate by 180 degrees

        const distance = Math.hypot(
          x - glitchEffectRef.current.x,
          y - glitchEffectRef.current.y
        )

        if (
          glitchEffectRef.current.active &&
          distance < glitchEffectRef.current.radius
        ) {
          context.fillStyle = glitchColor
        } else {
          context.fillStyle = '#9fffcb'
        }

        context.fillText(text, 0, 0)

        context.restore()

        if (y > canvas.height && Math.random() > 0.975) {
          rainDropsRef.current[i] = 0
        }
        rainDropsRef.current[i]++
      }

      if (glitchEffectRef.current.active) {
        glitchEffectRef.current.radius += 10
        if (glitchEffectRef.current.radius > canvas.width) {
          glitchEffectRef.current.active = false
        }
      }
    }

    const intervalId = setInterval(draw, 60)

    const handleResize = () => {
      resizeCanvas()
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      glitchEffectRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        active: true,
      }

      // Randomize glitch color for a more dynamic effect
      setGlitchColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)

      setTimeout(() => {
        glitchEffectRef.current.active = false
      }, 300) // Glitch effect lasts for 300ms
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('click', handleClick)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('click', handleClick)
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
