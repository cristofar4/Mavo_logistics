import { useRef } from 'react'
import { values } from '../content/site'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { Box, Chat, Nodes } from './Icons'

const ICONS = { handling: Box, communication: Chat, journeys: Nodes }

/* The dark band under the hero. */
export default function ValuesStrip() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-value]', { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 92%', once: true } })
        gsap.from('[data-sep]', { scaleY: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out', delay: 0.3, scrollTrigger: { trigger: root.current, start: 'top 92%', once: true } })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="values" data-nav-dark ref={root} className="relative bg-charcoal text-white" aria-label="How MOVA works">
      <ul className="site-x flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-center sm:gap-0 sm:py-5">
        {values.map((v, i) => {
          const Icon = ICONS[v.id]
          return (
            <li key={v.id} className="flex items-center sm:flex-1 sm:justify-center">
              {i > 0 && <span data-sep className="mr-auto hidden h-6 w-[2px] rounded-full bg-orange sm:block" aria-hidden="true" />}
              <span data-value className="group flex items-center gap-3.5 sm:mx-auto" title={v.body}>
                <Icon className="h-7 w-7 text-orange lg:h-8 lg:w-8 transition-transform duration-500 ease-out group-hover:-rotate-6 group-hover:scale-110" />
                <span className="text-[1.05rem] font-extrabold tracking-tight lg:text-[1.25rem]">{v.title}</span>
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
