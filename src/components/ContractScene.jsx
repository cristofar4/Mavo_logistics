import { useCallback, useRef, useState } from 'react'
import { contractScene as copy, images, representativeGeometry as geo, representativeVideo } from '../content/site'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../lib/gsap'
import Img from './Img'
import CloudBubble from './CloudBubble'
import ContractBook from './ContractBook'
import { LogoMark } from './Logo'
import { ArrowRight } from './Icons'

/*
 * Signature section, full width as in the design, built from real photographs.
 *
 * Layers, back to front:
 *   blurred office backdrop
 *   representative (clipped at the wall edge): waving pose + swinging forearm, then the arm down pose
 *   ivory wall panel with the headline (desktop)
 *   front counter, with the contract book and pen he places on it
 *   speech cloud
 *
 * Sequence, once per visit, when the visitor reaches the section (about half of it in view):
 *   1. slides out from behind the wall, already waving      1.1s
 *   2. waves (forearm swings from the elbow), "Hi there!"    about 1.4s
 *   3. lowers his arm and places the contract on the counter 0.9s
 *   4. cloud changes to "Ready to sign with us?"              0.4s
 *   5. action appears                                         0.5s
 */
function CounterBook() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-[-4%_-3%_-6%_-3%] rounded-[10px] bg-[#232624] shadow-[0_18px_30px_-10px_rgba(0,0,0,.45)]" />
      <div className="absolute inset-0 grid grid-cols-2 overflow-hidden rounded-[6px]">
        <div className="relative bg-[linear-gradient(90deg,#fbf9f3,#f1ece1)] p-[7%]">
          <div className="flex items-center gap-1 text-charcoal/70">
            <LogoMark className="h-[0.7em] w-auto" />
            <span className="text-[0.32em] font-bold uppercase tracking-[0.3em]">MOVA</span>
          </div>
          <p className="mt-[10%] text-[0.36em] font-extrabold uppercase tracking-[0.12em] text-charcoal/70">Partnership</p>
          {[...Array(7)].map((_, i) => (
            <span key={i} className="mt-[6%] block h-[2px] rounded bg-charcoal/15" style={{ width: `${88 - (i % 3) * 14}%` }} />
          ))}
        </div>
        <div className="relative bg-[linear-gradient(270deg,#fbf9f3,#f1ece1)] p-[7%]">
          <p className="text-center text-[0.5em] font-extrabold uppercase tracking-[0.14em] text-charcoal">Contract</p>
          {[...Array(5)].map((_, i) => (
            <span key={i} className="mt-[7%] block h-[2px] rounded bg-charcoal/15" style={{ width: `${92 - (i % 2) * 18}%` }} />
          ))}
          <span className="absolute bottom-[14%] left-[8%] right-[10%] border-b border-dashed border-charcoal/40" />
          <span className="absolute bottom-[16%] left-[8%] text-[0.42em] font-bold text-orange">✕</span>
        </div>
        <span className="pointer-events-none absolute inset-y-0 left-1/2 w-[14%] -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(0,0,0,.14),transparent)]" />
      </div>
      {/* Pen lying across the right page, offered to the visitor */}
      <svg viewBox="0 0 200 24" className="absolute bottom-[8%] right-[-6%] w-[62%] -rotate-[24deg] drop-shadow-[0_6px_4px_rgba(0,0,0,.3)]" aria-hidden="true">
        <rect x="18" y="6" width="150" height="12" rx="6" fill="#1d201e" />
        <rect x="150" y="6" width="22" height="12" rx="2" fill="#c9cdd0" />
        <path d="M172 7 L196 12 L172 17 Z" fill="#9aa0a4" />
        <rect x="24" y="3" width="44" height="4" rx="2" fill="#D96936" />
        <rect x="18" y="8" width="150" height="3" rx="1.5" fill="#ffffff" opacity=".18" />
      </svg>
    </div>
  )
}

