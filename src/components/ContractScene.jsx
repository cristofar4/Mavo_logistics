import { useCallback, useRef, useState } from 'react'
import { contractScene as copy, images, representativeGeometry as geo, representativeVideo } from '../content/site'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import CloudBubble from './CloudBubble'
import ContractBook from './ContractBook'
import { ArrowRight } from './Icons'

/*
 * Signature section, full width as in the design.
 *
 * Layers, back to front:
 *   blurred office backdrop
 *   body clip (everything left of the wall edge is hidden)  ->  representative body + cast shadow
 *   ivory wall panel (carries the headline on desktop) with a soft shadow onto the person
 *   hand clip (removed once the hand comes forward)  ->  pen hand
 *   speech cloud
 *
 * Sequence, once per visit, when about 35% of the section is in view:
 *   1. slides out from behind the wall edge          1.1s
 *   2. waves from behind the wall, "Hi there!"         about 1.3s
 *   3. brings the pen hand forward over the wall       0.85s
 *   4. cloud changes to "Ready to sign with us?"       0.4s
 *   5. headline and action appear                       0.5s
 */

// Wave pose: the pen hand raised beside the head, wrist hidden behind the wall edge.
// Values are relative to the hand's resting position (percent of the hand's own box).
const WAVE = { xPercent: 60, yPercent: -186, scale: 0.76, rotation: -92 }

