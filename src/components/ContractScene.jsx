import { useCallback, useRef, useState } from 'react'
import { contractScene as copy, images, representativeGeometry as geo, representativeVideo } from '../content/site'
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from '../lib/gsap'
import { submitEnquiry } from '../lib/submitEnquiry'
import Img from './Img'
import CloudBubble from './CloudBubble'
import ContractBook from './ContractBook'
import { ArrowRight } from './Icons'

/*
 * Partnership scene: a real MOVA team member, pen in hand and clipboard ready, leans out from
 * behind a plaster pillar. A speech cloud by his head, the headline and action on the right.
 *
 * His pose is a real photograph and stays as it is; the motion comes from camera, light and depth:
 *   1. Step out   he slides out from behind the pillar, turning toward the visitor in 3D,
 *                 while a warm light sweeps the wall and his shadow lands on it             1.5s
 *   2. Hello      the cloud inflates from its tail with "Hi there!"                        0.6s
 *   3. Headline   the words rise out of their masks, the orange rule draws down            0.7s
 *   4. Ask        "Ready to sign with us?", the reply chips pop in under the cloud,
 *                 a gloss runs over the clipboard and the pen tip glints                    0.9s
 *   5. Depth      afterwards, on desktop, the layers shift very slightly with the pointer
 *
 * Plays once per visit when about half of the section is in view.
 */
