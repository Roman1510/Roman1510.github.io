import { useState, useEffect } from 'react'

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState(getDeviceType())

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getDeviceType())
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return deviceType
}

const getDeviceType = () => {
  const width = window.innerWidth
  return width >= 768 ? 'desktop' : 'mobile'
}

export default useDeviceType
