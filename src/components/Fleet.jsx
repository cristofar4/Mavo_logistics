import { useRef, useState } from 'react'
import { fleet } from '../content/site'
import { useReveal } from '../hooks/useReveal'
import { gsap, useGSAP, MOTION_OK, prefersReducedMotion } from '../lib/gsap'
import Img from './Img'
import { Check } from './Icons'

/*
 * Fleet line up as in the design: tabs on the right, the three vehicles on a soft floor,
 * and details for the selected vehicle underneath.
 */
export default function Fleet() {
  const root = useRef(null)
  const tabsRef = useRef([])
  const [active, setActive] = useState(0)
  useReveal(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-vehicle]', {
          x: -90,
          autoAlpha: 0,
          duration: 1.1,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-lineup]', start: 'top 80%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const select = (i, focus = false) => {
    if (i === active) return
    setActive(i)
    if (focus) tabsRef.current[i]?.focus()
    if (prefersReducedMotion()) return
    requestAnimationFrame(() => {
      gsap.fromTo(root.current.querySelectorAll('[data-detail]'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out' })
    })
  }

  const onKeyDown = (e) => {
    const last = fleet.length - 1
    let next = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = active === last ? 0 : active + 1
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = active === 0 ? last : active - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    if (next !== null) {
      e.preventDefault()
      select(next, true)
    }
  }

  const f = fleet[active]

  return (
    <section id="fleet" ref={root} className="relative overflow-hidden bg-ivory-soft pb-16 pt-14 sm:pt-16 lg:pb-20 lg:pt-20" aria-labelledby="fleet-title">
      <div className="site-x">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 data-reveal id="fleet-title" className="h2">
              The right vehicle for every move.
            </h2>
            <p data-reveal className="lead">
              Versatile and reliable fleet options for your logistics needs.
            </p>
          </div>
          <div data-reveal role="tablist" aria-label="Vehicle types" className="flex gap-1 overflow-x-auto border-b border-charcoal/10" onKeyDown={onKeyDown}>
            {fleet.map((v, i) => {
              const selected = i === active
              return (
                <button
                  key={v.id}
                  ref={(el) => (tabsRef.current[i] = el)}
                  role="tab"
                  id={`fleet-tab-${v.id}`}
                  aria-selected={selected}
                  aria-controls="fleet-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={`relative shrink-0 px-4 pb-3 pt-2 text-[0.88rem] font-bold transition-colors duration-300 ${selected ? 'text-charcoal' : 'text-charcoal/50 hover:text-charcoal'}`}
                >
                  {v.tab}
                  <span className={`absolute inset-x-2 -bottom-px h-[2.5px] origin-left rounded-full bg-orange transition-transform duration-500 ease-out ${selected ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden="true" />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Line up on a soft studio floor */}
      <div data-lineup className="relative mt-10 lg:mt-12">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 top-[6%] bg-[linear-gradient(180deg,rgba(231,227,219,0)_0%,#e9e5dd_45%,#e1ddd4_68%,rgba(250,248,243,0)_100%)]" aria-hidden="true" />
        <div className="site-x relative">
          <div className="grid grid-cols-3 items-start gap-2 sm:gap-6 lg:gap-10">
            {fleet.map((v, i) => {
              const selected = i === active
              return (
                <div key={v.id} data-vehicle className="relative">
                  <button
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => select(i)}
                    className={`group block w-full transition-[opacity,transform,filter] duration-500 ease-out ${selected ? 'opacity-100' : 'opacity-60 saturate-[.6] hover:opacity-90'}`}
                  >
                    <span className="relative flex h-[90px] items-end justify-center sm:h-[150px] lg:h-[220px]">
                      <Img image={v.image} className={`relative z-10 h-full w-auto max-w-full object-contain object-bottom transition-transform duration-700 ease-out ${selected ? 'scale-[1.04]' : 'scale-[.96] group-hover:scale-100'}`} />
                      <span className="absolute inset-x-[8%] -bottom-1 h-5 rounded-[50%] bg-charcoal/35 blur-md" aria-hidden="true" />
                    </span>
                  </button>
                  <div className="mt-4 hidden sm:block">
                    <p className={`text-[0.98rem] font-extrabold tracking-tight transition-colors duration-300 ${selected ? 'text-charcoal' : 'text-charcoal/55'}`}>{v.title}</p>
                    <p className="mt-0.5 max-w-[15rem] text-[0.8rem] leading-snug text-charcoal-muted">{v.lead}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Details for the selected vehicle */}
      <div className="site-x mt-10">
        <div id="fleet-panel" role="tabpanel" aria-labelledby={`fleet-tab-${f.id}`} tabIndex={0} className="grid gap-8 rounded-xl border border-charcoal/10 bg-ivory p-6 outline-none sm:p-8 md:grid-cols-12">
          <div data-detail className="md:col-span-5">
            <p className="eyebrow">Selected vehicle</p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight">{f.title}</h3>
            <p className="mt-2 text-[0.95rem] leading-relaxed text-charcoal-muted">{f.body}</p>
          </div>
          <div data-detail className="md:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal">Suitable cargo</h4>
            <ul className="mt-4 space-y-2.5">
              {f.suits.map((s) => (
                <li key={s} className="flex gap-2.5 text-[0.92rem]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange/10 text-orange">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div data-detail className="md:col-span-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-charcoal">Specifications</h4>
            <dl className="mt-3 divide-y divide-charcoal/10 text-sm">
              {f.specs.map((s) => (
                <div key={s.label} className="flex items-center justify-between gap-4 py-2.5">
                  <dt className="text-charcoal-muted">{s.label}</dt>
                  <dd>{s.value ?? <span className="placeholder-tag">To be confirmed</span>}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
