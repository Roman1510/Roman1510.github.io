import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin, ScrollTrigger } from 'gsap/all'
import useDeviceType from './useDeviceType'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

export const useDesktopScrolling = () => {
  const deviceType = useDeviceType()

  useEffect(() => {
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
          scrub: 0.7,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / (sections.length - 1),
            duration: { min: 0.15, max: 0.3 },
            ease: 'power1.inOut',
          },
          end: () => '+=' + desktopContainer.offsetWidth,
        },
      })
    }
  }, [deviceType])
}
