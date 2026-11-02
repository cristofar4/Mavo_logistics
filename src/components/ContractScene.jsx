import { useCallback, useRef, useState } from 'react'
import { contractScene as copy, images, representativeVideo } from '../content/site'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import CloudBubble from './CloudBubble'
import ContractBook from './ContractBook'
import { LogoMark } from './Logo'
import { ArrowRight } from './Icons'

/*
 * Signature section.
 * Layers, back to front:
 *   back wall (with arched opening onto a blurred warehouse)  ->  pillar  ->  cast shadow
 *   ->  representative  ->  front parapet wall (hides the lower body)  ->  speech cloud
 * The representative rises from behind the parapet once about 35% of the section is in view.
 */
export default function ContractScene() {
  const root = useRef(null)
  const bookOrigin = useRef(null)
  const bubbleRef = useRef(null)
  const idle = useRef([])
  const [bubble, setBubble] = useState('ask') // ask | later | thanks | thanksDemo
  const [bookOpen, setBookOpen] = useState(false)
  const [announce, setAnnounce] = useState('')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const section = root.current
        gsap.set('[data-person]', { yPercent: 64, scale: 0.965, transformOrigin: '14.3% 100%' })
        gsap.set('[data-cast]', { yPercent: 70, opacity: 0 })
        gsap.set('[data-lip-shadow]', { opacity: 0 })
        gsap.set('[data-bubble]', { autoAlpha: 0, scale: 0.55, transformOrigin: '8% 96%' })
        gsap.set('[data-bubble] [data-puff]', { scale: 0, transformOrigin: '50% 50%' })
        gsap.set('[data-copy]', { autoAlpha: 0, y: 26 })

        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            // Extremely subtle idle: a slow breath for the person and a gentle drift for the cloud.
            idle.current = [
              gsap.to('[data-person-inner]', { y: -3, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
              gsap.to('[data-bubble-float]', { y: -4, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.6 }),
            ]
          },
        })
        tl.to('[data-person]', { yPercent: 0, scale: 1, duration: 1.1, ease: 'power3.out' }, 0)
          .to('[data-cast]', { yPercent: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 0.05)
          .to('[data-lip-shadow]', { opacity: 1, duration: 0.8, ease: 'power1.out' }, 0.2)
          .to('[data-bubble] [data-puff]', { scale: 1, duration: 0.18, stagger: 0.08, ease: 'power2.out' }, 1.0)
          .to('[data-bubble]', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }, 1.06)
          .to('[data-copy]', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, 1.45)

        ScrollTrigger.create({
          trigger: section,
          // Fire when roughly 35% of the section has entered the viewport.
          start: () => `top bottom-=${Math.min(section.offsetHeight * 0.35, window.innerHeight * 0.6)}`,
          once: true,
          onEnter: () => tl.play(),
        })
        return () => idle.current.forEach((t) => t.kill())
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  const popBubble = () => {
    if (!bubbleRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(bubbleRef.current, { scale: 0.85, autoAlpha: 0.4 }, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(1.6)' })
  }

  const openBook = () => {
    setBookOpen(true)
    setAnnounce('Contract book opened.')
  }

  const onFinished = useCallback((result) => {
    setBookOpen(false)
    if (result === 'sent') setBubble('thanks')
    else if (result === 'demo') setBubble('thanksDemo')
    else setBubble('later')
    setAnnounce(result === 'sent' ? copy.bubbleThanks : result === 'demo' ? copy.bubbleThanksDemo : copy.bubbleLater)
    requestAnimationFrame(popBubble)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const notYet = () => {
    setBubble('later')
    setAnnounce(copy.bubbleLater)
    popBubble()
  }

  const bubbleText = {
    ask: copy.bubble,
    later: copy.bubbleLater,
    thanks: copy.bubbleThanks,
    thanksDemo: copy.bubbleThanksDemo,
  }[bubble]

  return (
    <section id="partner" ref={root} className="contract-section relative overflow-hidden" aria-labelledby="partner-title">
      <div className="site-x relative grid items-center gap-10 py-20 lg:grid-cols-12 lg:gap-6 lg:py-24">
        {/* Copy */}
        <div className="order-2 lg:order-1 lg:col-span-5 lg:pr-6">
          <p data-copy className="eyebrow mb-5 flex items-center gap-3">
            <span className="h-px w-8 bg-orange" aria-hidden="true" />
            {copy.eyebrow}
          </p>
          <h2 data-copy id="partner-title" className="display text-[clamp(2.7rem,5.6vw,5.2rem)]">
            {copy.titleA} <em className="accent block">{copy.titleB}</em>
          </h2>
          <p data-copy className="mt-6 max-w-sm text-[1.15rem] leading-relaxed text-charcoal-muted">
            {copy.body}
          </p>
          <div data-copy className="mt-9 flex flex-wrap items-center gap-5">
            <button type="button" className="btn-primary btn-lg" onClick={openBook} aria-haspopup="dialog">
              {copy.cta}
              <ArrowRight />
            </button>
          </div>
          <p data-copy className="mt-5 max-w-sm text-xs text-charcoal-muted">{copy.note}</p>
        </div>

        {/* Scene */}
        <div className="order-1 lg:order-2 lg:col-span-7">
          <div className="scene relative mx-auto w-full overflow-hidden rounded-[2rem]">
            {/* Back wall */}
            <div className="scene-wall absolute inset-0" aria-hidden="true">
              <div className="scene-arch absolute">
                <Img image={images.about} sizes="40vw" alt="" className="h-full w-full scale-110 object-cover blur-[6px] brightness-[1.05] saturate-[.7]" />
                <div className="absolute inset-0 bg-gradient-to-b from-ivory/30 via-ivory/20 to-ivory/50" />
              </div>
              <div className="scene-glow absolute" />
            </div>

            {/* Pillar the representative leans out from */}
            <div className="scene-pillar absolute" aria-hidden="true" />

            {/* Cast shadow on the back wall, follows the person */}
            <div data-cast className="scene-person-box absolute" aria-hidden="true">
              <Img image={images.representative} sizes="1px" alt="" className="scene-cast h-auto w-full" />
            </div>

            {/* Representative */}
            <div data-person className="scene-person-box absolute">
              <div data-person-inner className="relative">
                {representativeVideo.webm ? (
                  <video className="h-auto w-full" autoPlay muted playsInline preload="auto" aria-label={images.representative.alt} poster={`/images/${images.representative.name}-1600.webp`}>
                    {representativeVideo.mov && <source src={representativeVideo.mov} type='video/mp4; codecs="hvc1"' />}
                    <source src={representativeVideo.webm} type="video/webm" />
                  </video>
                ) : (
                  <Img image={images.representative} sizes="(min-width:1024px) 46vw, 92vw" className="h-auto w-full select-none" />
                )}
                {/* Invisible hotspot on the folder: the contract book flies out from here */}
                <span ref={bookOrigin} className="absolute left-[29%] top-[47.5%] h-[44%] w-[64%]" aria-hidden="true" />
              </div>
            </div>

            {/* Front parapet wall */}
            <div className="scene-parapet absolute inset-x-0 bottom-0" aria-hidden="true">
              <div data-lip-shadow className="scene-lip-shadow absolute inset-x-0 top-0" />
              <div className="absolute bottom-[18%] right-[6%] flex items-center gap-2 text-charcoal/25">
                <LogoMark className="h-5 w-auto" />
                <span className="text-[0.6rem] font-semibold uppercase tracking-[0.4em]">MOVA</span>
              </div>
            </div>

            {/* Speech cloud */}
            <div data-bubble ref={bubbleRef} className="scene-bubble absolute z-10">
              <div data-bubble-float>
                <CloudBubble className="drop-shadow-[0_14px_22px_rgba(32,35,33,.16)]">
                  <p className="font-serif text-[clamp(1.05rem,2.1vw,1.6rem)] leading-[1.1] text-charcoal">{bubbleText}</p>
                  {bubble === 'ask' && (
                    <div className="mt-2.5 flex flex-nowrap justify-center gap-1.5 sm:gap-2">
                      <button type="button" className="bubble-btn bubble-btn-yes" onClick={openBook} aria-haspopup="dialog">
                        {copy.bubbleYes}
                      </button>
                      <button type="button" className="bubble-btn" onClick={notYet}>
                        {copy.bubbleNo}
                      </button>
                    </div>
                  )}
                  {bubble === 'later' && (
                    <div className="mt-2.5 flex justify-center">
                      <button type="button" className="bubble-btn bubble-btn-yes" onClick={openBook} aria-haspopup="dialog">
                        I’m ready
                      </button>
                    </div>
                  )}
                  {(bubble === 'thanks' || bubble === 'thanksDemo') && (
                    <button type="button" className="bubble-link mt-1.5" onClick={openBook} aria-haspopup="dialog">
                      Start another enquiry
                    </button>
                  )}
                </CloudBubble>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      <ContractBook open={bookOpen} originRef={bookOrigin} onFinished={onFinished} />
    </section>
  )
}
