import React, { useEffect, useRef } from 'react'

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rainDropsRef = useRef<number[]>([])
  const glitchSymbolsRef = useRef<
    { column: number; row: number; timer: number }[]
  >([])

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

        // Check if the current symbol is one of the glitch symbols
        const glitchSymbol = glitchSymbolsRef.current.find(
          (symbol) =>
            symbol.column === i && symbol.row === rainDropsRef.current[i]
        )

        if (glitchSymbol) {
          context.fillStyle = '#ff0000' // Red color for glitch effect
          glitchSymbol.timer--

          // Remove the symbol from glitchSymbolsRef after the timer is up
          if (glitchSymbol.timer <= 0) {
            glitchSymbolsRef.current = glitchSymbolsRef.current.filter(
              (symbol) => symbol !== glitchSymbol
            )
          }
        } else {
          context.fillStyle = '#9fffcb' // Normal color
        }

        context.fillText(text, 0, 0)
        context.restore()

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

    const handleClick = () => {
      const newGlitchSymbols = []

      for (let i = 0; i < 7; i++) {
        const randomColumn = Math.floor(Math.random() * columns)
        const randomRow = Math.floor(Math.random() * (canvas.height / fontSize))

        newGlitchSymbols.push({
          column: randomColumn,
          row: randomRow,
          timer: 60, // Show the red glitch effect for 1 second (60 frames)
        })
      }

      glitchSymbolsRef.current.push(...newGlitchSymbols)
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
