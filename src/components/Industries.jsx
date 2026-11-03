import { useRef } from 'react'
import { industries } from '../content/site'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'

/* Dark band with three slanted photo cards, as in the design. */
export default function Industries() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 78%', once: true } })
        tl.from('[data-head] > *', { autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.08, ease: 'power3.out' })
          .from('[data-rule]', { scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'power3.inOut' }, 0.2)
          .from('[data-ind]', { autoAlpha: 0, x: 60, duration: 0.9, stagger: 0.14, ease: 'power3.out' }, 0.25)
          .from('[data-ind-bar]', { scaleX: 0, transformOrigin: 'left', duration: 0.7, stagger: 0.14, ease: 'power2.out' }, 0.7)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="industries" ref={root} className="relative overflow-hidden bg-charcoal py-12 text-white sm:py-14 lg:py-16" aria-labelledby="industries-title">
      <div className="site-x">
        <div className="mb-8 flex items-end gap-8">
          <div data-head>
            <p className="eyebrow mb-2">Industries</p>
            <h2 id="industries-title" className="h2">
              Built to carry your ambition.
            </h2>
          </div>
          <span data-rule className="mb-4 hidden h-[3px] flex-1 rounded-full bg-orange md:block" aria-hidden="true" />
        </div>

        <ul className="grid gap-5 md:grid-cols-3 md:gap-4 md:px-3">
          {industries.map((ind) => (
            <li key={ind.id} data-ind className="group">
              <article className="ind-card relative h-[230px] bg-black shadow-[0_24px_40px_-24px_rgba(0,0,0,.8)] transition-transform duration-500 ease-out group-hover:-translate-y-1.5 lg:h-[260px]">
                <div className="unskew absolute inset-0">
                  <Img image={ind.image} sizes="(min-width:768px) 34vw, 100vw" className="zoom-img h-full w-full object-cover" />
                </div>
                <div className="unskew absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" aria-hidden="true" />
                <div className="unskew-text absolute inset-x-0 bottom-0 px-8 pb-7">
                  <h3 className="text-[clamp(1.6rem,2.2vw,2.1rem)] font-extrabold tracking-[-0.03em]">{ind.title}</h3>
                  <p className="mt-1.5 max-w-[19rem] text-[0.92rem] leading-snug text-white/90 lg:text-[1rem]">{ind.body}</p>
                </div>
                <span data-ind-bar className="absolute inset-x-0 bottom-0 h-[5px] bg-orange transition-[height] duration-500 group-hover:h-[8px]" aria-hidden="true" />
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
