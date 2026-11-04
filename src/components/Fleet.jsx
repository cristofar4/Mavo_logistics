import { useRef } from 'react'
import { fleet } from '../content/site'
import { useUI } from '../context/UIContext'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import { ArrowRight, Check } from './Icons'

function Suits({ items, dark }) {
  return (
    <ul className={`flex flex-wrap gap-1.5 pt-3 ${dark ? 'text-white' : 'text-charcoal'}`} aria-label="Suitable cargo">
      {items.map((x) => (
        <li key={x} className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[0.7rem] font-bold ${dark ? 'bg-white/15 backdrop-blur-sm' : 'bg-white'}`}>
          <Check className="h-3 w-3 text-orange" />
          {x}
        </li>
      ))}
    </ul>
  )
}

/*
 * Fleet as in the design: one large photo and two compact cards. Hover or focus reveals the cargo each
 * vehicle suits. Fleet sizes and capacities are not published, so none are shown.
 */
export default function Fleet() {
  const root = useRef(null)
  const { openQuote } = useUI()
  const m = fleet.main

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 78%', once: true } })
        tl.from('[data-head] > *', { autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.08, ease: 'power3.out' })
          .fromTo('[data-main]', { clipPath: 'inset(0% 100% 0% 0% round 18px)' }, { clipPath: 'inset(0% 0% 0% 0% round 18px)', duration: 1.2, ease: 'power3.inOut' }, 0.15)
          .from('[data-main] img', { scale: 1.2, xPercent: -6, duration: 1.8, ease: 'power2.out' }, 0.15)
          .from('[data-side]', { autoAlpha: 0, x: 50, duration: 0.8, stagger: 0.14, ease: 'power3.out' }, 0.5)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="fleet" ref={root} className="relative overflow-hidden bg-ivory py-12 sm:py-14 lg:py-16" aria-labelledby="fleet-title">
      <div className="site-x">
        <div data-head className="mb-7">
          <p className="eyebrow mb-2">Our fleet</p>
          <h2 id="fleet-title" className="h2 text-charcoal">
            The right vehicle. For every load.
          </h2>
        </div>

        <div className="grid gap-4 lg:h-[clamp(260px,22vw,330px)] lg:grid-cols-[1.62fr_1fr]">
          {/* Main: cargo trucks */}
          <article data-main className="group relative aspect-[16/9] overflow-hidden rounded-[18px] bg-charcoal shadow-soft lg:aspect-auto">
            <Img image={m.image} sizes="(min-width:1024px) 60vw, 100vw" className="zoom-img absolute inset-0 h-full w-full object-cover object-[50%_62%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0 translate-y-3 p-6 text-white opacity-0 transition duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
              <h3 className="text-[1.4rem] font-extrabold tracking-tight">{m.title}</h3>
              <p className="mt-1 max-w-md text-[0.88rem] text-white/85">{m.body}</p>
              <Suits items={m.suits} dark />
              <button type="button" onClick={() => openQuote()} className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold text-white underline decoration-orange decoration-2 underline-offset-4">
                Plan a shipment
                <ArrowRight className="h-4 w-4 text-orange" />
              </button>
            </div>
          </article>

          {/* Side cards */}
          <div className="grid gap-4">
            {fleet.side.map((v) => (
              <article key={v.id} data-side tabIndex={0} className="group relative grid grid-cols-[1.05fr_1fr] overflow-hidden rounded-[16px] bg-ivory-deep shadow-soft outline-none focus-visible:ring-[3px] focus-visible:ring-orange">
                <div className="relative min-h-[140px] overflow-hidden lg:min-h-0">
                  <Img image={v.image} sizes="(min-width:1024px) 18vw, 50vw" className="zoom-img absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="relative flex flex-col justify-center px-5 py-5 pr-8">
                  <h3 className="text-[clamp(1.25rem,1.7vw,1.6rem)] font-extrabold leading-tight tracking-tight text-charcoal">{v.title}</h3>
                  <p className="mt-1.5 text-[0.88rem] leading-snug text-charcoal/85 lg:text-[0.95rem]">{v.body}</p>
                  <div className="card-more">
                    <div className="min-h-0 overflow-hidden">
                      <Suits items={v.suits} />
                    </div>
                  </div>
                </div>
                <span className="tri-br !h-9 !w-9 group-hover:!h-12 group-hover:!w-12" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
