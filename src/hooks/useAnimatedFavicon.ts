import { useEffect } from 'react'

export const useAnimatedFavicon = () => {
  useEffect(() => {
    const favicon = document.createElement('link')
    favicon.rel = 'icon'
    favicon.type = 'image/png'
    document.head.appendChild(favicon)

    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.width = 34
    canvas.height = 34

    let rotation = 0

    const drawCube = (rotation: number) => {
      if (!context) return

      context.clearRect(0, 0, canvas.width, canvas.height)

      context.fillStyle = '#4B0082'
      context.beginPath()
      context.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
        0,
        Math.PI * 2
      )
      context.fill()

      const size = 6
      const vertices = [
        { x: -size, y: -size, z: -size },
        { x: size, y: -size, z: -size },
        { x: size, y: size, z: -size },
        { x: -size, y: size, z: -size },
        { x: -size, y: -size, z: size },
        { x: size, y: -size, z: size },
        { x: size, y: size, z: size },
        { x: -size, y: size, z: size },
      ]

      const rotateX = (v: any, angle: number) => ({
        x: v.x,
        y: v.y * Math.cos(angle) - v.z * Math.sin(angle),
        z: v.y * Math.sin(angle) + v.z * Math.cos(angle),
      })

      const rotateY = (v: any, angle: number) => ({
        x: v.x * Math.cos(angle) + v.z * Math.sin(angle),
        y: v.y,
        z: -v.x * Math.sin(angle) + v.z * Math.cos(angle),
      })

      const rotateZ = (v: any, angle: number) => ({
        x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
        y: v.x * Math.sin(angle) + v.y * Math.cos(angle),
        z: v.z,
      })

      const project = (v: any) => ({
        x: v.x * (canvas.width / (canvas.width + v.z)) + canvas.width / 2,
        y: v.y * (canvas.height / (canvas.height + v.z)) + canvas.height / 2,
      })

      const rotatedVertices = vertices.map((v) =>
        project(rotateZ(rotateY(rotateX(v, rotation), rotation), rotation))
      )

      context.strokeStyle = '#00FF00'
      context.lineWidth = 1

      const edges = [
        [0, 1],
        [1, 2],
        [2, 3],
        [3, 0],
        [4, 5],
        [5, 6],
        [6, 7],
        [7, 4],
        [0, 4],
        [1, 5],
        [2, 6],
        [3, 7],
      ]

      edges.forEach(([start, end]) => {
        context.beginPath()
        context.moveTo(rotatedVertices[start].x, rotatedVertices[start].y)
        context.lineTo(rotatedVertices[end].x, rotatedVertices[end].y)
        context.stroke()
      })

      favicon.href = canvas.toDataURL()
    }

    const animate = () => {
      rotation += 0.02
      drawCube(rotation)
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      document.head.removeChild(favicon)
    }
  }, [])
}
