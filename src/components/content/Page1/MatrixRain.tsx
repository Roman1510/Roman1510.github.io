import React, { useEffect, useRef } from 'react'

export const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rainDropsRef = useRef<number[]>([])
  const redSymbolsRef = useRef<Set<string>>(new Set())
  const currentSymbolIndexRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const katakana =
      '᨟ཫᨕᨂᨁ アイウエオカキクケコлサシЪスセソタチツテ日トナニヌネノハヒフヘホマ012з45789ミムメモヤｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝЙ ユヨラリルレロワヲンアウエオカキケコサシスセソタツテナニヌネハヒホマミムメモヤヨラリ'
    const latin = katakana.split('')

    const fontSize = 13
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

      // context.font = `${fontSize}px 'MatrixCode'`

      for (let i = 0; i < rainDropsRef.current.length; i++) {
        const text = latin[Math.floor(Math.random() * latin.length)]

        const x = i * fontSize
        const y = rainDropsRef.current[i] * fontSize

        context.save()
        context.translate(x, y)
        context.rotate(Math.PI)

        const row = Math.floor(y / fontSize)
        const symbolKey = `${i}-${row}`

        if (redSymbolsRef.current.has(symbolKey)) {
          context.fillStyle = '#ff0000'
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
    }

    const intervalId = setInterval(draw, 67)

    const handleResize = () => {
      resizeCanvas()
    }

    const handleClick = () => {
      const rows = Math.floor(canvas.height / fontSize)
      for (let j = 0; j < latin.length; j++) {
        if (
          currentSymbolIndexRef.current <
          rainDropsRef.current.length * rows
        ) {
          const column = Math.floor(currentSymbolIndexRef.current / rows)
          const row = currentSymbolIndexRef.current % rows

          const symbolKey = `${column}-${row}`
          redSymbolsRef.current.add(symbolKey)
          currentSymbolIndexRef.current++
        } else {
          console.log('glitch')
          break
        }
      }
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('click', handleClick)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('click', handleClick)
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
