import { useRef } from 'react'
import { coverage } from '../content/site'
import { useReveal } from '../hooks/useReveal'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { Globe, Pin, Truck } from './Icons'

/*
 * Illustrative route network drawn over a dotted world map (viewBox 1000 x 460).
 * These points are decorative only and do not represent confirmed offices or lanes.
 * To show real locations, replace NODES with projected coordinates:
 *   x = (lon + 180) / 360 * 1000,  y = (80 - lat) / 138 * 460
 */
const NODES = [
  [270, 150],
  [480, 120],
  [530, 250],
  [640, 175],
  [790, 190],
  [350, 330],
  [870, 340],
]
const ROUTES = [
  [0, 1],
  [1, 3],
  [3, 4],
  [1, 2],
  [0, 5],
  [4, 6],
  [2, 3],
]

function arc([x1, y1], [x2, y2]) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const lift = Math.min(120, Math.hypot(x2 - x1, y2 - y1) * 0.32)
  return `M${x1} ${y1} Q${mx} ${my - lift} ${x2} ${y2}`
}

const ICONS = { local: Pin, national: Truck, international: Globe }

export default function Coverage() {
  const root = useRef(null)
  useReveal(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const paths = gsap.utils.toArray('[data-route]')
        paths.forEach((p) => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        })
        const tl = gsap.timeline({ scrollTrigger: { trigger: '[data-map]', start: 'top 75%', once: true } })
        tl.from('[data-map-dots]', { autoAlpha: 0, duration: 0.9, ease: 'power1.out' })
          .from('[data-node]', { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.06, ease: 'back.out(2)' }, 0.3)
          .to(paths, { strokeDashoffset: 0, duration: 1.4, stagger: 0.12, ease: 'power2.inOut' }, 0.5)
          .add(() => paths.forEach((p) => p.removeAttribute('style')))
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="coverage" ref={root} className="section-y relative overflow-hidden" aria-labelledby="coverage-title">
      <div className="site-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-reveal className="eyebrow mb-4">Coverage</p>
            <h2 data-reveal id="coverage-title" className="display text-[clamp(2.3rem,4.6vw,4rem)]">
              Built for <em className="accent">the journey ahead.</em>
            </h2>
          </div>
          <p data-reveal className="max-w-md text-[1.02rem] leading-relaxed text-charcoal-muted lg:col-span-4 lg:col-start-9">
            {coverage.body}
          </p>
        </div>

        <figure data-map className="relative mt-12 lg:mt-16">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-ivory-deep/70 to-ivory px-2 py-6 sm:px-8 sm:py-10">
            <svg viewBox="0 0 1000 460" className="h-auto w-full" role="img" aria-label="Illustrative world map with stylised route lines">
              <image data-map-dots href="/images/world-dots.svg" x="0" y="0" width="1000" height="460" opacity="0.16" />
              <g fill="none" stroke="#D96936" strokeWidth="1.6" strokeLinecap="round">
                {ROUTES.map(([a, b]) => (
                  <path key={`${a}-${b}`} data-route d={arc(NODES[a], NODES[b])} opacity="0.85" />
                ))}
              </g>
              <g strokeDasharray="2 6" stroke="#202321" strokeOpacity="0.18" fill="none" strokeWidth="1">
                {ROUTES.map(([a, b]) => (
                  <path key={`g-${a}-${b}`} d={arc(NODES[a], NODES[b])} style={{ animation: 'routeDash 1.6s linear infinite' }} />
                ))}
              </g>
              {NODES.map(([x, y], i) => (
                <g key={i} data-node>
                  <circle cx={x} cy={y} r="11" fill="#D96936" opacity="0.14" />
                  <circle cx={x} cy={y} r="4.5" fill="#D96936" stroke="#F5F2EA" strokeWidth="2" />
                </g>
              ))}
            </svg>
          </div>
          <figcaption className="mt-3 text-xs text-charcoal-muted">{coverage.note}</figcaption>
        </figure>

        <ul className="mt-12 grid gap-px overflow-hidden rounded-[1.5rem] bg-charcoal/10 lg:grid-cols-3">
          {coverage.items.map((item, i) => {
            const Icon = ICONS[item.id]
            return (
              <li key={item.id} data-reveal className="flex gap-5 bg-ivory p-7 sm:p-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-orange/30 text-orange">
                  <Icon />
                </span>
                <div>
                  <p className="text-xs font-medium tracking-[0.25em] text-charcoal/40">0{i + 1}</p>
                  <h3 className="mt-1 text-xl font-medium tracking-tight">{item.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-charcoal-muted">{item.body}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
