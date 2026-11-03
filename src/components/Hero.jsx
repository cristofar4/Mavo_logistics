import { useRef } from 'react'
import { hero, images } from '../content/site'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import { ArrowRight } from './Icons'

/* Hero as in the design: copy on the left, the port photo in a slanted panel bleeding off the right edge. */
export default function Hero() {
  const root = useRef(null)
  const words = hero.tagline.split(' ')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.15 })
        tl.fromTo('[data-hero="panel"]', { clipPath: 'inset(0% 0% 0% 100% round 36px)' }, { clipPath: 'inset(0% 0% 0% 0% round 36px)', duration: 1.25, ease: 'power3.inOut', clearProps: 'clipPath' }, 0)
          .fromTo('[data-hero="img"]', { scale: 1.18, xPercent: 6 }, { scale: 1, xPercent: 0, duration: 2, ease: 'power2.out' }, 0)
          .from('[data-hero="label"]', { autoAlpha: 0, x: -16, duration: 0.6 }, 0.25)
          .from('[data-hero="line"] > span', { yPercent: 110, duration: 0.95, stagger: 0.12, ease: 'power4.out' }, 0.35)
          .from('[data-hero="copy"]', { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.1 }, 0.8)
          .from('[data-hero="word"]', { autoAlpha: 0, x: 30, skewX: -12, duration: 0.6, stagger: 0.14 }, 1.0)
          .from('[data-hero="bar"]', { scaleX: 0, transformOrigin: 'left', duration: 0.7, ease: 'power2.inOut' }, 1.4)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="top" ref={root} className="relative overflow-hidden bg-ivory pt-[5.25rem] lg:pt-[5.6rem]" aria-labelledby="hero-title">
      <div className="relative lg:min-h-[clamp(400px,31vw,520px)]">
        {/* Photo panel (desktop) */}
        <div className="absolute bottom-5 right-0 top-1 hidden w-[54%] lg:block" aria-hidden="true">
          <div data-hero="panel" className="hero-panel absolute inset-0 overflow-hidden shadow-lift">
            <div className="hero-panel-inner absolute inset-0">
              <div data-hero="img" className="absolute inset-0">
                <Img image={images.heroPort} priority sizes="(min-width: 1024px) 70vw, 100vw" className="h-full w-full object-cover object-[46%_55%]" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </div>
          </div>
          <div className="absolute bottom-9 right-[6%] text-right">
            <p className="flex justify-end gap-[0.6em] text-[clamp(1.1rem,1.7vw,1.6rem)] font-extrabold italic tracking-[0.32em] text-white [text-shadow:0_2px_16px_rgba(0,0,0,.4)]">
              {words.map((w) => (
                <span key={w} data-hero="word" className="inline-block">
                  {w.toUpperCase()}
                </span>
              ))}
            </p>
            <span data-hero="bar" className="ml-auto mt-3 block h-[3px] w-[38%] rounded-full bg-orange" />
          </div>
        </div>

        <div className="site-x relative z-10 flex items-center lg:min-h-[clamp(400px,31vw,520px)]">
          <div className="w-full pb-8 pt-8 lg:w-[48%] lg:py-8">
            <p data-hero="label" className="eyebrow mb-4 text-[0.78rem]">
              {hero.label}
            </p>
            <h1 id="hero-title" className="display whitespace-nowrap text-[clamp(2.3rem,5vw,5rem)] text-charcoal">
              <span data-hero="line" className="block overflow-hidden pb-[0.05em]">
                <span className="block">Moving business.</span>
              </span>
              <span data-hero="line" className="block overflow-hidden pb-[0.12em]">
                <span className="block">
                  <span className="serif-i pr-[0.08em] text-[1.08em] text-orange">Connecting</span> people.
                </span>
              </span>
            </h1>
            <p data-hero="copy" className="mt-5 max-w-[30rem] text-[1.05rem] leading-relaxed text-charcoal/80 lg:text-[1.15rem]">
              {hero.body}
            </p>
            <div data-hero="copy" className="mt-8">
              <a href="#services" className="btn-dark">
                {hero.cta}
                <ArrowRight />
              </a>
            </div>
          </div>
        </div>

        {/* Photo (phones and tablets) */}
        <div className="relative px-4 pb-6 sm:px-8 lg:hidden">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[22px] shadow-lift">
            <Img image={images.heroPort} priority sizes="100vw" className="h-full w-full object-cover object-[46%_55%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
            <p className="absolute bottom-4 right-5 text-[0.95rem] font-extrabold italic tracking-[0.28em] text-white">{hero.tagline.toUpperCase()}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
