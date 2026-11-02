import { useRef } from 'react'
import { industries } from '../content/site'
import { useReveal } from '../hooks/useReveal'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'

/* A row of slanted photo cards with straight captions underneath, as in the design. */
export default function Industries() {
  const root = useRef(null)
  useReveal(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-ind]', {
          autoAlpha: 0,
          y: 40,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-ind-row]', start: 'top 82%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="industries" ref={root} className="relative bg-ivory-soft py-14 sm:py-16 lg:py-20" aria-labelledby="industries-title">
      <div className="site-x">
        <h2 data-reveal id="industries-title" className="h2">
          Built around your business.
        </h2>
        <p data-reveal className="lead">
          Logistics solutions for the industries that keep our world moving.
        </p>

        <ul data-ind-row className="mt-9 grid gap-x-6 gap-y-10 sm:grid-cols-2 sm:px-3 lg:grid-cols-4 lg:px-6">
          {industries.map((ind) => (
            <li key={ind.id} data-ind className="group">
              <div className="skew-card relative aspect-[16/10] bg-charcoal shadow-soft">
                <div className="unskew-media absolute inset-0">
                  <Img image={ind.image} sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw" className={`zoom-img h-full w-full object-cover ${ind.id === 'retail' ? 'object-[50%_55%]' : ind.id === 'agriculture' ? 'object-[50%_35%]' : ''}`} />
                </div>
              </div>
              <h3 className="mt-4 text-[1.05rem] font-extrabold tracking-tight">{ind.title}</h3>
              <p className="mt-1 max-w-xs text-[0.86rem] leading-relaxed text-charcoal-muted">{ind.body}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${ind.title} examples`}>
                {ind.tags.map((t) => (
                  <li key={t} className="rounded border border-charcoal/10 bg-ivory px-2 py-0.5 text-[0.7rem] font-semibold text-charcoal/70">
                    {t}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
