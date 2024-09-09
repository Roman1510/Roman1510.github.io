import { useEffect, useState, useRef } from 'react'
import * as PIXI from 'pixi.js'
import { TILE_SIZE } from '@/constants/game-world'

interface UseSpriteAnimationProps {
  imagePath: string
  frameWidth: number
  frameHeight: number
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null
}

export const useSpriteAnimation = ({
  imagePath,
  frameWidth,
  frameHeight,
  direction,
}: UseSpriteAnimationProps) => {
  const [sprite, setSprite] = useState<PIXI.Sprite | null>(null)
  const lastDirection = useRef<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('DOWN')
  const frameRef = useRef(0)
  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const texture = PIXI.Texture.from(imagePath)

    const getRowByDirection = (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      switch (dir) {
        case 'UP':
          return 8
        case 'LEFT':
          return 9
        case 'DOWN':
          return 10
        case 'RIGHT':
          return 11
        default:
          return 10
      }
    }

    const tick = () => {
      const currentDirection = direction || lastDirection.current
      const row = getRowByDirection(currentDirection)

      if (direction) {
        lastDirection.current = direction

        frameRef.current = (frameRef.current + 1) % 9
        const column = frameRef.current

        const frame = new PIXI.Texture(
          texture.baseTexture,
          new PIXI.Rectangle(
            column * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight
          )
        )

        const animatedSprite = new PIXI.Sprite(frame)
        animatedSprite.width = TILE_SIZE
        animatedSprite.height = TILE_SIZE

        setSprite(animatedSprite)

        animFrameRef.current = requestAnimationFrame(tick)
      } else {
        const frame = new PIXI.Texture(
          texture.baseTexture,
          new PIXI.Rectangle(0, row * frameHeight, frameWidth, frameHeight)
        )

        const staticSprite = new PIXI.Sprite(frame)
        staticSprite.width = TILE_SIZE
        staticSprite.height = TILE_SIZE

        setSprite(staticSprite)

        if (animFrameRef.current !== null) {
          cancelAnimationFrame(animFrameRef.current)
          animFrameRef.current = null
        }
      }
    }

    tick()

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [imagePath, frameWidth, frameHeight, direction])

  return { sprite }
}
