import { useEffect } from 'react'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

export function MotionProvider({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      document.documentElement.classList.remove('lenis')
      return undefined
    }

    document.documentElement.classList.add('lenis')

    const lenis = new Lenis({
      smoothWheel: true,
      smoothTouch: false,
      lerp: 0.09,
    })

    let rafId = 0

    const raf = (time) => {
      lenis.raf(time)
      rafId = window.requestAnimationFrame(raf)
    }

    lenis.on('scroll', ScrollTrigger.update)
    rafId = window.requestAnimationFrame(raf)
    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.cancelAnimationFrame(rafId)
      window.cancelAnimationFrame(refreshId)
      lenis.destroy()
      document.documentElement.classList.remove('lenis')
    }
  }, [])

  return children
}
