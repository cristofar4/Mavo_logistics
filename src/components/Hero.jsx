import { useRef } from 'react'
import { hero, images } from '../content/site'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import { ArrowRight } from './Icons'

export default function Hero() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const media = root.current.querySelector('[data-hero="media"]')
        const finalClip = getComputedStyle(media).clipPath
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
        tl.from('[data-hero="label"]', { autoAlpha: 0, y: 14, duration: 0.6 })
          .from('[data-hero="line"] > span', { yPercent: 110, duration: 1, stagger: 0.12, ease: 'power4.out' }, '-=0.35')
          .from('[data-hero="copy"]', { autoAlpha: 0, y: 20, duration: 0.7, stagger: 0.1 }, '-=0.55')
          .fromTo(
            media,
            { clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' },
            { clipPath: finalClip, duration: 1.35, ease: 'power3.inOut', clearProps: 'clipPath' },
            0.1,
          )
          .fromTo('[data-hero="media"] img', { scale: 1.18, xPercent: 4 }, { scale: 1, xPercent: 0, duration: 1.9, ease: 'power2.out' }, 0.1)
          .from('[data-hero="side"]', { autoAlpha: 0, duration: 0.8 }, 0.9)
          .from('[data-hero="chip"]', { autoAlpha: 0, y: 16, duration: 0.6 }, 1.1)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="top" ref={root} className="relative overflow-hidden pb-6 pt-32 sm:pt-36 lg:pb-8 lg:pt-40" aria-labelledby="hero-title">
      <div className="site-x relative grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
        {/* Vertical brand line */}
        <div data-hero="side" className="absolute -left-1 top-6 hidden h-[78%] flex-col items-center gap-4 xl:flex" aria-hidden="true">
          <span className="text-[0.6rem] font-medium uppercase tracking-[0.4em] text-charcoal-muted [writing-mode:vertical-rl] rotate-180">
            {hero.side}
          </span>
          <span className="w-px flex-1 bg-gradient-to-b from-orange/80 to-transparent" />
        </div>

        <div className="relative z-10 lg:col-span-5 xl:pl-10">
          <p data-hero="label" className="eyebrow mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-orange" aria-hidden="true" />
            {hero.label}
          </p>
          <h1 id="hero-title" className="display text-[clamp(2.9rem,6.4vw,5.6rem)]">
            <span data-hero="line" className="block overflow-hidden pb-[0.06em]">
              <span className="block">{hero.titleA}</span>
            </span>
            <span data-hero="line" className="block overflow-hidden pb-[0.12em]">
              <span className="block">
                <em className="accent">Connecting</em> people.
              </span>
            </span>
          </h1>
          <p data-hero="copy" className="mt-7 max-w-md text-[1.05rem] leading-relaxed text-charcoal-muted">
            {hero.body}
          </p>
          <a data-hero="copy" href="#services" className="text-link mt-9 inline-flex">
            {hero.link}
            <ArrowRight />
          </a>
        </div>

        <div className="relative lg:col-span-7">
          <div className="hero-frame relative aspect-[4/3] overflow-hidden rounded-[2rem] sm:aspect-[16/11] lg:aspect-[5/4] xl:aspect-[16/13]">
            <div data-hero="media" className="absolute inset-0 hero-clip">
              <Img image={images.heroPort} priority sizes="(min-width: 1024px) 58vw, 100vw" className="h-full w-full object-cover object-[60%_50%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent" aria-hidden="true" />
            </div>
          </div>
          <div data-hero="chip" className="absolute -bottom-6 left-4 z-10 flex items-center gap-4 rounded-2xl bg-ivory px-5 py-4 shadow-soft sm:left-auto sm:right-8" aria-hidden="true">
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-charcoal">Road · Air · Sea</span>
            <span className="h-8 w-px bg-charcoal/15" />
            <span className="text-sm text-charcoal-muted">One team, every leg</span>
          </div>
        </div>
      </div>
    </section>
  )
}
