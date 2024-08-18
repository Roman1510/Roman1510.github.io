import { useState, useEffect } from 'react'

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(getDeviceType())

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType())
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [deviceType])

  return deviceType
}

const getDeviceType = () => {
  const width = window.innerWidth
  return width >= 550 ? 'desktop' : 'mobile'
}
