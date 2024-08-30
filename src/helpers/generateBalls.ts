const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const getRandomPosition = () => {
  const x = Math.random() * 1
  const y = Math.random() * 12 + 4
  const z = 0
  return [x, y, z] as [number, number, number]
}

const balls: { position: [number, number, number]; color: string }[] =
  Array.from({ length: 21 }, () => ({
    position: getRandomPosition(),
    color: getRandomColor(),
  }))

export default balls
