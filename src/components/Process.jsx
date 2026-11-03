import { useRef } from 'react'
import { process } from '../content/site'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'

/* Three steps with circled italic numbers joined by short orange dashes, as in the design. */
export default function Process() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const circles = gsap.utils.toArray('[data-ring]')
        circles.forEach((c) => {
          const len = c.getTotalLength()
          gsap.set(c, { strokeDasharray: len, strokeDashoffset: len })
        })
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 80%', once: true } })
        tl.from('[data-head] > *', { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.08, ease: 'power3.out' })
          .from('[data-rule]', { scaleY: 0, transformOrigin: 'top', duration: 0.7, ease: 'power3.inOut' }, 0.1)
        circles.forEach((c, i) => {
          const t = 0.35 + i * 0.45
          tl.to(c, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, t)
            .from(`[data-num="${i}"]`, { scale: 0.3, autoAlpha: 0, duration: 0.4, ease: 'back.out(2.4)' }, t + 0.2)
            .from(`[data-step-body="${i}"]`, { autoAlpha: 0, x: -12, duration: 0.45, ease: 'power3.out' }, t + 0.25)
          if (i < circles.length - 1) tl.from(`[data-dash="${i}"]`, { scaleX: 0, transformOrigin: 'left', duration: 0.35, ease: 'power2.out' }, t + 0.45)
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="process" ref={root} className="bg-ivory pt-12 sm:pt-14" aria-labelledby="process-title">
      <div className="site-x grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_auto_minmax(0,2.3fr)] lg:items-center lg:gap-10">
        <div data-head>
          <p className="eyebrow mb-2">{process.eyebrow}</p>
          <h2 id="process-title" className="h2 max-w-[28rem] text-[clamp(1.8rem,2.6vw,2.6rem)] text-charcoal">
            {process.heading}
          </h2>
        </div>
        <span data-rule className="hidden h-[5.5rem] w-[3px] self-center rounded-full bg-orange lg:block" aria-hidden="true" />
        <ol className="grid gap-7 md:grid-cols-3 md:gap-4">
          {process.steps.map((s, i) => (
            <li key={s.title} className="relative flex gap-4">
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center lg:h-14 lg:w-14" aria-hidden="true">
                <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
                  <circle data-ring cx="24" cy="24" r="22" fill="none" stroke="#EA6A1F" strokeWidth="2.4" />
                </svg>
                <span data-num={i} className="serif-i text-[1.7rem] leading-none text-orange">
                  {i + 1}
                </span>
              </span>
              <div data-step-body={i} className="min-w-0 pr-6">
                <h3 className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-extrabold tracking-tight text-charcoal">
                  <span className="sr-only">Step {i + 1}. </span>
                  {s.title}
                </h3>
                <p className="mt-1 text-[0.92rem] leading-snug text-charcoal/80 lg:text-[1rem]">{s.body}</p>
              </div>
              {i < process.steps.length - 1 && <span data-dash={i} className="absolute right-0 top-6 hidden h-[3px] w-6 rounded-full bg-orange md:block xl:w-8" aria-hidden="true" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
