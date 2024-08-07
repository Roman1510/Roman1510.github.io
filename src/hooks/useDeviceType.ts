import { useMedia } from 'react-use'

const useDeviceType = (): 'mobile' | 'desktop' => {
  const isMobile = useMedia('(max-width: 600px)')
  return isMobile ? 'mobile' : 'desktop'
}

export default useDeviceType
