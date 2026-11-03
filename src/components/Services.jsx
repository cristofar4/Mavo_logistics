import { useRef } from 'react'
import { services } from '../content/site'
import { useUI } from '../context/UIContext'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import { ArrowRight } from './Icons'

const byId = Object.fromEntries(services.map((s) => [s.id, s]))

function OpenButton({ s, onOpen, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(s.id)}
      aria-haspopup="dialog"
      className={`text-left outline-none after:absolute after:inset-0 after:z-20 after:rounded-[20px] after:content-[''] focus-visible:after:ring-[3px] focus-visible:after:ring-orange focus-visible:after:ring-offset-2 focus-visible:after:ring-offset-ivory ${className}`}
    >
      {children}
      <span className="sr-only">. View service details</span>
    </button>
  )
}

function More({ dark }) {
  return (
    <span className="card-more">
      <span className="min-h-0 overflow-hidden">
        <span className={`mt-3 inline-flex items-center gap-2 text-[0.82rem] font-extrabold ${dark ? 'text-white' : 'text-charcoal'}`}>
          View details
          <ArrowRight className="h-4 w-4 text-orange transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </span>
    </span>
  )
}

/* 01 Road freight: tall photo card */
function RoadCard({ onOpen }) {
  const s = byId.road
  return (
    <article data-card className="group relative min-h-[420px] overflow-hidden rounded-[20px] bg-charcoal shadow-soft md:row-span-2 lg:min-h-0">
      <Img image={s.image} sizes="(min-width:1024px) 30vw, (min-width:768px) 50vw, 100vw" alt="" className="zoom-img absolute inset-0 h-full w-full object-cover object-[60%_50%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" aria-hidden="true" />
      <p className="serif-i absolute left-7 top-5 text-[3.4rem] leading-none text-white" aria-hidden="true">
        {s.no}
      </p>
      <div className="absolute inset-x-0 bottom-0 p-7 pr-16 text-white">
        <span className="mb-4 block h-[3px] w-12 rounded-full bg-orange transition-all duration-500 group-hover:w-20" aria-hidden="true" />
        <h3 className="max-w-[11rem] text-[clamp(2rem,2.7vw,2.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
          <OpenButton s={s} onOpen={onOpen}>
            {s.title}
          </OpenButton>
        </h3>
        <p className="mt-3 max-w-[18rem] text-[0.95rem] leading-snug text-white/90 lg:text-[1.02rem]">{s.short}</p>
        <More dark />
      </div>
      <span className="tri-br" aria-hidden="true" />
    </article>
  )
}

/* 02 Air freight and 03 Warehousing: light cards with the photo on the right */
function LightCard({ s, onOpen, pos }) {
  return (
    <article data-card className="group relative min-h-[260px] overflow-hidden rounded-[20px] bg-ivory-deep shadow-soft lg:min-h-0">
      <div className="absolute inset-y-0 right-0 w-[52%] overflow-hidden sm:w-[68%]">
        <Img image={s.image} sizes="(min-width:1024px) 28vw, 60vw" alt="" className={`zoom-img h-full w-full object-cover ${pos}`} />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#EEE7DA_50%,rgba(238,231,218,.75)_64%,rgba(238,231,218,0)_92%)] sm:bg-[linear-gradient(90deg,#EEE7DA_30%,rgba(238,231,218,.85)_45%,rgba(238,231,218,0)_75%)]" aria-hidden="true" />
      <div className="relative flex h-full flex-col justify-center p-7 pr-[38%]">
        <p className="serif-i text-[2.6rem] leading-none text-orange" aria-hidden="true">
          <span className="border-b-[3px] border-orange">{s.no}</span>
        </p>
        <h3 className="mt-3 text-[clamp(1.75rem,2.3vw,2.25rem)] font-extrabold leading-tight tracking-[-0.03em] text-charcoal">
          <OpenButton s={s} onOpen={onOpen}>
            {s.title}
          </OpenButton>
        </h3>
        <p className="mt-2 max-w-[16rem] text-[0.92rem] leading-snug text-charcoal/85 lg:text-[1rem]">{s.short}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label={`${s.title} highlights`}>
          {s.tags.map((t) => (
            <li key={t} className="tag bg-ivory-deep/70">
              {t}
            </li>
          ))}
        </ul>
        <More />
      </div>
    </article>
  )
}

/* 04 Sea freight: navy card with the aerial ship */
function SeaCard({ onOpen }) {
  const s = byId.sea
  return (
    <article data-card className="group relative min-h-[420px] overflow-hidden rounded-[20px] bg-navy shadow-soft md:col-span-2 md:min-h-[320px] lg:col-span-1 lg:row-span-2 lg:min-h-0">
      <div className="absolute inset-y-0 right-0 w-[62%] overflow-hidden md:w-[45%] lg:w-[62%]">
        <Img image={s.image} sizes="(min-width:1024px) 18vw, 40vw" alt="" className="zoom-img h-full w-full object-cover object-[55%_50%]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#173F4E_34%,rgba(23,63,78,.7)_52%,rgba(23,63,78,0)_80%)]" aria-hidden="true" />
      <div className="relative flex h-full flex-col p-7 pr-[40%] text-white">
        <p className="serif-i text-[2.3rem] leading-none text-orange" aria-hidden="true">
          {s.no}
        </p>
        <span className="mt-2 block h-[3px] w-10 rounded-full bg-orange transition-all duration-500 group-hover:w-16" aria-hidden="true" />
        <h3 className="mt-5 max-w-[8rem] text-[clamp(1.9rem,2.5vw,2.4rem)] font-extrabold leading-[1.02] tracking-[-0.03em]">
          <OpenButton s={s} onOpen={onOpen}>
            {s.title}
          </OpenButton>
        </h3>
        <p className="mt-4 max-w-[13rem] text-[0.92rem] leading-snug text-white/90 lg:text-[1rem]">{s.short}</p>
        <More dark />
      </div>
      <span className="tri-tr" aria-hidden="true" />
    </article>
  )
}

export default function Services() {
  const root = useRef(null)
  const { openService } = useUI()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-head] > *', { autoAlpha: 0, y: 22, duration: 0.7, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 82%', once: true } })
        gsap.from('[data-card]', {
          autoAlpha: 0,
          y: 50,
          scale: 0.97,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '[data-cards]', start: 'top 85%', once: true },
        })
        gsap.utils.toArray('[data-card] img').forEach((img) => {
          gsap.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.6, ease: 'power2.out', scrollTrigger: { trigger: img, start: 'top 95%', once: true } })
        })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="services" ref={root} className="relative bg-ivory py-12 sm:py-14 lg:py-16" aria-labelledby="services-title">
      <div className="site-x">
        <div data-head className="mb-7">
          <p className="eyebrow mb-2">Services</p>
          <h2 id="services-title" className="h2 text-charcoal">
            Every route. One trusted partner.
          </h2>
        </div>
        <div data-cards className="grid grid-flow-row-dense gap-4 md:grid-cols-2 lg:h-[clamp(500px,40vw,600px)] lg:grid-cols-[1.08fr_1.5fr_1fr] lg:grid-rows-2">
          <RoadCard onOpen={openService} />
          <LightCard s={byId.air} onOpen={openService} pos="object-[60%_45%]" />
          <SeaCard onOpen={openService} />
          <LightCard s={byId.warehousing} onOpen={openService} pos="object-[50%_50%]" />
        </div>
      </div>
    </section>
  )
}
