import { CanvasTexture } from 'three'

export const generateEmojiTextures = (colors: string[]) => {
  const emojis = [
    '💻',
    '🎧',
    '👨‍💻',
    '🖥️',
    '⌨️',
    '🕹️',
    '🧑‍💻',
    '🥋',
    '🥊',
    '🤼',
    '🎮',
    '💪',
    '👟',
    '📚',
    '☕',
    '🍃',
  ]

  return colors.map((color) => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const context = canvas.getContext('2d')

    if (context) {
      context.fillStyle = color
      context.fillRect(0, 0, canvas.width, canvas.height)

      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]

      context.font = '120px sans-serif'
      context.textAlign = 'center'
      context.textBaseline = 'middle'

      context.fillText(randomEmoji, canvas.width / 2, canvas.height / 2)
    }

    return new CanvasTexture(canvas)
  })
}
