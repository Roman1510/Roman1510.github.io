import { useCallback, useEffect, useState } from 'react'
import { Direction } from '../types/game-world'

const LEFT = 'LEFT'
const RIGHT = 'RIGHT'
const UP = 'UP'
const DOWN = 'DOWN'

export const useHeroControls = () => {
  const [heldDirections, setHeldDirections] = useState<Direction[]>([])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    let newDirection: Direction | undefined

    switch (e.code) {
      case 'KeyW':
        newDirection = UP
        break
      case 'KeyS':
        newDirection = DOWN
        break
      case 'KeyA':
        newDirection = LEFT
        break
      case 'KeyD':
        newDirection = RIGHT
        break
      default:
        return
    }

    if (newDirection) {
      setHeldDirections((prevDirections) =>
        prevDirections.includes(newDirection)
          ? prevDirections
          : [newDirection, ...prevDirections]
      )
    }
  }, [])

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    let releasedDirection: Direction | undefined

    switch (e.code) {
      case 'ArrowUp':
      case 'KeyW':
        releasedDirection = UP
        break
      case 'ArrowDown':
      case 'KeyS':
        releasedDirection = DOWN
        break
      case 'ArrowLeft':
      case 'KeyA':
        releasedDirection = LEFT
        break
      case 'ArrowRight':
      case 'KeyD':
        releasedDirection = RIGHT
        break
      default:
        return
    }

    if (releasedDirection) {
      setHeldDirections((prevDirections) =>
        prevDirections.filter((dir) => dir !== releasedDirection)
      )
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  const getControlsDirection = useCallback(
    (): Direction | null => heldDirections[0] || null,
    [heldDirections]
  )

  return { getControlsDirection }
}
