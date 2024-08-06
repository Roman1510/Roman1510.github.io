import { useEffect } from 'react'
import { useMedia } from 'react-use'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

const useGsapScrollingBehavior = () => {
  const isMobile = useMedia('(max-width: 768px)')

  useEffect(() => {
    if (!isMobile) {
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
  }, [isMobile])
}

export default useGsapScrollingBehavior
