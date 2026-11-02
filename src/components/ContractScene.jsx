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
 * The representative is one fixed pose (his hands never move on their own). The scene gets its life from
 * camera, light and depth instead:
 *
 *   1. Dolly      the office behind him eases back like a camera move               2.2s
 *   2. Step out   he turns toward the visitor in 3D as he steps out from behind the wall, 1.5s
 *                 his shadow lands on the wall and a warm light sweeps across the room
 *   3. Thought    puffs rise from his head, the cloud inflates with "Hi there!"      0.6s
 *   4. Headline   words rise out of their masks                                       0.6s
 *   5. Ask        the cloud changes to "Ready to sign with us?", a gloss runs over the
 *                 contract and the pen tip glints                                     0.9s
 *   6. Depth      on desktop, the layers shift very slightly with the pointer
 *
 * Layers, back to front: office backdrop, light, body (clipped at the wall edge) with cast shadow,
 * wall panel with its edge shadow, pen hand (in front of the wall once he is out), glint, cloud.
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
        const handClip = section.querySelector('[data-hand-clip]')
        const edgePx = () => section.querySelector('.cscene-panel').offsetWidth
        setBubble('hello')

        // Starting state
        gsap.set('[data-backdrop]', { scale: 1.14, xPercent: 3 })
        gsap.set('[data-light]', { xPercent: -70, autoAlpha: 0 })
        gsap.set('[data-move]', { xPercent: -92, rotationY: 28, scale: 0.94, transformPerspective: 1400 })
        gsap.set('[data-cast]', { autoAlpha: 0, xPercent: -25 })
        gsap.set('[data-edge-shadow]', { autoAlpha: 0.3 })
        if (handClip) gsap.set(handClip, { clipPath: `inset(-40% -40% -40% ${edgePx()}px)` })
        gsap.set('[data-bubble]', { autoAlpha: 0 })
        gsap.set('[data-bubble] [data-puff]', { scale: 0, transformOrigin: '50% 50%' })
        gsap.set('[data-bubble] [data-cloud]', { scale: 0.2, transformOrigin: '20% 85%' })
        gsap.set('[data-bubble] [data-cloud-content]', { autoAlpha: 0, scale: 0.85 })
        gsap.set('[data-word]', { yPercent: 115 })
        gsap.set('[data-copy]', { autoAlpha: 0, y: 18 })
        gsap.set('[data-cta]', { autoAlpha: 0, y: 18 })

        const tl = gsap.timeline({ paused: true, onComplete: settle })

        // 1. Camera dolly and light
        tl.to('[data-backdrop]', { scale: 1, xPercent: 0, duration: 2.2, ease: 'power2.out' }, 0)
          .to('[data-light]', { xPercent: 40, autoAlpha: 1, duration: 1.6, ease: 'power2.out' }, 0.15)
          .to('[data-light]', { autoAlpha: 0.45, duration: 1, ease: 'sine.inOut' }, '>-0.2')
        // 2. He turns toward the visitor as he steps out
        tl.to('[data-move]', { xPercent: 0, rotationY: 0, scale: 1, duration: 1.5, ease: 'power4.out' }, 0.1)
          .to('[data-cast]', { autoAlpha: 1, xPercent: 0, duration: 1.2, ease: 'power2.out' }, 0.25)
          .to('[data-edge-shadow]', { autoAlpha: 1, duration: 0.9, ease: 'power1.out' }, 0.4)
        if (handClip) tl.to(handClip, { clipPath: () => `inset(-40% -40% -40% -${edgePx()}px)`, duration: 0.6, ease: 'power2.inOut' }, 0.8)
        // 3. Thought: puffs rise from his head, then the cloud inflates
        tl.to('[data-bubble]', { autoAlpha: 1, duration: 0.01 }, 1.0)
          .to('[data-bubble] [data-puff]', { scale: 1, duration: 0.22, stagger: { each: 0.1, from: 'end' }, ease: 'back.out(2.5)' }, 1.0)
          .to('[data-bubble] [data-cloud]', { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.65)' }, 1.22)
          .to('[data-bubble] [data-cloud-content]', { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(1.8)' }, 1.38)
        // 4. Headline
        tl.to('[data-word]', { yPercent: 0, duration: 0.7, stagger: 0.06, ease: 'power4.out' }, 1.2)
          .to('[data-copy]', { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out' }, 1.6)
        // 5. The question, a gloss over the contract and a glint on the pen
        tl.call(() => setBubble('ask'), null, 2.35)
          .fromTo('[data-bubble] [data-cloud-content]', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out', immediateRender: false }, 2.37)
          .fromTo('[data-bubble] [data-cloud]', { scale: 0.94 }, { scale: 1, duration: 0.45, ease: 'back.out(2)', immediateRender: false }, 2.35)
          .fromTo('[data-sheen]', { xPercent: -120 }, { xPercent: 320, duration: 1.1, ease: 'power2.inOut' }, 2.4)
          .fromTo('[data-glint]', { scale: 0, rotation: -45, autoAlpha: 1 }, { scale: 1, rotation: 45, duration: 0.35, ease: 'power2.out' }, 2.7)
          .to('[data-glint]', { scale: 0, rotation: 90, autoAlpha: 0, duration: 0.35, ease: 'power2.in' }, '>')
          .to('[data-cta]', { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' }, 2.6)

        // 6. Afterwards: a breath of movement and pointer depth on desktop
        let removePointer = () => {}
        function settle() {
          if (handClip) gsap.set(handClip, { clipPath: 'none' })
          idle.current = [
            gsap.to('[data-move]', { y: -3, duration: 3.4, ease: 'sine.inOut', yoyo: true, repeat: -1 }),
            gsap.to('[data-bubble-float]', { y: -4, duration: 3.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.5 }),
          ]
          if (!window.matchMedia('(pointer: fine)').matches) return
          const q = (sel, prop) => gsap.quickTo(sel, prop, { duration: 0.9, ease: 'power3.out' })
          const personX = q('[data-move]', 'x')
          const backX = q('[data-backdrop]', 'x')
          const backY = q('[data-backdrop]', 'y')
          const cloudX = q('[data-bubble-par]', 'x')
          const onMove = (e) => {
            const r = section.getBoundingClientRect()
            const nx = (e.clientX - r.left) / r.width - 0.5
            const ny = (e.clientY - r.top) / r.height - 0.5
            personX(nx * 12)
            backX(nx * -18)
            backY(ny * -10)
            cloudX(nx * 7)
          }
          const onLeave = () => [personX, backX, backY, cloudX].forEach((f) => f(0))
          section.addEventListener('pointermove', onMove)
          section.addEventListener('pointerleave', onLeave)
          removePointer = () => {
            section.removeEventListener('pointermove', onMove)
            section.removeEventListener('pointerleave', onLeave)
          }
        }

        ScrollTrigger.create({
          trigger: section,
          // Play when the visitor reaches the section: about half of it in view.
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

  const popBubble = () => {
    if (!bubbleRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    gsap.fromTo(bubbleRef.current.querySelector('[data-cloud-content]'), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' })
    gsap.fromTo(bubbleRef.current.querySelector('[data-cloud]'), { scale: 0.92 }, { scale: 1, duration: 0.45, ease: 'back.out(2)' })
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
    requestAnimationFrame(popBubble)
  }

  const bubbleText = { hello: copy.hello, ask: copy.bubble, later: copy.bubbleLater, thanks: copy.bubbleThanks, thanksDemo: copy.bubbleThanksDemo }[bubble]
  const hb = geo.handBox
  const personMask = { WebkitMaskImage: `url(/images/${images.repBody.name}-800.webp)`, maskImage: `url(/images/${images.repBody.name}-800.webp)`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' }

  return (
    <section id="partner" ref={root} className="relative overflow-hidden bg-ivory lg:h-[clamp(600px,86vh,700px)]" aria-labelledby="partner-title">
      <div className="cscene relative aspect-[4/5] w-full overflow-hidden sm:aspect-[16/11] lg:absolute lg:inset-0 lg:aspect-auto">
        {/* Office backdrop (moves like a camera dolly) and warm light */}
        <div data-backdrop className="absolute -inset-[3%]" aria-hidden="true">
          <Img image={images.office} sizes="100vw" alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-ivory/10 via-transparent to-charcoal/15" />
        </div>
        <div data-light className="cscene-light" aria-hidden="true" />

        {/* Body, hidden behind the wall edge until he steps out */}
        <div className="cscene-clip absolute inset-0">
          <div data-move className="cscene-person absolute">
            <div data-cast className="absolute inset-0" aria-hidden="true">
              <Img image={images.repBody} sizes="(min-width:1024px) 60vw, 100vw" alt="" className="cscene-cast h-full w-full" />
            </div>
            {useVideo ? (
              <video className="relative h-full w-full" autoPlay muted playsInline preload="auto" aria-label={images.repBody.alt}>
                {representativeVideo.mov && <source src={representativeVideo.mov} type='video/mp4; codecs="hvc1"' />}
                <source src={representativeVideo.webm} type="video/webm" />
              </video>
            ) : (
              <Img image={images.repBody} sizes="(min-width:1024px) 60vw, 100vw" className="relative h-full w-full select-none" />
            )}
            {/* Gloss that runs over the contract once, masked to his silhouette */}
            <div className="pointer-events-none absolute inset-0" style={personMask} aria-hidden="true">
              <div className="absolute left-[40%] top-[42%] h-[56%] w-[60%] overflow-hidden">
                <div data-sheen className="cscene-sheen absolute inset-y-0 left-0 w-[35%]" />
              </div>
            </div>
            {/* Invisible hotspot on the contract he holds: the contract book flies out from here */}
            <span ref={bookOrigin} className="absolute left-[29%] top-[47.5%] h-[44%] w-[64%]" aria-hidden="true" />
          </div>
        </div>

        {/* The ivory wall and the shadow it casts onto the room */}
        <div className="cscene-panel absolute inset-y-0 left-0" aria-hidden="true" />
        <div data-edge-shadow className="cscene-edge-shadow pointer-events-none absolute inset-y-0" aria-hidden="true" />

        {/* Pen hand: fixed to his pose, it comes past the wall edge as he steps out */}
        {!useVideo && (
          <div data-hand-clip className="absolute inset-0" aria-hidden="true">
            <div data-move className="cscene-person absolute">
              <div className="absolute" style={{ left: `${hb.left}%`, top: `${hb.top}%`, width: `${hb.width}%`, height: `${hb.height}%` }}>
                <Img image={images.repHand} sizes="(min-width:1024px) 15vw, 25vw" alt="" className="h-full w-full select-none drop-shadow-[0_18px_18px_rgba(0,0,0,.18)]" />
              </div>
              {/* Glint at the pen tip */}
              <svg data-glint viewBox="0 0 40 40" className="cscene-glint absolute" style={{ left: `${geo.penTip.x}%`, top: `${geo.penTip.y}%` }}>
                <path d="M20 0 C21 14 26 19 40 20 C26 21 21 26 20 40 C19 26 14 21 0 20 C14 19 19 14 20 0 Z" fill="#fff" />
                <circle cx="20" cy="20" r="3.5" fill="#FFE6CC" />
              </svg>
            </div>
          </div>
        )}

        {/* Speech cloud */}
        <div data-bubble-par className="cscene-bubble absolute z-10">
          <div data-bubble ref={bubbleRef}>
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
      </div>

      {/* Copy: on the wall panel on desktop, below the scene on smaller screens */}
      <div className="relative z-20 lg:pointer-events-none lg:absolute lg:inset-0">
        <div className="site-x flex h-full items-center py-12 lg:py-0">
          <div className="lg:pointer-events-auto lg:max-w-[calc(44vw-7rem)] xl:max-w-[30rem]">
            <h2 id="partner-title" className="display text-[clamp(2.4rem,4.2vw,4.4rem)]">
              {TITLE_A.map((w) => (
                <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span data-word className="inline-block">
                    {w}&nbsp;
                  </span>
                </span>
              ))}
              {TITLE_B.map((w) => (
                <span key={w} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <span data-word className="inline-block text-orange">
                    {w}&nbsp;
                  </span>
                </span>
              ))}
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
