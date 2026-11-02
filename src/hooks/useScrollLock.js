import { useEffect } from 'react'

let locks = 0

export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return
    const html = document.documentElement
    if (locks === 0) {
      const gap = window.innerWidth - html.clientWidth
      html.style.setProperty('--scrollbar-gap', `${gap}px`)
      html.classList.add('scroll-locked')
    }
    locks++
    return () => {
      locks--
      if (locks === 0) {
        html.classList.remove('scroll-locked')
        html.style.removeProperty('--scrollbar-gap')
      }
    }
  }, [active])
}
