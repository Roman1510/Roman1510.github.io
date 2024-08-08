import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin, ScrollTrigger } from 'gsap/all'
import useDeviceType from './useDeviceType'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

export const useDesktopScrolling = () => {
  const deviceType = useDeviceType()

  //here im making the horizontal scroll work the same as vertical (for touchpads it's logical)
  window.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      window.scrollBy(0, event.deltaX)
    }
  })

  useEffect(() => {
    const resetScrollPosition = () => {
      window.scrollTo(0, 0)
    }

    setTimeout(resetScrollPosition, 50)

    if (deviceType === 'desktop') {
      const desktopContainer = document.querySelector(
        '.desktop-container'
      ) as HTMLElement | null
      if (!desktopContainer) return

      const sections = gsap.utils.toArray('.section')

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: desktopContainer,
          pin: true,
          scrub: 0.85,
          anticipatePin: 0.01,
          snap: {
            snapTo: 1 / (sections.length - 1),
            duration: { min: 0.15, max: 0.3 },
            ease: 'power1.inOut',
          },
          end: () => '+=' + desktopContainer.offsetWidth,
        },
      })

      const handleKeydown = (event: KeyboardEvent) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          gsap.to(window, {
            scrollTo: { y: '+=' + window.innerWidth / 8, autoKill: false },
            duration: 0.5,
          })
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          gsap.to(window, {
            scrollTo: { y: '-=' + window.innerWidth / 8, autoKill: false },
            duration: 0.5,
          })
        }
      }

      window.addEventListener('keydown', handleKeydown)

      return () => {
        window.removeEventListener('keydown', handleKeydown)
      }
    } else {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [deviceType])
}
