import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../lib/gsap'

/*
 * Section reveal choreography.
 *  [data-reveal]        fades and rises into view, staggered in batches
 *  [data-reveal="img"]  unmasks upward with a gentle settling scale on the inner <img>
 * Elements stay fully visible when reduced motion is preferred.
 */
export function useReveal(scope) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray('[data-reveal]:not([data-reveal="img"])', scope.current)
        if (items.length) {
          gsap.set(items, { autoAlpha: 0, y: 28 })
          ScrollTrigger.batch(items, {
            start: 'top 88%',
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09, overwrite: true }),
          })
        }
        gsap.utils.toArray('[data-reveal="img"]', scope.current).forEach((el) => {
          const img = el.querySelector('img')
          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          })
          tl.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut' },
          )
          if (img) tl.fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.3, ease: 'power2.out' }, 0)
        })
      })
      return () => mm.revert()
    },
    { scope },
  )
}
