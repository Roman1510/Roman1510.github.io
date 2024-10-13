import { useRef } from 'react'
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
  const spriteRef = useRef<Sprite>(
    new Sprite(
      new Texture(
        texture.baseTexture,
        new Rectangle(0, 0, frameWidth, frameHeight)
      )
    )
  )

  const lastFrameRef = useRef(-1)

  const updateSprite = (frameCount: number) => {
    const currentFrame =
      Math.floor(frameCount / (60 / animationSpeed)) % totalFrames

    if (currentFrame !== lastFrameRef.current) {
      const newFrame = new Rectangle(
        currentFrame * frameWidth,
        0,
        frameWidth,
        frameHeight
      )

      spriteRef.current.texture = new Texture(texture.baseTexture, newFrame)
      lastFrameRef.current = currentFrame
    }
  }

  return { sprite: spriteRef.current, updateSprite }
}
