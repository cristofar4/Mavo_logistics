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
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 })
        tl.fromTo('[data-hero="panel"]', { clipPath: 'inset(0% 0% 0% 100% round 28px)' }, { clipPath: 'inset(0% 0% 0% 0% round 28px)', duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath' }, 0)
          .fromTo('[data-hero="img"]', { scale: 1.16, xPercent: 5 }, { scale: 1, xPercent: 0, duration: 1.9, ease: 'power2.out' }, 0)
          .from('[data-hero="label"]', { autoAlpha: 0, y: 14, duration: 0.6 }, 0.2)
          .from('[data-hero="line"] > span', { yPercent: 110, duration: 0.95, stagger: 0.1, ease: 'power4.out' }, 0.3)
          .from('[data-hero="copy"]', { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.1 }, 0.75)
          .from('[data-hero="bracket"]', { scaleY: 0, transformOrigin: 'top', duration: 1, ease: 'power2.inOut' }, 0.4)
          .from('[data-hero="side"]', { autoAlpha: 0, y: -10, duration: 0.6 }, 0.3)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="top" ref={root} className="relative overflow-hidden pt-[6.5rem]" aria-labelledby="hero-title">
      <div className="relative flex flex-col lg:block lg:min-h-[min(calc(100svh-6.5rem),660px)]">
        {/* Photo panel: slanted, rounded, bleeding off the right edge on desktop */}
        <div className="order-2 px-4 pb-4 sm:px-8 lg:absolute lg:inset-y-0 lg:right-0 lg:w-[58%] lg:p-0 lg:pb-6">
          <div data-hero="panel" className="hero-panel relative aspect-[4/3] overflow-hidden rounded-[22px] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:rounded-r-none">
            <div className="hero-panel-unskew absolute inset-0">
              <div data-hero="img" className="absolute inset-0">
                <Img image={images.heroPort} priority sizes="(min-width: 1024px) 70vw, 100vw" className="h-full w-full object-cover object-[60%_55%]" />
              </div>
            </div>
            <div className="hero-panel-shade absolute inset-0 bg-gradient-to-t from-charcoal/25 via-transparent to-transparent" aria-hidden="true" />
          </div>
        </div>

        <div className="site-x relative z-10 order-1 flex items-center lg:min-h-[min(calc(100svh-6.5rem),660px)]">
          <div className="relative w-full pb-8 pt-6 pl-9 sm:pl-12 lg:w-[44%] lg:py-14 xl:pl-14">
            {/* Vertical brand line with the orange bracket, as in the design */}
            <div className="absolute bottom-6 left-0 top-10 flex w-7 flex-col items-start lg:top-14" aria-hidden="true">
              <span data-hero="side" className="ml-[-3px] text-[0.55rem] font-bold uppercase tracking-[0.36em] text-charcoal/60 [writing-mode:vertical-rl] rotate-180">
                {hero.side}
              </span>
              <span data-hero="bracket" className="hero-bracket mt-4 w-7 flex-1" />
            </div>

            <p data-hero="label" className="eyebrow mb-5">
              {hero.label}
            </p>
            <h1 id="hero-title" className="display text-[clamp(2.7rem,5.4vw,4.9rem)]">
              <span data-hero="line" className="block overflow-hidden pb-[0.04em]">
                <span className="block">Moving</span>
              </span>
              <span data-hero="line" className="block overflow-hidden pb-[0.04em]">
                <span className="block">business.</span>
              </span>
              <span data-hero="line" className="block overflow-hidden pb-[0.04em]">
                <span className="block text-orange">Connecting</span>
              </span>
              <span data-hero="line" className="block overflow-hidden pb-[0.1em]">
                <span className="block text-orange">people.</span>
              </span>
            </h1>
            <p data-hero="copy" className="mt-6 max-w-[26rem] text-[1rem] leading-relaxed text-charcoal-muted">
              {hero.body}
            </p>
            <a data-hero="copy" href="#services" className="text-link mt-7 inline-flex">
              {hero.link}
              <ArrowRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
