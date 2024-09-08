import { useEffect, useState } from 'react'
import * as PIXI from 'pixi.js'
import { TILE_SIZE } from '@/constants/game-world'

interface UseSpriteAnimationProps {
  imagePath: string
  frameWidth: number
  frameHeight: number
}

export const useSpriteAnimation = ({
  imagePath,
  frameWidth,
  frameHeight,
}: UseSpriteAnimationProps) => {
  const [sprite, setSprite] = useState<PIXI.Sprite | null>(null)

  useEffect(() => {
    const texture = PIXI.Texture.from(imagePath)

    const frame = new PIXI.Texture(
      texture.baseTexture,
      new PIXI.Rectangle(0, frameHeight * 2, frameWidth, frameHeight)
    )

    const animatedSprite = new PIXI.Sprite(frame)
    animatedSprite.width = TILE_SIZE
    animatedSprite.height = TILE_SIZE

    setSprite(animatedSprite)
  }, [imagePath, frameWidth, frameHeight])

  return { sprite }
}
