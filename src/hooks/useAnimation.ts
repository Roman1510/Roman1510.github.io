import { useRef, useState } from 'react'
import { Sprite, Texture, Rectangle } from 'pixi.js'

interface UseAnimationProps {
  texture: Texture
  frameWidth: number
  frameHeight: number
  totalFrames: number
  animationSpeed: number
}

export const useAnimation = ({
  texture,
  frameWidth,
  frameHeight,
  totalFrames,
  animationSpeed,
}: UseAnimationProps) => {
  const [currentTexture, setCurrentTexture] = useState(
    new Texture(
      texture.baseTexture,
      new Rectangle(0, 0, frameWidth, frameHeight)
    )
  )

  const spriteRef = useRef<Sprite>(new Sprite(currentTexture))
  const frameRef = useRef(0)
  const elapsedTimeRef = useRef(0)

  const updateSprite = (delta: number) => {
    elapsedTimeRef.current += delta

    const frameDuration = 1 / animationSpeed

    if (elapsedTimeRef.current >= frameDuration) {
      elapsedTimeRef.current = 0
      frameRef.current = (frameRef.current + 1) % totalFrames

      const newFrame = new Rectangle(
        frameRef.current * frameWidth,
        0,
        frameWidth,
        frameHeight
      )

      const newTexture = new Texture(texture.baseTexture, newFrame)
      spriteRef.current.texture = newTexture
      setCurrentTexture(newTexture)
    }
  }

  return {
    sprite: spriteRef.current,
    updateSprite,
  }
}
