import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
gsap.defaults({ ease: 'power3.out', duration: 0.6 })

export const MOTION_OK = '(prefers-reduced-motion: no-preference)'
export const REDUCED = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED).matches
}

export { gsap, ScrollTrigger, useGSAP }
