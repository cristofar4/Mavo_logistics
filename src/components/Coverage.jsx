import { useRef } from 'react'
import { coverage, images } from '../content/site'
import { useReveal } from '../hooks/useReveal'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import { Globe, Pin, Truck } from './Icons'

/*
 * Relief world map with glowing route arcs (shared 1000 x 460 coordinate space).
 * The points are illustrative only and do not represent confirmed offices or lanes.
 * To show real locations, replace NODES with projected coordinates:
 *   x = (lon + 180) / 360 * 1000,  y = (80 - lat) / 138 * 460
 */
const NODES = [
  [262, 150],
  [478, 118],
  [520, 252],
  [636, 178],
  [786, 196],
  [355, 330],
  [880, 352],
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
  const lift = Math.min(110, Math.hypot(x2 - x1, y2 - y1) * 0.34)
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
        tl.from('[data-map-img]', { autoAlpha: 0, scale: 1.04, duration: 1.1, ease: 'power2.out' })
          .from('[data-node]', { scale: 0, transformOrigin: '50% 50%', duration: 0.45, stagger: 0.07, ease: 'back.out(2.2)' }, 0.35)
          .to(paths, { strokeDashoffset: 0, duration: 1.4, stagger: 0.12, ease: 'power2.inOut' }, 0.55)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="coverage" ref={root} className="relative overflow-hidden bg-ivory pt-14 sm:pt-16 lg:pt-20" aria-labelledby="coverage-title">
      <div className="site-x relative z-10">
        <h2 data-reveal id="coverage-title" className="h2">
          Built for the journey ahead.
        </h2>
        <p data-reveal className="lead">
          {coverage.body}
        </p>
      </div>

      <figure data-map className="relative mx-auto -mt-2 max-w-[80rem] sm:-mt-8 lg:-mt-14">
        <div className="relative">
          <div data-map-img>
            <Img image={images.worldMap} sizes="100vw" alt="" className="h-auto w-full" />
          </div>
          <svg viewBox="0 0 1000 460" className="absolute inset-0 h-full w-full" role="img" aria-label="Illustrative world map with stylised route lines">
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="flare">
                <stop offset="0%" stopColor="#FFE2C4" stopOpacity="1" />
                <stop offset="35%" stopColor="#F08A4B" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#D96936" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="routeGrad" x1="0" x2="1">
                <stop offset="0%" stopColor="#D96936" stopOpacity="0.35" />
                <stop offset="50%" stopColor="#E9733A" />
                <stop offset="100%" stopColor="#D96936" stopOpacity="0.35" />
              </linearGradient>
            </defs>
            <g fill="none" stroke="#E46F37" strokeWidth="1.8" strokeLinecap="round" filter="url(#glow)">
              {ROUTES.map(([a, b]) => (
                <path key={`${a}-${b}`} data-route d={arc(NODES[a], NODES[b])} />
              ))}
            </g>
            {NODES.map(([x, y], i) => (
              <g key={i} data-node>
                <circle cx={x} cy={y} r="18" fill="url(#flare)" opacity="0.85" />
                <circle cx={x} cy={y} r="7" fill="none" stroke="#E46F37" strokeWidth="1.2" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `nodePulse 2.6s ${i * 0.35}s ease-out infinite` }} />
                <circle cx={x} cy={y} r="4.2" fill="#FFF3E6" stroke="#E46F37" strokeWidth="2.2" />
              </g>
            ))}
          </svg>
        </div>
        <figcaption className="site-x -mt-2 text-[0.72rem] text-charcoal-muted sm:-mt-6">{coverage.note}</figcaption>
      </figure>

      <div className="site-x pb-16 pt-8 lg:pb-20">
        <ul className="grid gap-6 md:grid-cols-3 md:gap-0 md:divide-x md:divide-charcoal/10">
          {coverage.items.map((item) => {
            const Icon = ICONS[item.id]
            return (
              <li key={item.id} data-reveal className="flex gap-4 md:px-8 md:first:pl-0">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center text-orange">
                  <Icon className="h-9 w-9" />
                </span>
                <div>
                  <h3 className="text-[1.02rem] font-extrabold tracking-tight">{item.title}</h3>
                  <p className="mt-1 text-[0.88rem] leading-relaxed text-charcoal-muted">{item.body}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
