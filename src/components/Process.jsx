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
        const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-steps]', start: 'top 75%', once: true } })
        tl.fromTo('[data-line-fill]', { scaleX: 0, scaleY: 0 }, { scaleX: 1, scaleY: 1, duration: 1.6, ease: 'power2.inOut' })
          .from('[data-step-dot]', { scale: 0.4, backgroundColor: '#F5F2EA', color: '#D96936', duration: 0.4, stagger: 0.5, ease: 'back.out(2)' }, 0.05)
          .from('[data-step-body]', { autoAlpha: 0, y: 20, duration: 0.5, stagger: 0.5 }, 0.15)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="process" ref={root} className="section-y relative bg-ivory-soft" aria-labelledby="process-title">
      <div className="site-x">
        <div className="mx-auto max-w-2xl text-center">
          <p data-reveal className="eyebrow mb-4">How it works</p>
          <h2 data-reveal id="process-title" className="display text-[clamp(2.3rem,4.6vw,4rem)]">
            A clear path <em className="accent">from start to finish.</em>
          </h2>
          <p data-reveal className="mt-5 text-[1.02rem] text-charcoal-muted">{process.body}</p>
        </div>

        <ol data-steps className="relative mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {/* Connecting line: horizontal on desktop, vertical on mobile */}
          <span className="absolute left-[1.375rem] top-6 bottom-6 w-px bg-charcoal/10 md:left-[16.66%] md:right-[16.66%] md:top-[1.375rem] md:bottom-auto md:h-px md:w-auto" aria-hidden="true">
            <span data-line-fill className="absolute inset-0 origin-top bg-orange md:origin-left" />
          </span>
          {process.steps.map((s, i) => {
            const Icon = ICONS[i]
            return (
              <li key={s.title} className="relative grid grid-cols-[auto_1fr] gap-5 md:grid-cols-1 md:justify-items-center md:text-center">
                <span data-step-dot className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-orange text-sm font-semibold text-ivory shadow-[0_0_0_6px_#FAF8F3]">
                  0{i + 1}
                </span>
                <div data-step-body className="md:mt-4">
                  <span className="mb-4 hidden h-14 w-14 items-center justify-center rounded-2xl border border-charcoal/10 bg-ivory text-charcoal md:mx-auto md:flex">
                    <Icon />
                  </span>
                  <h3 className="text-xl font-medium tracking-tight">{s.title}</h3>
                  <p className="mt-2 max-w-xs text-[0.95rem] leading-relaxed text-charcoal-muted md:mx-auto">{s.body}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
