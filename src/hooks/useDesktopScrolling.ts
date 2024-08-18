import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin, ScrollTrigger } from 'gsap/all'
import { useDeviceType } from './useDeviceType'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

export const useDesktopScrolling = () => {
  const deviceType = useDeviceType()

  useEffect(() => {
    const resetScrollPosition = () => {
      window.scrollTo(0, 0)
    }
    setTimeout(resetScrollPosition, 50)

    const handleWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        window.scrollBy(0, event.deltaX)
      }
    }

    if (deviceType === 'desktop') {
      window.addEventListener('wheel', handleWheel)
    }

    return () => {
      if (deviceType === 'desktop') {
        window.removeEventListener('wheel', handleWheel)
      }
    }
  }, [deviceType])

  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 551px)', () => {
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
          scrub: 0.5,
          anticipatePin: 0.9,
          snap: {
            snapTo: 1 / (sections.length - 1),
            duration: { min: 0.3, max: 0.55 },
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
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      }
    })

    return () => mm.revert()
  }, [deviceType])
}
