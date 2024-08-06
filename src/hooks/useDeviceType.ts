import { useMedia } from 'react-use'

const useDeviceType = (): 'mobile' | 'desktop' => {
  const isMobile = useMedia('(max-width: 768px)')
  return isMobile ? 'mobile' : 'desktop'
}

export default useDeviceType
