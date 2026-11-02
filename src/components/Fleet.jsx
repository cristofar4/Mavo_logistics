import { useRef, useState } from 'react'
import { fleet } from '../content/site'
import { useReveal } from '../hooks/useReveal'
import { gsap, useGSAP, prefersReducedMotion } from '../lib/gsap'
import Img from './Img'
import { Check } from './Icons'

export default function Fleet() {
  const root = useRef(null)
  const tabsRef = useRef([])
  const [active, setActive] = useState(0)
  const { contextSafe } = useGSAP({ scope: root })
  useReveal(root)

  const select = contextSafe((i, focus = false) => {
    if (i === active) return
    setActive(i)
    if (focus) tabsRef.current[i]?.focus()
    if (prefersReducedMotion()) return
    requestAnimationFrame(() => {
      const panel = root.current.querySelector(`[data-fleet-panel="${i}"]`)
      if (!panel) return
      gsap.fromTo(panel.querySelector('[data-fleet-img]'), { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power3.inOut' })
      gsap.fromTo(panel.querySelector('[data-fleet-img] img'), { scale: 1.12 }, { scale: 1, duration: 1.1, ease: 'power2.out' })
      gsap.fromTo(panel.querySelectorAll('[data-fleet-text]'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, delay: 0.2 })
    })
  })

  const onKeyDown = (e) => {
    const last = fleet.length - 1
    let next = null
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = active === last ? 0 : active + 1
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = active === 0 ? last : active - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    if (next !== null) {
      e.preventDefault()
      select(next, true)
    }
  }

  return (
    <section id="fleet" ref={root} className="section-y relative bg-ivory-soft" aria-labelledby="fleet-title">
      <div className="site-x">
        <div className="mb-12 max-w-3xl lg:mb-16">
          <p data-reveal className="eyebrow mb-4">Our fleet</p>
          <h2 data-reveal id="fleet-title" className="display text-[clamp(2.3rem,4.6vw,4rem)]">
            The right vehicle <em className="accent">for every move.</em>
          </h2>
          <p data-reveal className="mt-5 max-w-xl text-[1.02rem] leading-relaxed text-charcoal-muted">
            Versatile vehicle options matched to what you are moving, how much of it there is and where it needs to go.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Tab list */}
          <div data-reveal className="lg:col-span-4">
            <div role="tablist" aria-label="Vehicle types" aria-orientation="vertical" className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-0 lg:overflow-visible lg:pb-0" onKeyDown={onKeyDown}>
              {fleet.map((f, i) => {
                const selected = i === active
                return (
                  <button
                    key={f.id}
                    ref={(el) => (tabsRef.current[i] = el)}
                    role="tab"
                    id={`fleet-tab-${f.id}`}
                    aria-selected={selected}
                    aria-controls={`fleet-panel-${f.id}`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(i)}
                    className={`group relative flex shrink-0 items-center gap-4 rounded-full border px-5 py-3 text-left transition-colors duration-300 lg:rounded-none lg:border-0 lg:border-b lg:px-0 lg:py-6 ${
                      selected ? 'border-charcoal bg-charcoal text-ivory lg:border-charcoal/15 lg:bg-transparent lg:text-charcoal' : 'border-charcoal/15 text-charcoal/60 hover:text-charcoal lg:border-charcoal/15'
                    }`}
                  >
                    <span className={`hidden font-serif text-2xl italic transition-colors duration-300 lg:inline ${selected ? 'text-orange' : 'text-charcoal/30'}`}>0{i + 1}</span>
                    <span className="text-[0.95rem] font-medium lg:text-[1.6rem] lg:tracking-tight">{f.tab}</span>
                    <span
                      className={`absolute bottom-[-1px] left-0 hidden h-[2px] origin-left bg-orange transition-transform duration-500 ease-out lg:block lg:w-full ${selected ? 'scale-x-100' : 'scale-x-0'}`}
                      aria-hidden="true"
                    />
                  </button>
                )
              })}
            </div>
            <p className="mt-8 hidden max-w-xs text-sm leading-relaxed text-charcoal-muted lg:block">
              Fleet sizes, capacities and vehicle specifications are confirmed for each enquiry.
            </p>
          </div>

          {/* Panels */}
          <div className="lg:col-span-8">
            {fleet.map((f, i) => (
              <div
                key={f.id}
                id={`fleet-panel-${f.id}`}
                role="tabpanel"
                aria-labelledby={`fleet-tab-${f.id}`}
                data-fleet-panel={i}
                hidden={i !== active}
                tabIndex={0}
                className="relative rounded-[1.75rem] outline-none"
              >
                <div data-fleet-img className="relative aspect-[4/3] overflow-hidden rounded-[1.75rem] bg-charcoal sm:aspect-[16/10]">
                  <Img image={f.image} sizes="(min-width:1024px) 60vw, 100vw" className={`h-full w-full object-cover ${f.id === 'vans' ? 'object-[50%_62%]' : ''}`} />
                  <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-transparent to-transparent" aria-hidden="true" />
                  <p data-fleet-text className="absolute left-6 right-6 top-5 max-w-md font-serif text-2xl italic leading-tight text-ivory [text-shadow:0_2px_18px_rgba(0,0,0,.45)] sm:left-8 sm:top-7 sm:text-3xl">{f.lead}</p>
                </div>

                <div className="relative mx-3 -mt-10 grid gap-6 rounded-[1.5rem] bg-ivory p-6 shadow-soft sm:mx-8 sm:-mt-14 sm:p-8 md:grid-cols-2">
                  <div data-fleet-text>
                    <h3 className="text-2xl font-medium tracking-tight">{f.title}</h3>
                    <p className="mt-2 text-[0.97rem] leading-relaxed text-charcoal-muted">{f.body}</p>
                    <dl className="mt-5 divide-y divide-charcoal/10 border-y border-charcoal/10 text-sm">
                      {f.specs.map((s) => (
                        <div key={s.label} className="flex items-center justify-between gap-4 py-2.5">
                          <dt className="text-charcoal-muted">{s.label}</dt>
                          <dd>{s.value ?? <span className="placeholder-tag">To be confirmed</span>}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div data-fleet-text>
                    <h4 className="text-xs font-semibold uppercase tracking-[0.22em] text-charcoal">Suitable cargo</h4>
                    <ul className="mt-4 space-y-3">
                      {f.suits.map((s) => (
                        <li key={s} className="flex gap-3 text-[0.97rem]">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-olive-soft text-olive">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
            <p className="mt-6 text-sm text-charcoal-muted lg:hidden">Fleet sizes, capacities and vehicle specifications are confirmed for each enquiry.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
