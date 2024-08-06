import { useEffect } from 'react'

import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import useDeviceType from './useDeviceType'

gsap.registerPlugin(ScrollToPlugin)

const useGsapScrollingBehavior = () => {
  const deviceType = useDeviceType()

  useEffect(() => {
    if (deviceType === 'desktop') {
      const handleScroll = (event: WheelEvent) => {
        event.preventDefault()
        const scrollAmount = event.deltaY * 10
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { x: window.scrollX + scrollAmount },
        })
      }

      window.addEventListener('wheel', handleScroll, { passive: false })

      return () => {
        window.removeEventListener('wheel', handleScroll)
      }
    }
  }, [])
}

export default useGsapScrollingBehavior
