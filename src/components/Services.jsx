import { useRef } from 'react'
import { services } from '../content/site'
import { useUI } from '../context/UIContext'
import { useReveal } from '../hooks/useReveal'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import { ArrowRight } from './Icons'

/* Layout recipe for each card: grid placement, height and angled edge. */
const LAYOUT = {
  road: { cell: 'md:col-span-6 lg:col-span-5 lg:row-span-2', h: 'h-[360px] md:h-[400px] lg:h-full', clip: 'svc-clip-a', sizes: '(min-width:1024px) 42vw, 100vw' },
  air: { cell: 'md:col-span-3 lg:col-span-3 lg:row-span-2 lg:mt-12', h: 'h-[380px] md:h-[440px] lg:h-[calc(100%-3rem)]', clip: 'svc-clip-b', sizes: '(min-width:1024px) 25vw, (min-width:768px) 50vw, 100vw' },
  sea: { cell: 'md:col-span-3 lg:col-span-4', h: 'h-[320px] md:h-[440px] lg:h-full', clip: 'svc-clip-c', sizes: '(min-width:1024px) 34vw, (min-width:768px) 50vw, 100vw' },
  warehousing: { cell: 'md:col-span-6 lg:col-span-4', h: 'h-[320px] md:h-[320px] lg:h-full', clip: 'svc-clip-d', sizes: '(min-width:1024px) 34vw, 100vw' },
}

function ServiceCard({ service, index, onOpen }) {
  const l = LAYOUT[service.id]
  return (
    <article data-card className={`group relative ${l.cell} ${l.h}`}>
      <div className={`svc-shape absolute inset-0 overflow-hidden rounded-[1.6rem] bg-charcoal ${l.clip}`}>
        <Img image={service.image} sizes={l.sizes} className={`zoom-img h-full w-full object-cover ${service.id === 'air' ? 'object-[62%_50%]' : service.id === 'sea' ? 'object-[50%_60%]' : ''}`} alt="" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/35 to-charcoal/5 transition-opacity duration-500 group-hover:from-charcoal/95" aria-hidden="true" />
      </div>
      <div className="pointer-events-none relative flex h-full flex-col justify-between p-6 text-ivory sm:p-7">
        <span className="text-xs font-medium tracking-[0.3em] text-ivory/75" aria-hidden="true">
          0{index + 1}
        </span>
        <div className={`max-w-sm ${service.id === 'road' ? 'lg:pr-10' : ''} ${service.id === 'sea' ? 'md:pl-4 lg:pl-6' : ''}`}>
          <h3 className="text-[1.65rem] font-medium leading-tight tracking-tight">
            <button
              type="button"
              onClick={() => onOpen(service.id)}
              aria-haspopup="dialog"
              className="pointer-events-auto text-left outline-none after:absolute after:inset-0 after:rounded-[1.6rem] after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-orange focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-ivory"
            >
              {service.title}
              <span className="sr-only">. View service details</span>
            </button>
          </h3>
          <p className="mt-1.5 text-[0.95rem] text-ivory/85">{service.short}</p>
          <div className="card-extra">
            <div className="min-h-0 overflow-hidden">
              <p className="pt-4 text-sm leading-relaxed text-ivory/85">{service.summary}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${service.title} suits`}>
                {service.suits.map((s) => (
                  <li key={s} className="rounded-full border border-ivory/25 bg-ivory/10 px-2.5 py-1 text-[0.72rem] backdrop-blur-sm">
                    {s}
                  </li>
                ))}
              </ul>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-ivory">
                View details
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
        const cards = gsap.utils.toArray('[data-card]')
        gsap.from(cards, {
          autoAlpha: 0,
          y: 60,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-cards]', start: 'top 80%', once: true },
        })
        cards.forEach((card) => {
          const img = card.querySelector('img')
          gsap.fromTo(img, { scale: 1.16 }, { scale: 1, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: card, start: 'top 90%', once: true } })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="services" ref={root} className="section-y relative" aria-labelledby="services-title">
      <div className="site-x">
        <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-reveal className="eyebrow mb-4">Our services</p>
            <h2 data-reveal id="services-title" className="display text-[clamp(2.3rem,4.6vw,4rem)]">
              Every route. <em className="accent">One trusted partner.</em>
            </h2>
          </div>
          <p data-reveal className="max-w-md text-[1.02rem] leading-relaxed text-charcoal-muted lg:col-span-4 lg:col-start-9">
            Tailored solutions to keep your business moving. Choose a service to see how we plan it, what it suits and how to get started.
          </p>
        </div>

        <div data-cards className="grid gap-4 md:grid-cols-6 lg:h-[640px] lg:grid-cols-12 lg:grid-rows-2 lg:gap-5">
          {services.map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i} onOpen={openService} />
          ))}
        </div>
      </div>
    </section>
  )
}