export default function ContractScene() {
  const root = useRef(null)
  const bookOrigin = useRef(null)
  const bubbleRef = useRef(null)
  const idle = useRef([])
  const [bubble, setBubble] = useState('ask') // hello | ask | later | thanks | thanksDemo
  const [bookOpen, setBookOpen] = useState(false)
  const [announce, setAnnounce] = useState('')
  const useVideo = !!representativeVideo.webm

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const section = root.current
        setBubble('hello')
        gsap.set('[data-move]', { xPercent: -46 })
        gsap.set('[data-pose="smile"]', { autoAlpha: 0 })
        gsap.set('[data-arm]', { rotation: -6, transformOrigin: geo.armPivot })
        gsap.set('[data-book]', { autoAlpha: 0, yPercent: 55, rotationX: -40, transformPerspective: 900, transformOrigin: '50% 100%' })
        gsap.set('[data-bubble]', { autoAlpha: 0, scale: 0.55, transformOrigin: '12% 96%' })
        gsap.set('[data-bubble] [data-puff]', { scale: 0, transformOrigin: '50% 50%' })
        gsap.set('[data-copy]', { autoAlpha: 0, y: 22 })
        gsap.set('[data-cta]', { autoAlpha: 0, y: 18 })

        const pop = () => gsap.fromTo(bubbleRef.current, { scale: 0.82 }, { scale: 1, duration: 0.4, ease: 'back.out(1.7)' })

        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            idle.current = [
              gsap.to('[data-move]', { y: -3, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
              gsap.to('[data-bubble-float]', { y: -4, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 }),
            ]
          },
        })

        // 1. Slide out from behind the wall, already waving
        tl.to('[data-move]', { xPercent: 0, duration: 1.1, ease: 'power3.out' }, 0)
        // 2. Wave from the elbow, with a hello
        const wave = gsap.timeline({ defaults: { ease: 'sine.inOut', duration: 0.24 } })
        wave
          .to('[data-arm]', { rotation: 13 })
          .to('[data-arm]', { rotation: -11 })
          .to('[data-arm]', { rotation: 12 })
          .to('[data-arm]', { rotation: -10 })
          .to('[data-arm]', { rotation: 8 })
          .to('[data-arm]', { rotation: 0 })
        tl.add(wave, 0.35)
        tl.to('[data-bubble] [data-puff]', { scale: 1, duration: 0.16, stagger: 0.07, ease: 'power2.out' }, 0.8)
          .to('[data-bubble]', { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(1.6)' }, 0.86)
          .to('[data-copy]', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, 1.3)
        // 3. Lower the arm (cross dissolve to the real arm down photo) and place the contract on the counter
        tl.to('[data-arm]', { rotation: 24, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, 2.0)
          .to('[data-pose="wave"]', { autoAlpha: 0, duration: 0.35, ease: 'power1.inOut' }, '<0.05')
          .to('[data-pose="smile"]', { autoAlpha: 1, duration: 0.35, ease: 'power1.inOut' }, '<')
          .to('[data-book]', { autoAlpha: 1, yPercent: 0, rotationX: -12, duration: 0.6, ease: 'back.out(1.4)' }, '<0.2')
        // 4. Ask the question
        tl.call(() => {
          setBubble('ask')
          pop()
        }, null, '>-0.1')
        // 5. Action
        tl.to('[data-cta]', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, '>0.15')

        ScrollTrigger.create({
          trigger: section,
          // Play when the visitor reaches the section: about half of it in view.
          start: () => `top bottom-=${Math.min(section.offsetHeight * 0.5, window.innerHeight * 0.62)}`,
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

  const bubbleText = { hello: copy.hello, ask: copy.bubble, later: copy.bubbleLater, thanks: copy.bubbleThanks, thanksDemo: copy.bubbleThanksDemo }[bubble]
  const ab = geo.armBox

  return (
    <section id="partner" ref={root} className="relative overflow-hidden bg-ivory lg:h-[clamp(600px,86vh,700px)]" aria-labelledby="partner-title">
      <div className="cscene relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] lg:absolute lg:inset-0 lg:aspect-auto">
        <div className="absolute inset-0" aria-hidden="true">
          <Img image={images.office} sizes="100vw" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/10 via-transparent to-charcoal/10" />
        </div>

        {/* Representative, hidden behind the wall edge until he steps out */}
        <div className="cscene-clip absolute inset-0">
          <div data-move className="cscene-person absolute">
            {useVideo ? (
              <video className="h-full w-full object-contain object-bottom" autoPlay muted playsInline preload="auto" aria-label={images.repWave.alt}>
                {representativeVideo.mov && <source src={representativeVideo.mov} type='video/mp4; codecs="hvc1"' />}
                <source src={representativeVideo.webm} type="video/webm" />
              </video>
            ) : (
              <>
                <Img image={images.repSmile} sizes="(min-width:1024px) 60vw, 100vw" alt="" aria-hidden="true" className="cscene-cast absolute inset-0 h-full w-full" />
                <div data-pose="wave" className="absolute inset-0 motion-reduce:hidden">
                  <Img image={images.repWave} sizes="(min-width:1024px) 60vw, 100vw" alt="" aria-hidden="true" className="h-full w-full select-none" />
                  <div data-arm className="absolute" style={{ left: `${ab.left}%`, top: `${ab.top}%`, width: `${ab.width}%`, height: `${ab.height}%` }}>
                    <Img image={images.repArm} sizes="(min-width:1024px) 16vw, 25vw" alt="" className="h-full w-full select-none" />
                  </div>
                </div>
                <div data-pose="smile" className="absolute inset-0">
                  <Img image={images.repSmile} sizes="(min-width:1024px) 60vw, 100vw" className="h-full w-full select-none" />
                </div>
              </>
            )}
          </div>
        </div>

        {/* The ivory wall */}
        <div className="cscene-panel absolute inset-y-0 left-0" aria-hidden="true" />

        {/* Front counter with the contract he places on it */}
        <div className="cscene-counter absolute bottom-0 right-0" aria-hidden="true">
          <div className="cscene-counter-top absolute inset-x-0 top-0" />
          <div className="absolute bottom-[22%] right-[5%] flex items-center gap-2 text-charcoal/25">
            <LogoMark className="h-4 w-auto" />
            <span className="text-[0.55rem] font-bold uppercase tracking-[0.4em]">MOVA</span>
          </div>
        </div>
        <div data-book ref={bookOrigin} className="cscene-book absolute" aria-hidden="true">
          <CounterBook />
        </div>

        {/* Speech cloud */}
        <div data-bubble ref={bubbleRef} className="cscene-bubble absolute z-10">
          <div data-bubble-float>
            <CloudBubble className="drop-shadow-[0_14px_22px_rgba(32,35,33,.2)]">
              <p className={`font-extrabold leading-[1.1] tracking-[-0.02em] text-charcoal ${bubble === 'hello' ? 'text-[clamp(1.2rem,2.4vw,1.75rem)]' : bubble === 'ask' ? 'text-[clamp(0.95rem,1.6vw,1.25rem)]' : 'text-[clamp(0.82rem,1.3vw,1rem)]'}`}>
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
      <div className="relative z-20 lg:pointer-events-none lg:absolute lg:inset-0">
        <div className="site-x flex h-full items-center py-12 lg:py-0">
          <div className="lg:pointer-events-auto lg:max-w-[calc(38vw-6rem)] xl:max-w-[29rem]">
            <h2 data-copy id="partner-title" className="display text-[clamp(2.4rem,4.2vw,4.4rem)]">
              Your next chapter <span className="text-orange">starts here.</span>
            </h2>
            <p data-copy className="mt-5 max-w-sm text-[1.15rem] font-medium leading-snug text-charcoal/80">
              {copy.body}
            </p>
            <div data-cta className="mt-8">
              <button type="button" className="btn-primary btn-lg" onClick={openBook} aria-haspopup="dialog">
                {copy.cta}
                <ArrowRight />
              </button>
            </div>
            <p data-cta className="mt-4 max-w-sm text-xs text-charcoal-muted">
              {copy.note}
            </p>
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
