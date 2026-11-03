import { useEffect, useRef, useState } from 'react'
import { coverage, images } from '../content/site'
import { gsap, useGSAP, MOTION_OK, REDUCED } from '../lib/gsap'
import Img from './Img'
import { Globe, Layers, Pin } from './Icons'

/*
 * Dark map with glowing orange routes (shared 1000 x 460 coordinate space).
 * The points are illustrative only and do not represent confirmed offices or lanes.
 * To show real locations, replace NODES with projected coordinates:
 *   x = (lon + 180) / 360 * 1000,  y = (80 - lat) / 138 * 460
 */
const NODES = {
  la: [172, 153],
  ny: [294, 130],
  bog: [294, 251],
  scl: [304, 378],
  lon: [500, 95],
  rom: [535, 127],
  nbo: [602, 271],
  jnb: [578, 353],
  bom: [702, 203],
  bkk: [779, 221],
  sha: [838, 163],
  syd: [919, 380],
}
const ROUTES = [
  ['la', 'ny'],
  ['ny', 'lon'],
  ['ny', 'bog'],
  ['bog', 'scl'],
  ['lon', 'rom'],
  ['rom', 'sha'],
  ['sha', 'syd'],
  ['rom', 'nbo'],
  ['nbo', 'jnb'],
  ['bog', 'nbo'],
  ['scl', 'jnb'],
  ['rom', 'bom'],
  ['bom', 'bkk'],
  ['bkk', 'sha'],
]
// Routes with a small shipment travelling along them
const MOVING = [1, 5, 9, 6]

function arc(a, b) {
  const [x1, y1] = NODES[a]
  const [x2, y2] = NODES[b]
  const lift = Math.min(95, Math.hypot(x2 - x1, y2 - y1) * 0.33)
  return `M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - lift} ${x2} ${y2}`
}

const ICONS = { local: Pin, national: Layers, international: Globe }

export default function Coverage() {
  const root = useRef(null)
  const [motion, setMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(REDUCED)
    const update = () => setMotion(!mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const paths = gsap.utils.toArray('[data-route]')
        paths.forEach((p) => {
          const len = p.getTotalLength()
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
        })
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 75%', once: true } })
        tl.from('[data-map-img]', { autoAlpha: 0, scale: 1.04, duration: 1, ease: 'power2.out' })
          .from('[data-node]', { scale: 0, transformOrigin: '50% 50%', duration: 0.4, stagger: 0.05, ease: 'back.out(2.4)' }, 0.3)
          .to(paths, { strokeDashoffset: 0, duration: 1.3, stagger: 0.08, ease: 'power2.inOut' }, 0.45)
          .from('[data-packet]', { autoAlpha: 0, duration: 0.6 }, '>-0.3')
          .from('[data-rule]', { scaleY: 0, transformOrigin: 'top', duration: 0.8, ease: 'power3.inOut' }, 0.2)
          .from('[data-copy] > *', { autoAlpha: 0, y: 20, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, 0.3)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="coverage" data-nav-dark ref={root} className="relative overflow-hidden bg-charcoal text-white" aria-labelledby="coverage-title">
      <div className="site-x grid items-center gap-8 py-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-6">
        <figure className="relative">
          <div data-map-img>
            <Img image={images.worldMap} sizes="(min-width:1024px) 55vw, 100vw" alt="" className="h-auto w-full opacity-90" />
          </div>
          <svg viewBox="0 0 1000 460" className="absolute inset-0 h-full w-full" role="img" aria-label="Illustrative world map with orange route lines between regions">
            <defs>
              <filter id="cov-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2.6" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="cov-flare">
                <stop offset="0%" stopColor="#FFE2C4" stopOpacity="1" />
                <stop offset="40%" stopColor="#F07A2E" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#EA6A1F" stopOpacity="0" />
              </radialGradient>
            </defs>
            <g fill="none" stroke="#F07A2E" strokeWidth="2.2" strokeLinecap="round" filter="url(#cov-glow)">
              {ROUTES.map(([a, b], i) => (
                <path key={`${a}-${b}`} id={`route-${i}`} data-route d={arc(a, b)} />
              ))}
            </g>
            {motion &&
              MOVING.map((i, k) => (
                <circle key={i} data-packet r="3.6" fill="#FFF3E6" stroke="#EA6A1F" strokeWidth="1.5">
                  <animateMotion dur={`${5 + k * 1.3}s`} begin={`${2 + k * 0.8}s`} repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".45 0 .55 1">
                    <mpath href={`#route-${i}`} />
                  </animateMotion>
                </circle>
              ))}
            {Object.entries(NODES).map(([k, [x, y]], i) => (
              <g key={k} data-node>
                <circle cx={x} cy={y} r="17" fill="url(#cov-flare)" />
                <circle cx={x} cy={y} r="7" fill="none" stroke="#F07A2E" strokeWidth="1.4" style={{ transformBox: 'fill-box', transformOrigin: 'center', animation: `nodePulse 2.8s ${i * 0.3}s ease-out infinite` }} />
                <circle cx={x} cy={y} r="4.6" fill="#FFF3E6" stroke="#EA6A1F" strokeWidth="2.4" />
              </g>
            ))}
          </svg>
          <figcaption className="sr-only">{coverage.note}</figcaption>
        </figure>

        <div className="relative pl-8 lg:pl-12">
          <span data-rule className="absolute bottom-2 left-0 top-2 w-[3px] rounded-full bg-orange" aria-hidden="true" />
          <div data-copy>
            <h2 id="coverage-title" className="h2 max-w-[34rem] text-[clamp(1.9rem,3.7vw,3.5rem)]">
              {coverage.heading}
            </h2>
            <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-0">
              {coverage.items.map((item, i) => {
                const Icon = ICONS[item.id]
                return (
                  <li key={item.id} className="flex items-center">
                    {i > 0 && <span className="mx-4 hidden h-7 w-px bg-white/30 sm:mx-5 sm:block" aria-hidden="true" />}
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-7 w-7 text-orange" />
                      <span className="text-[1.05rem] font-extrabold lg:text-[1.15rem]">{item.title}</span>
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-6 text-[0.72rem] text-white/50">{coverage.note}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