export default function ContractScene() {
  const root = useRef(null)
  const bookOrigin = useRef(null)
  const bubbleRef = useRef(null)
  const idle = useRef([])
  const [bubble, setBubble] = useState('ask') // hello | ask | later | thanks | thanksDemo
  const [bookOpen, setBookOpen] = useState(false)
  const [announce, setAnnounce] = useState('')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const section = root.current
        const handClip = section.querySelector('[data-hand-clip]')
        setBubble('hello')
        gsap.set('[data-move]', { xPercent: -42 })
        gsap.set('[data-hand]', { ...WAVE, transformOrigin: '12% 72%' })
        gsap.set('[data-bubble]', { autoAlpha: 0, scale: 0.55, transformOrigin: '8% 96%' })
        gsap.set('[data-bubble] [data-puff]', { scale: 0, transformOrigin: '50% 50%' })
        gsap.set('[data-copy]', { autoAlpha: 0, y: 24 })
        // Clip the hand at the wall edge while it waves; the clip slides away as the hand comes forward.
        const edgePx = section.querySelector('.cscene-panel').offsetWidth
        gsap.set(handClip, { clipPath: `inset(-40% -40% -40% ${edgePx}px)` })

        const pop = () => gsap.fromTo(bubbleRef.current, { scale: 0.8 }, { scale: 1, duration: 0.4, ease: 'back.out(1.7)' })

        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            // After the entrance only an extremely subtle breathing movement remains.
            idle.current = [
              gsap.to('[data-move]', { y: -3, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
              gsap.to('[data-bubble-float]', { y: -4, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 }),
            ]
          },
        })

        // 1. Emerge from behind the wall
        tl.to('[data-move]', { xPercent: 0, duration: 1.1, ease: 'power2.out' }, 0)
        // 2. Wave from behind the wall edge, with a quick hello
        tl.to('[data-bubble] [data-puff]', { scale: 1, duration: 0.16, stagger: 0.07, ease: 'power2.out' }, 0.75)
          .to('[data-bubble]', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)' }, 0.8)
        const wave = gsap.timeline({ defaults: { ease: 'sine.inOut', duration: 0.21 } })
        wave
          .to('[data-hand]', { rotation: -108 })
          .to('[data-hand]', { rotation: -76 })
          .to('[data-hand]', { rotation: -106 })
          .to('[data-hand]', { rotation: -78 })
          .to('[data-hand]', { rotation: -102 })
          .to('[data-hand]', { rotation: -90 })
        tl.add(wave, 0.85)
        // 3. Lower the pen hand and reach toward the visitor, coming around the wall edge
        tl.to('[data-hand]', { xPercent: 0, yPercent: 0, scale: 1, rotation: 0, duration: 0.85, ease: 'power2.inOut' }, '>-0.05')
          .to(handClip, { clipPath: `inset(-40% -40% -40% -${edgePx}px)`, duration: 0.6, ease: 'power1.in' }, '<0.15')
          .set(handClip, { clipPath: 'none' })
        // 4. The cloud changes to the question
        tl.call(() => {
          setBubble('ask')
          pop()
        }, null, '-=0.15')
        // 5. Headline and action
        tl.to('[data-copy]', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '+=0.2')

        ScrollTrigger.create({
          trigger: section,
          // Fire when roughly 35% of the section has entered the viewport.
          start: () => `top bottom-=${Math.min(section.offsetHeight * 0.35, window.innerHeight * 0.6)}`,
          once: true,
          onEnter: () => tl.play(),
        })
        return () => {
          idle.current.forEach((t) => t.kill())
          setBubble('ask')
        }
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
    hello: copy.hello,
    ask: copy.bubble,
    later: copy.bubbleLater,
    thanks: copy.bubbleThanks,
    thanksDemo: copy.bubbleThanksDemo,
  }[bubble]

  const hb = geo.handBox
  const useVideo = !!representativeVideo.webm

  return (
    <section id="partner" ref={root} className="relative overflow-hidden bg-ivory lg:h-[clamp(580px,84vh,680px)]" aria-labelledby="partner-title">
      {/* Scene */}
      <div className="cscene relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] lg:absolute lg:inset-0 lg:aspect-auto">
        <div className="absolute inset-0" aria-hidden="true">
          <Img image={images.office} sizes="100vw" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/10 via-transparent to-charcoal/10" />
        </div>

        {/* Body, hidden behind the wall edge */}
        <div className="cscene-clip absolute inset-0">
          <div data-move className="cscene-person absolute">
            <Img image={images.repBody} sizes="1px" alt="" aria-hidden="true" className="cscene-cast absolute inset-0 h-full w-full" />
            {useVideo ? (
              <video className="relative h-full w-full" autoPlay muted playsInline preload="auto" aria-label={images.repBody.alt} poster={`/images/${images.repBody.name}-1600.webp`}>
                {representativeVideo.mov && <source src={representativeVideo.mov} type='video/mp4; codecs="hvc1"' />}
                <source src={representativeVideo.webm} type="video/webm" />
              </video>
            ) : (
              <Img image={images.repBody} sizes="(min-width:1024px) 56vw, 100vw" className="relative h-full w-full select-none" />
            )}
            {/* Invisible hotspot on the folder: the contract book flies out from here */}
            <span ref={bookOrigin} className="absolute left-[29%] top-[47.5%] h-[44%] w-[64%]" aria-hidden="true" />
          </div>
        </div>

        {/* The ivory wall */}
        <div className="cscene-panel absolute inset-y-0 left-0" aria-hidden="true" />

        {/* Pen hand: clipped by the wall while waving, free once it comes forward */}
        {!useVideo && (
          <div data-hand-clip className="absolute inset-0" aria-hidden="true">
            <div data-move className="cscene-person absolute">
              <div data-hand className="absolute" style={{ left: `${hb.left}%`, top: `${hb.top}%`, width: `${hb.width}%`, height: `${hb.height}%` }}>
                <Img image={images.repHand} sizes="(min-width:1024px) 14vw, 25vw" alt="" className="h-full w-full select-none drop-shadow-[0_18px_18px_rgba(0,0,0,.18)]" />
              </div>
            </div>
          </div>
        )}

        {/* Speech cloud */}
        <div data-bubble ref={bubbleRef} className="cscene-bubble absolute z-10">
          <div data-bubble-float>
            <CloudBubble className="drop-shadow-[0_14px_22px_rgba(32,35,33,.2)]">
              <p className={`font-extrabold leading-[1.1] tracking-[-0.02em] text-charcoal ${bubble === 'hello' ? 'text-[clamp(1.2rem,2.4vw,1.75rem)]' : bubble === 'ask' ? 'text-[clamp(0.95rem,1.6vw,1.25rem)]' : 'text-[clamp(0.85rem,1.4vw,1.05rem)]'}`}>
                {bubbleText}
              </p>
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
                <div className="mt-2 flex justify-center">
                  <button type="button" className="bubble-btn bubble-btn-yes" onClick={openBook} aria-haspopup="dialog">
                    I’m ready
                  </button>
                </div>
              )}
              {(bubble === 'thanks' || bubble === 'thanksDemo') && (
                <button type="button" className="bubble-link mt-1" onClick={openBook} aria-haspopup="dialog">
                  Start another enquiry
                </button>
              )}
            </CloudBubble>
          </div>
        </div>
      </div>

      {/* Copy: on the wall panel on desktop, below the scene on smaller screens */}
      <div className="relative lg:pointer-events-none lg:absolute lg:inset-0">
        <div className="site-x flex h-full items-center py-12 lg:py-0">
          <div className="lg:pointer-events-auto lg:max-w-[calc(45vw-11rem)] xl:max-w-[30rem]">
            <h2 data-copy id="partner-title" className="display text-[clamp(2.5rem,4.6vw,4.6rem)]">
              Your next chapter <span className="text-orange">starts here.</span>
            </h2>
            <p data-copy className="mt-5 max-w-sm text-[1.15rem] font-medium leading-snug text-charcoal/80">
              {copy.body}
            </p>
            <div data-copy className="mt-8">
              <button type="button" className="btn-primary btn-lg" onClick={openBook} aria-haspopup="dialog">
                {copy.cta}
                <ArrowRight />
              </button>
            </div>
            <p data-copy className="mt-4 max-w-sm text-xs text-charcoal-muted">{copy.note}</p>
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
