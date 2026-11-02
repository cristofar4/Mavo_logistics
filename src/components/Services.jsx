import { useRef } from 'react'
import { services } from '../content/site'
import { useUI } from '../context/UIContext'
import { useReveal } from '../hooks/useReveal'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import { ArrowRight } from './Icons'

/* Grid placement and height for each card, following the design's slanted mosaic. */
const LAYOUT = {
  road: { o: '50% calc(50% - 24px)', cell: 'md:col-span-6 lg:col-span-5 lg:row-span-2 lg:mt-12', h: 'h-[300px] md:h-[340px] lg:h-auto', pos: 'object-[50%_60%]', sizes: '(min-width:1024px) 45vw, 100vw' },
  air: { o: '50% calc(50% + 24px)', cell: 'md:col-span-3 lg:col-span-3 lg:row-span-2 lg:mb-12', h: 'h-[300px] md:h-[360px] lg:h-auto', pos: 'object-[66%_50%]', sizes: '(min-width:1024px) 28vw, (min-width:768px) 50vw, 100vw' },
  sea: { o: '50% calc(100% + 6px)', cell: 'md:col-span-3 lg:col-span-4', h: 'h-[260px] md:h-[360px] lg:h-auto', pos: 'object-[45%_62%]', sizes: '(min-width:1024px) 36vw, (min-width:768px) 50vw, 100vw' },
  warehousing: { o: '50% -6px', cell: 'md:col-span-6 lg:col-span-4', h: 'h-[260px] md:h-[280px] lg:h-auto', pos: 'object-[55%_55%]', sizes: '(min-width:1024px) 36vw, 100vw' },
}

function ServiceCard({ service, onOpen }) {
  const l = LAYOUT[service.id]
  return (
    <article data-card className={`group relative ${l.cell} ${l.h}`}>
      <div className="skew-card absolute inset-0 bg-charcoal shadow-soft" style={{ '--o': l.o }}>
        <div className="unskew-media absolute inset-0">
          <Img image={service.image} sizes={l.sizes} className={`zoom-img h-full w-full object-cover ${l.pos}`} alt="" />
        </div>
        <div className="unskew-media absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/25 to-transparent transition-opacity duration-500" aria-hidden="true" />
      </div>
      <div className="pointer-events-none relative flex h-full flex-col justify-end px-7 pb-6 pt-6 text-white sm:px-9 lg:px-10">
        <div className="max-w-[19rem]">
          <h3 className="text-[1.3rem] font-extrabold leading-tight tracking-tight">
            <button
              type="button"
              onClick={() => onOpen(service.id)}
              aria-haspopup="dialog"
              className="pointer-events-auto text-left outline-none after:absolute after:inset-0 after:content-[''] focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-orange focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-ivory"
            >
              {service.title}
              <span className="sr-only">. View service details</span>
            </button>
          </h3>
          <p className="mt-1 text-[0.86rem] font-medium text-white/85">{service.short}</p>
          <div className="card-extra">
            <div className="min-h-0 overflow-hidden">
              <p className="pt-3 text-[0.82rem] leading-relaxed text-white/85">{service.summary}</p>
              <span className="mt-3 inline-flex items-center gap-2 rounded-md bg-orange px-3 py-1.5 text-[0.78rem] font-bold text-white">
                View details
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Services() {
  const root = useRef(null)
  const { openService } = useUI()
  useReveal(root)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-card]', {
          autoAlpha: 0,
          x: 50,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-cards]', start: 'top 82%', once: true },
        })
        gsap.utils.toArray('[data-card] img').forEach((img) => {
          gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: img, start: 'top 92%', once: true } })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="services" ref={root} className="relative py-14 sm:py-16 lg:py-20" aria-labelledby="services-title">
      <div className="site-x">
        <div className="mb-9 flex flex-col gap-3 lg:mb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 data-reveal id="services-title" className="h2">
              Every route. One trusted partner.
            </h2>
            <p data-reveal className="lead">
              Tailored solutions to keep your business moving.
            </p>
          </div>
          <p data-reveal className="max-w-sm text-[0.9rem] text-charcoal-muted lg:text-right">
            Choose a service to see how we plan it, what it suits and how to get started.
          </p>
        </div>

        <div data-cards className="grid gap-4 md:grid-cols-6 md:px-4 lg:h-[470px] lg:grid-cols-12 lg:grid-rows-2 lg:gap-x-5 lg:gap-y-3 lg:px-12">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} onOpen={openService} />
          ))}
        </div>
      </div>
    </section>
  )
}