const TITLE_A = ['Your', 'next', 'chapter']
const TITLE_B = ['starts', 'here.']

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

        gsap.set('[data-light]', { xPercent: -60, autoAlpha: 0 })
        gsap.set('[data-move]', { xPercent: -95, rotationY: 26, scale: 0.94, transformPerspective: 1400 })
        gsap.set('[data-cast]', { autoAlpha: 0, xPercent: -25 })
        gsap.set('[data-edge-shadow]', { autoAlpha: 0.3 })
        gsap.set('[data-bubble]', { autoAlpha: 0 })
        gsap.set('[data-bubble] [data-tail]', { scale: 0, transformOrigin: '0% 100%' })
        gsap.set('[data-bubble] [data-cloud]', { scale: 0.15, transformOrigin: '22% 80%' })
        gsap.set('[data-bubble] [data-cloud-content]', { autoAlpha: 0, scale: 0.85 })
        gsap.set('[data-word]', { yPercent: 115 })
        gsap.set('[data-rule]', { scaleY: 0, transformOrigin: 'top' })
        gsap.set('[data-copy]', { autoAlpha: 0, y: 18 })

        const tl = gsap.timeline({ paused: true, onComplete: settle })

        // 1. Step out, light and shadow
        tl.to('[data-light]', { xPercent: 30, autoAlpha: 1, duration: 1.6, ease: 'power2.out' }, 0.1)
          .to('[data-light]', { autoAlpha: 0.6, duration: 1, ease: 'sine.inOut' }, '>-0.2')
          .to('[data-move]', { xPercent: 0, rotationY: 0, scale: 1, duration: 1.5, ease: 'power4.out' }, 0.1)
          .to('[data-cast]', { autoAlpha: 1, xPercent: 0, duration: 1.2, ease: 'power2.out' }, 0.25)
          .to('[data-edge-shadow]', { autoAlpha: 1, duration: 0.9, ease: 'power1.out' }, 0.4)
        // 2. Hello
        tl.to('[data-bubble]', { autoAlpha: 1, duration: 0.01 }, 1.0)
          .to('[data-bubble] [data-tail]', { scale: 1, duration: 0.25, ease: 'back.out(2.5)' }, 1.0)
          .to('[data-bubble] [data-cloud]', { scale: 1, duration: 0.65, ease: 'elastic.out(1, 0.6)' }, 1.12)
          .to('[data-bubble] [data-cloud-content]', { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(1.8)' }, 1.3)
        // 3. Headline
        tl.to('[data-rule]', { scaleY: 1, duration: 0.7, ease: 'power3.inOut' }, 1.15)
          .to('[data-word]', { yPercent: 0, duration: 0.7, stagger: 0.06, ease: 'power4.out' }, 1.2)
          .to('[data-copy]', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, 1.6)
        // 4. The question, the reply chips, a gloss over the clipboard and a glint on the pen
        tl.call(() => setBubble('ask'), null, 2.35)
          .fromTo('[data-bubble] [data-cloud-content]', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', immediateRender: false }, 2.37)
          .fromTo('[data-bubble] [data-cloud]', { scale: 0.94 }, { scale: 1, duration: 0.45, ease: 'back.out(2)', immediateRender: false }, 2.35)
          .fromTo('[data-sheen]', { xPercent: -120 }, { xPercent: 320, duration: 1.1, ease: 'power2.inOut' }, 2.45)
          .fromTo('[data-glint]', { scale: 0, rotation: -45, autoAlpha: 1 }, { scale: 1, rotation: 45, duration: 0.35, ease: 'power2.out' }, 2.75)
          .to('[data-glint]', { scale: 0, rotation: 90, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, '>')

        // 5. Afterwards: a breath of movement and pointer depth on desktop
        let removePointer = () => {}
        function settle() {
          idle.current = [
            gsap.to('[data-move]', { y: -3, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
            gsap.to('[data-bubble-float]', { y: -4, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 }),
          ]
          if (!window.matchMedia('(pointer: fine)').matches) return
          const q = (sel, prop) => gsap.quickTo(sel, prop, { duration: 0.9, ease: 'power3.out' })
          const personX = q('[data-move]', 'x')
          const wallX = q('[data-wall]', 'x')
          const cloudX = q('[data-bubble-par]', 'x')
          const onMove = (e) => {
            const r = section.getBoundingClientRect()
            const nx = (e.clientX - r.left) / r.width - 0.5
            personX(nx * 12)
            wallX(nx * -10)
            cloudX(nx * 7)
          }
          const onLeave = () => [personX, wallX, cloudX].forEach((f) => f(0))
          section.addEventListener('pointermove', onMove)
          section.addEventListener('pointerleave', onLeave)
          removePointer = () => {
            section.removeEventListener('pointermove', onMove)
            section.removeEventListener('pointerleave', onLeave)
          }
        }

        ScrollTrigger.create({
          trigger: section,
          start: () => `top bottom-=${Math.min(section.offsetHeight * 0.5, window.innerHeight * 0.62)}`,
          once: true,
          onEnter: () => tl.play(),
        })
        return () => {
          removePointer()
          idle.current.forEach((t) => t.kill())
          setBubble('ask')
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  /* Reply chips pop in whenever the cloud changes what it is asking. */
  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      gsap.fromTo('[data-chip]', { autoAlpha: 0, y: 10, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.09, ease: 'back.out(2)', delay: 0.15 })
    },
    { scope: root, dependencies: [bubble], revertOnUpdate: false },
  )

  const popBubble = () => {
    if (!bubbleRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(bubbleRef.current.querySelector('[data-cloud-content]'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' })
    gsap.fromTo(bubbleRef.current.querySelector('[data-cloud]'), { scale: 0.92 }, { scale: 1, duration: 0.45, ease: 'back.out(2)' })
  }

  const bookOpenRef = useRef(false)
  const resetAfterClose = useRef(false)
  const openBook = () => {
    bookOpenRef.current = true
    setBookOpen(true)
    setAnnounce('Contract book opened.')
  }

  /*
   * The book hands over the signed enquiry and closes at once; it is sent here in the background.
   * The cloud shows "Sending" until the email service confirms, then thanks, or offers to try again.
   */
  const lastEnquiry = useRef(null)
  const [bookKey, setBookKey] = useState(0)
  const [sendError, setSendError] = useState('')
  const deliver = useCallback((enquiry) => {
    lastEnquiry.current = enquiry
    setBubble('sending')
    setAnnounce(copy.bubbleSending)
    submitEnquiry('partnership', enquiry)
      .then((res) => {
        const demo = res.status === 'demo'
        setBubble(demo ? 'thanksDemo' : 'thanks')
        setAnnounce(demo ? copy.bubbleThanksDemo : copy.bubbleThanks)
        // A fresh, empty book for the next enquiry, once the current one has finished closing.
        if (bookOpenRef.current) resetAfterClose.current = true
        else setBookKey((k) => k + 1)
      })
      .catch((err) => {
        setSendError(err?.message || '')
        setBubble('failed')
        setAnnounce(`${copy.bubbleFailed} ${err?.message || ''}`)
      })
      .finally(() => requestAnimationFrame(popBubble))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onFinished = useCallback((result) => {
    bookOpenRef.current = false
    setBookOpen(false)
    if (resetAfterClose.current) {
      resetAfterClose.current = false
      setBookKey((k) => k + 1)
    }
    if (result === null) {
      setBubble('later')
      setAnnounce(copy.bubbleLater)
    }
    requestAnimationFrame(popBubble)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const notYet = () => {
    setBubble('later')
    setAnnounce(copy.bubbleLater)
    requestAnimationFrame(popBubble)
  }

  const bubbleText = { hello: copy.hello, ask: copy.bubble, later: copy.bubbleLater, sending: copy.bubbleSending, failed: copy.bubbleFailed, thanks: copy.bubbleThanks, thanksDemo: copy.bubbleThanksDemo }[bubble]
  const ct = geo.contract
  const personMask = { WebkitMaskImage: `url(/images/${images.repWorker.name}-800.webp)`, maskImage: `url(/images/${images.repWorker.name}-800.webp)`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' }

  return (
    <section id="about" ref={root} className="relative overflow-hidden bg-[#F3ECE1] lg:h-[clamp(500px,38vw,580px)]" aria-labelledby="partner-title">
      <div className="cscene relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] lg:absolute lg:inset-0 lg:aspect-auto">
        <div data-wall className="cscene-wall absolute -inset-x-[3%] inset-y-0" aria-hidden="true" />
        <div data-light className="cscene-light" aria-hidden="true" />

        {/* Representative, hidden behind the pillar until he steps out */}
        <div className="cscene-clip absolute inset-0">
          <div data-move className="cscene-person absolute">
            <div data-cast className="absolute inset-0" aria-hidden="true">
              <Img image={images.repWorker} sizes="(min-width:1024px) 30vw, 70vw" alt="" className="cscene-cast h-full w-full" />
            </div>
            {useVideo ? (
              <video className="relative h-full w-full" autoPlay muted playsInline preload="auto" aria-label={images.repWorker.alt}>
                {representativeVideo.mov && <source src={representativeVideo.mov} type='video/mp4; codecs="hvc1"' />}
                <source src={representativeVideo.webm} type="video/webm" />
              </video>
            ) : (
              <Img image={images.repWorker} sizes="(min-width:1024px) 30vw, 70vw" className="relative h-full w-full select-none" />
            )}
            {/* Gloss over the clipboard, masked to his silhouette */}
            <div className="pointer-events-none absolute inset-0" style={personMask} aria-hidden="true">
              <div className="absolute overflow-hidden" style={{ left: `${ct.left}%`, top: `${ct.top}%`, width: `${ct.width}%`, height: `${ct.height}%` }}>
                <div data-sheen className="cscene-sheen absolute inset-y-0 left-0 w-[30%]" />
              </div>
            </div>
            {/* Glint at the pen tip */}
            <svg data-glint viewBox="0 0 40 40" className="cscene-glint absolute" style={{ left: `${geo.penTip.x}%`, top: `${geo.penTip.y}%` }} aria-hidden="true">
              <path d="M20 0 C21 14 26 19 40 20 C26 21 21 26 20 40 C19 26 14 21 0 20 C14 19 19 14 20 0 Z" fill="#fff" />
              <circle cx="20" cy="20" r="3.5" fill="#FFE6CC" />
            </svg>
            {/* Invisible hotspot on the clipboard: the contract book flies out from here */}
            <span ref={bookOrigin} className="absolute" style={{ left: `${ct.left}%`, top: `${ct.top}%`, width: `${ct.width}%`, height: `${ct.height}%` }} aria-hidden="true" />
          </div>
        </div>

        {/* Plaster pillar and the shadow it casts */}
        <div className="cscene-pillar absolute inset-y-0 left-0" aria-hidden="true" />
        <div data-edge-shadow className="cscene-edge-shadow pointer-events-none absolute inset-y-0" aria-hidden="true" />

        {/* Speech cloud, with reply chips underneath */}
        <div data-bubble-par className="cscene-bubble absolute z-10">
          <div data-bubble ref={bubbleRef}>
            <div data-bubble-float>
              <CloudBubble className="drop-shadow-[0_16px_24px_rgba(27,33,33,.16)]">
                <p className={`font-extrabold leading-[1.1] tracking-[-0.025em] text-charcoal ${bubble === 'hello' || bubble === 'ask' || bubble === 'sending' ? 'text-[clamp(1.15rem,1.9vw,1.55rem)]' : 'text-[clamp(0.85rem,1.2vw,1rem)]'}`}>
                  {bubbleText}
                </p>
              </CloudBubble>
              {bubble === 'ask' && (
                <div className="bubble-replies" role="group" aria-label="Reply">
                  <button type="button" data-chip className="bubble-chip bubble-chip-yes" onClick={openBook} aria-haspopup="dialog">
                    {copy.bubbleYes}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button type="button" data-chip className="bubble-chip" onClick={notYet}>
                    {copy.bubbleNo}
                  </button>
                </div>
              )}
              {bubble === 'later' && (
                <div className="bubble-replies">
                  <button type="button" data-chip className="bubble-chip bubble-chip-yes" onClick={openBook} aria-haspopup="dialog">
                    I’m ready
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {bubble === 'sending' && (
                <div className="bubble-replies">
                  <span data-chip className="bubble-chip !cursor-default">
                    <span className="quote-spinner" aria-hidden="true" />
                    One moment
                  </span>
                </div>
              )}
              {bubble === 'failed' && (
                <div className="bubble-replies" role="group" aria-label="Your enquiry was not sent">
                  <button type="button" data-chip className="bubble-chip bubble-chip-yes" onClick={() => deliver(lastEnquiry.current)}>
                    Try again
                  </button>
                  <button type="button" data-chip className="bubble-chip" onClick={openBook} aria-haspopup="dialog">
                    Edit enquiry
                  </button>
                  {sendError && <span className="sr-only">{sendError}</span>}
                </div>
              )}
              {(bubble === 'thanks' || bubble === 'thanksDemo') && (
                <div className="bubble-replies">
                  <button type="button" data-chip className="bubble-chip" onClick={openBook} aria-haspopup="dialog">
                    Start another enquiry
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Copy: right side on desktop, below the scene on smaller screens */}
      <div className="relative z-20 lg:pointer-events-none lg:absolute lg:inset-y-0 lg:left-[56%] lg:right-0">
        <div className="flex h-full items-center px-4 py-10 sm:px-8 lg:px-0 lg:py-0 lg:pr-[max(3rem,calc(50vw-40rem))]">
          <div className="relative pl-7 lg:pointer-events-auto lg:pl-9">
            <span data-rule className="absolute left-0 top-1 h-[calc(clamp(2.4rem,4.1vw,4.1rem)*2)] w-[3px] rounded-full bg-orange" aria-hidden="true" />
            <h2 id="partner-title" className="display text-[clamp(2.4rem,4.1vw,4.1rem)] text-charcoal">
              <span className="block">
                {TITLE_A.map((w) => (
                  <span key={w} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                    <span data-word className="inline-block">
                      {w}&nbsp;
                    </span>
                  </span>
                ))}
              </span>
              <span className="block">
                {TITLE_B.map((w) => (
                  <span key={w} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                    <span data-word className="inline-block">
                      {w}&nbsp;
                    </span>
                  </span>
                ))}
              </span>
            </h2>
            <p data-copy className="mt-5 max-w-[30rem] text-[1.08rem] leading-relaxed text-charcoal/85">
              {copy.body}
            </p>
            <div data-copy className="mt-7">
              <button type="button" className="btn-primary btn-lg" onClick={openBook} aria-haspopup="dialog">
                {copy.cta}
                <ArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {announce}
      </p>

      <ContractBook key={bookKey} open={bookOpen} originRef={bookOrigin} onFinished={onFinished} onSend={deliver} />
    </section>
  )
}
