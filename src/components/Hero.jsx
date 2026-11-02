import { useLayoutEffect, useRef } from 'react'
import { hero, images } from '../content/site'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import { ArrowRight } from './Icons'

/*
 * Hero as in the design: the nav card and the text area form one light shape,
 * and the photo fills the rest, running up behind the nav to the top of the page
 * with a slanted, rounded edge.
 */
const SKEW_TAN = Math.tan((18 * Math.PI) / 180) // matches .hero-panel skewX(-18deg)

export default function Hero() {
  const root = useRef(null)
  const panelWrap = useRef(null)
  const fillet = useRef(null)

  // Round the photo's corner exactly where its slanted edge meets the bottom of the nav card.
  useLayoutEffect(() => {
    const place = () => {
      const wrap = panelWrap.current
      const f = fillet.current
      if (!wrap || !f || !wrap.offsetWidth) return
      const navBottom = parseFloat(getComputedStyle(root.current).paddingTop)
      const h = wrap.offsetHeight
      f.style.left = `${wrap.offsetLeft + (h - navBottom) * SKEW_TAN}px`
      f.style.top = `${navBottom}px`
    }
    place()
    const ro = new ResizeObserver(place)
    ro.observe(root.current)
    return () => ro.disconnect()
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.1 })
        tl.fromTo('[data-hero="panel"]', { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power3.inOut', clearProps: 'clipPath' }, 0)
          .fromTo('[data-hero="img"]', { scale: 1.16, xPercent: 5 }, { scale: 1, xPercent: 0, duration: 1.9, ease: 'power2.out' }, 0)
          .from('[data-hero="label"]', { autoAlpha: 0, y: 14, duration: 0.6 }, 0.2)
          .from('[data-hero="line"] > span', { yPercent: 110, duration: 0.95, stagger: 0.1, ease: 'power4.out' }, 0.3)
          .from('[data-hero="copy"]', { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.1 }, 0.75)
          .from('[data-hero="bracket"]', { scaleY: 0, transformOrigin: 'top', duration: 0.9, stagger: 0.15, ease: 'power2.inOut' }, 0.35)
          .from('[data-hero="side"]', { autoAlpha: 0, duration: 0.6 }, 0.5)
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="top" ref={root} className="relative overflow-hidden bg-ivory-soft pt-[6.5rem]" aria-labelledby="hero-title">
      {/* Desktop photo panel, from the very top of the page */}
      <div ref={panelWrap} className="absolute inset-y-0 left-[max(40%,calc(50%-108px))] right-0 hidden lg:block" aria-hidden="true">
        <div data-hero="panel" className="hero-panel absolute inset-0 overflow-hidden">
          <div className="hero-panel-unskew absolute inset-0">
            <div data-hero="img" className="absolute inset-0">
              <Img image={images.heroPort} priority sizes="(min-width: 1024px) 75vw, 100vw" className="h-full w-full object-cover object-[62%_55%]" />
            </div>
          </div>
        </div>
      </div>
      <span ref={fillet} className="hero-fillet absolute z-[1] hidden lg:block" aria-hidden="true" />

      <div className="site-x relative z-10 flex items-center lg:min-h-[min(calc(100svh-6.5rem),640px)]">
        <div className="relative w-full pb-8 pl-10 pt-8 sm:pl-14 lg:w-[38%] lg:py-12 xl:pl-16">
          {/* Orange bracket with the brand line, as in the design */}
          <div className="absolute bottom-3 left-0 top-6 flex w-8 flex-col items-start" aria-hidden="true">
            <span data-hero="bracket" className="h-14 w-0 border-l-2 border-orange" />
            <span data-hero="side" className="-ml-[5px] my-3 text-[0.55rem] font-bold uppercase tracking-[0.36em] text-charcoal/60 [writing-mode:vertical-rl] rotate-180">
              {hero.side}
            </span>
            <span data-hero="bracket" className="hero-bracket w-8 flex-1" />
          </div>

          <p data-hero="label" className="eyebrow mb-4">
            {hero.label}
          </p>
          <h1 id="hero-title" className="display text-[clamp(2.7rem,5vw,4.6rem)]">
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
          <p data-hero="copy" className="mt-5 max-w-[21rem] text-[1rem] leading-relaxed text-charcoal-muted">
            {hero.body}
          </p>
          <a data-hero="copy" href="#services" className="text-link mt-6 inline-flex">
            {hero.link}
            <ArrowRight />
          </a>
        </div>
      </div>

      {/* Smaller screens: photo below the text */}
      <div className="px-4 pb-6 sm:px-8 lg:hidden">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] sm:aspect-[16/10]">
          <Img image={images.heroPort} priority sizes="100vw" className="h-full w-full object-cover object-[60%_55%]" />
        </div>
      </div>
    </section>
  )
}
