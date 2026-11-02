import { useRef } from 'react'
import { process } from '../content/site'
import { useReveal } from '../hooks/useReveal'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { Doc, Route, Box } from './Icons'

const ICONS = [Doc, Route, Box]

export default function Process() {
  const root = useRef(null)
  useReveal(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-steps]', start: 'top 78%', once: true } })
        tl.fromTo('[data-line-fill]', { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, duration: 1.5, ease: 'power2.inOut' })
          .from('[data-step-dot]', { scale: 0.3, autoAlpha: 0, duration: 0.4, stagger: 0.45, ease: 'back.out(2.2)' }, 0)
          .from('[data-step-body]', { autoAlpha: 0, y: 16, duration: 0.5, stagger: 0.45 }, 0.15)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="process" ref={root} className="relative bg-ivory py-14 sm:py-16 lg:py-20" aria-labelledby="process-title">
      <div className="site-x">
        <h2 data-reveal id="process-title" className="h2">
          A clear path from start to finish.
        </h2>
        <p data-reveal className="lead">
          {process.body}
        </p>

        <ol data-steps className="relative mt-10 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* Connecting line: through the number badges, horizontal on desktop, vertical on mobile */}
          <span className="absolute bottom-4 left-[1.25rem] top-4 w-[2px] bg-orange/15 md:bottom-auto md:left-[16.66%] md:right-[16.66%] md:top-[1.2rem] md:h-[2px] md:w-auto" aria-hidden="true">
            <span data-line-fill className="absolute inset-0 origin-top bg-orange md:origin-left" />
          </span>
          {process.steps.map((s, i) => {
            const Icon = ICONS[i]
            return (
              <li key={s.title} className="relative grid grid-cols-[auto_1fr] gap-5 md:grid-cols-1 md:justify-items-center">
                <span data-step-dot className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-orange text-sm font-extrabold text-white ring-[6px] ring-ivory">
                  0{i + 1}
                </span>
                <div data-step-body className="flex gap-4 md:mt-2 md:max-w-xs">
                  <span className="mt-0.5 shrink-0 text-charcoal">
                    <Icon className="h-9 w-9" />
                  </span>
                  <div>
                    <h3 className="text-[1.02rem] font-extrabold tracking-tight">{s.title}</h3>
                    <p className="mt-1 text-[0.88rem] leading-relaxed text-charcoal-muted">{s.body}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
