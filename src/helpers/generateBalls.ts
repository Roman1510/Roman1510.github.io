const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const getRandomPosition = () => {
  const x = (Math.random() - 0.5) * 10
  const y = Math.random() * 4 + 1
  const z = 0
  return [x, y, z] as [number, number, number]
}

const balls: { position: [number, number, number]; color: string }[] =
  Array.from({ length: 40 }, () => ({
    position: getRandomPosition(),
    color: getRandomColor(),
  }))

export default balls
