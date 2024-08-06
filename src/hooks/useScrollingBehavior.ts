import { useEffect } from 'react'
import { useMedia } from 'react-use'

const useScrollingBehavior = () => {
  const isMobile = useMedia('(max-width: 768px)')

  useEffect(() => {
    if (!isMobile) {
      const handleScroll = (event: WheelEvent) => {
        event.preventDefault()
        window.scrollTo({
          left: window.scrollX + event.deltaY * 30,
          behavior: 'smooth',
        })
      }

      window.addEventListener('wheel', handleScroll, { passive: false })

      return () => {
        window.removeEventListener('wheel', handleScroll)
      }
    }
  }, [isMobile])
}

export default useScrollingBehavior
