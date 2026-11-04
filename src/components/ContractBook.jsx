import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useEnquiryForm } from '../hooks/useEnquiryForm'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useScrollLock } from '../hooks/useScrollLock'
import { isDemoMode } from '../lib/submitEnquiry'
import EnquiryFields from './EnquiryFields'
import ServicePicker from './ServicePicker'
import DemoNotice from './DemoNotice'
import SignaturePad from './SignaturePad'
import { LogoA, LogoMark } from './Logo'
import { ArrowRight, Pen } from './Icons'
import CloseButton from './CloseButton'

const ID = 'partner'
const today = () => new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function Clause({ no, children }) {
  return (
    <h3 className="clause">
      <span className="clause-no" aria-hidden="true">
        {no}
      </span>
      {children}
    </h3>
  )
}

/*
 * The partnership contract book.
 *
 * Opening:  the page blurs, the book flies out of the contract the representative is holding,
 *           the foil lettering shimmers, the cover swings open, a ribbon bookmark drops and a
 *           page turns before the fields write themselves in.
 * Signing:  the form is validated; on success an orange MOVA seal stamps onto the signature,
 *           the book closes, flies back to him and the blur lifts.
 * onFinished(result) runs after the closing animation: 'sent' | 'demo' | null (cancelled).
 * It is an enquiry, not a contract, and the pages say so.
 */
export default function ContractBook({ open, originRef, onFinished }) {
  const [mounted, setMounted] = useState(false)
  const [sealed, setSealed] = useState(false)
  const overlay = useRef(null)
  const book = useRef(null)
  const cover = useRef(null)
  const left = useRef(null)
  const right = useRef(null)
  const dialogRef = useRef(null)
  const sig = useRef(null)
  const busy = useRef(false)
  const [sigEmpty, setSigEmpty] = useState(true)
  const [typedSig, setTypedSig] = useState('')
  const [consent, setConsent] = useState(false)

  const extraValidate = useCallback(() => {
    const e = {}
    if (sigEmpty && typedSig.trim().length < 2) e.signature = 'Please sign in the box or type your name to sign.'
    if (!consent) e.consent = 'Please confirm you understand this is an enquiry.'
    return e
  }, [sigEmpty, typedSig, consent])

  const form = useEnquiryForm({ kind: 'partnership', idPrefix: ID, extraValidate })
  const extraErrors = form.touched.__all ? extraValidate() : {}

  useEffect(() => {
    if (open) setMounted(true)
  }, [open])

  useScrollLock(mounted)
  useFocusTrap(dialogRef, mounted, { onEscape: () => close(null) })

  /* Where the closed book must start so that it sits exactly on the contract in his hands. */
  const fromOrigin = () => {
    const o = originRef?.current?.getBoundingClientRect()
    const b = book.current.getBoundingClientRect()
    const c = cover.current.getBoundingClientRect()
    if (!o || !o.width) return { x: 0, y: 60, scale: 0.6 }
    const scale = Math.max(0.12, Math.min(o.width / c.width, o.height / c.height))
    const ox = c.left + c.width / 2 - b.left
    const oy = c.top + c.height / 2 - b.top
    gsap.set(book.current, { transformOrigin: `${ox}px ${oy}px` })
    return { x: o.left + o.width / 2 - (c.left + c.width / 2), y: o.top + o.height / 2 - (c.top + c.height / 2), scale }
  }

  /* Opening sequence */
  useEffect(() => {
    if (!mounted || !open) return
    const desktop = window.matchMedia('(min-width: 768px)').matches
    const q = gsap.utils.selector(book.current)
    const fields = q('[data-page-item]')
    busy.current = true
    setSealed(false)

    if (prefersReducedMotion()) {
      gsap.set(overlay.current, { autoAlpha: 1 })
      gsap.set([cover.current, q('[data-leaf]')], { autoAlpha: 0 })
      gsap.set([left.current, right.current, book.current, q('[data-board-left]')], { autoAlpha: 1 })
      busy.current = false
      document.getElementById(`${ID}-name`)?.focus({ preventScroll: true })
      return
    }

    const start = fromOrigin()
    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false
        document.getElementById(`${ID}-name`)?.focus({ preventScroll: true })
      },
    })
    gsap.set(cover.current, { rotationY: 0, autoAlpha: 1, transformPerspective: 2400 })
    gsap.set(left.current, { autoAlpha: desktop ? 0 : 1 })
    gsap.set(q('[data-board-left]'), { autoAlpha: 0 })
    gsap.set(right.current, { autoAlpha: 1 })
    gsap.set(q('[data-leaf]'), { rotationY: 0, autoAlpha: 0, transformPerspective: 2400 })
    gsap.set(q('[data-ribbon]'), { scaleY: 0 })
    gsap.set(q('[data-foil-sweep]'), { xPercent: -120 })
    gsap.set(fields, { autoAlpha: 0, y: 12 })

    tl.fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, 0)
      .fromTo(
        book.current,
        { x: start.x, y: start.y, scale: start.scale, rotation: -8, rotationX: 18, autoAlpha: 0.2 },
        { x: 0, y: 0, scale: 1, rotation: 0, rotationX: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.inOut' },
        0.05,
      )
      // Foil shimmer across the cover lettering
      .to(q('[data-foil-sweep]'), { xPercent: 220, duration: 0.8, ease: 'power2.inOut' }, 0.75)
      // Cover swings open
      .to(cover.current, { rotationY: -180, duration: 1.05, ease: 'power2.inOut' }, 1.15)
      .to(q('[data-cover-shade]'), { opacity: 0.4, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<')
      .to(q('[data-board-left]'), { autoAlpha: 1, duration: 0.35, ease: 'power1.out' }, '<0.45')
    if (desktop) {
      tl.set(left.current, { autoAlpha: 1 }, '>-0.02')
        .set(cover.current, { autoAlpha: 0 })
        // A page turns over
        .set(q('[data-leaf]'), { autoAlpha: 1 }, '<')
        .to(q('[data-leaf]'), { rotationY: -180, duration: 0.75, ease: 'power2.inOut' }, '<')
        .to(q('[data-leaf-shade]'), { opacity: 0.25, duration: 0.35, yoyo: true, repeat: 1 }, '<')
        .set(q('[data-leaf]'), { autoAlpha: 0 })
    } else {
      tl.to(cover.current, { autoAlpha: 0, duration: 0.3 }, '-=0.35')
    }
    tl.to(q('[data-ribbon]'), { scaleY: 1, duration: 0.6, ease: 'back.out(1.6)' }, desktop ? '-=0.5' : '-=0.2')
      .to(fields, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.035, ease: 'power2.out' }, '-=0.35')

    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, open])

  /* Closing sequence: close the cover, fly back to the representative, then report the result. */
  const close = useCallback(
    (result) => {
      if (!book.current || (busy.current && result === null)) return
      busy.current = true
      const done = () => {
        busy.current = false
        setMounted(false)
        setSealed(false)
        form.reset()
        setTypedSig('')
        setConsent(false)
        setSigEmpty(true)
        onFinished?.(result)
      }
      if (prefersReducedMotion()) {
        gsap.to(overlay.current, { autoAlpha: 0, duration: 0.2, onComplete: done })
        return
      }
      const desktop = window.matchMedia('(min-width: 768px)').matches
      const q = gsap.utils.selector(book.current)
      const tl = gsap.timeline({ onComplete: done })
      tl.to(q('[data-ribbon]'), { scaleY: 0, duration: 0.3, ease: 'power2.in' })
        .to(q('[data-page-item]'), { autoAlpha: 0, y: -8, duration: 0.25, stagger: 0.01 }, '<')
        .set(cover.current, { autoAlpha: 1 })
      if (desktop) tl.set(left.current, { autoAlpha: 0 })
      tl.to(cover.current, { rotationY: 0, duration: 0.85, ease: 'power2.inOut' })
        .to(q('[data-board-left]'), { autoAlpha: 0, duration: 0.3 }, '<0.3')
        .add(() => {
          const t = fromOrigin()
          gsap.to(book.current, { x: t.x, y: t.y, scale: t.scale, rotation: -6, rotationX: 16, duration: 0.85, ease: 'power3.inOut' })
          gsap.to(book.current, { autoAlpha: 0, duration: 0.3, delay: 0.6 })
        }, '+=0.1')
        .to(overlay.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, '+=0.5')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, onFinished],
  )

  /* The seal stamps onto the signature before the book closes. */
  const stamp = () =>
    new Promise((resolve) => {
      setSealed(true)
      if (prefersReducedMotion()) return setTimeout(resolve, 600)
      requestAnimationFrame(() => {
        const q = gsap.utils.selector(book.current)
        const seal = q('[data-seal]')
        q('[data-seal-anchor]')[0]?.scrollIntoView({ block: 'center', behavior: 'smooth' })
        gsap
          .timeline({ onComplete: () => setTimeout(resolve, 650), delay: 0.25 })
          .fromTo(seal, { scale: 2.6, rotation: -35, autoAlpha: 0, y: -40 }, { scale: 1, rotation: -12, autoAlpha: 1, y: 0, duration: 0.42, ease: 'power4.in' })
          .fromTo(book.current, { x: 0 }, { x: 4, duration: 0.05, repeat: 3, yoyo: true, ease: 'none' })
          .fromTo(q('[data-seal-ring]'), { scale: 0.8, autoAlpha: 0.7 }, { scale: 1.8, autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, '<')
      })
    })

  const onSubmit = async (e) => {
    e.preventDefault()
    if (busy.current) return
    const status = await form.submit({
      signatureTyped: typedSig.trim() || null,
      signatureImage: !sigEmpty && sig.current ? sig.current.toDataURL() : null,
      consent,
    })
    if (status === 'sent' || status === 'demo') {
      busy.current = true
      await stamp()
      busy.current = false
      close(status)
    }
  }

  if (!mounted) return null

  const submitting = form.status === 'submitting'

  return createPortal(
    <div ref={overlay} className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden p-3 sm:p-6" style={{ visibility: 'hidden' }}>
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-[14px] backdrop-saturate-[.8]" onClick={() => close(null)} aria-hidden="true" />

      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${ID}-title`} className="relative [perspective:2600px]">
        <CloseButton onClick={() => close(null)} label="Close the contract book" className="absolute -top-2 right-0 z-30 sm:-right-5 sm:-top-5" />

        <form ref={book} noValidate onSubmit={onSubmit} className="relative h-[min(740px,90dvh)] w-[min(1080px,94vw)] [transform-style:preserve-3d]">
          {/* Hardcover boards behind the pages. The left board only shows once the cover opens. */}
          <div className="book-board absolute inset-0 rounded-[18px] md:-inset-y-3 md:left-1/2 md:-right-3 md:rounded-l-none" aria-hidden="true" />
          <div data-board-left className="book-board absolute -inset-y-3 -left-3 right-1/2 hidden rounded-l-[18px] rounded-r-none md:block" aria-hidden="true" />

          {/* Ribbon bookmark */}
          <span data-ribbon className="book-ribbon pointer-events-none absolute -top-3 left-[calc(50%+0.55rem)] z-30 hidden h-[6.5rem] md:block" aria-hidden="true" />

          <div className="relative grid h-full overflow-hidden rounded-[14px] md:grid-cols-2 md:overflow-visible">
            <div className="h-full overflow-y-auto overscroll-contain md:contents">
              {/* Left page */}
              <section ref={left} aria-label="Your details" className="book-page book-page-left md:h-full md:overflow-y-auto md:overscroll-contain">
                {/* Letterhead */}
                <div data-page-item className="flex items-start justify-between gap-4 border-b-2 border-charcoal pb-3 text-charcoal">
                  <span className="flex flex-col">
                    <span className="flex items-end text-[1.35rem] font-extrabold leading-none">
                      MOV
                      <LogoA className="mb-[0.15em] ml-[0.03em] h-[0.72em] w-auto" />
                    </span>
                    <span className="mt-1 pl-[0.1em] text-[0.5rem] font-bold uppercase tracking-[0.55em] text-charcoal/60">Logistics</span>
                  </span>
                  <span className="pr-6 text-right sm:pr-0">
                    <span className="block text-[0.62rem] font-extrabold uppercase tracking-[0.24em] text-charcoal">Partnership enquiry</span>
                    <span className="mt-1 block text-[0.72rem] text-charcoal/55">Dated {today()}</span>
                  </span>
                </div>
                <h2 data-page-item id={`${ID}-title`} className="mt-6 text-[1.9rem] font-extrabold leading-[1.05] tracking-[-0.035em] text-charcoal sm:text-[2.25rem]">
                  Let’s plan your <span className="serif-i text-[1.1em] text-orange">journey</span> together.
                </h2>
                <p data-page-item className="mt-3 text-[0.92rem] leading-relaxed text-charcoal/75">
                  Complete the three clauses and sign at the end. Our team reviews every enquiry and agrees the details with you before anything moves.
                </p>
                <div data-page-item>
                  <DemoNotice className="mt-4" />
                </div>
                <div data-page-item className="mt-6">
                  <Clause no="1">The parties</Clause>
                  <div className="mt-4">
                    <EnquiryFields idPrefix={ID} tone="paper" only={['name', 'company', 'email', 'phone']} {...form} />
                  </div>
                </div>
                <p data-page-item className="mt-6 hidden text-right text-xs italic text-charcoal/40 md:block" aria-hidden="true">
                  Page 1 of 2
                </p>
              </section>

              {/* Right page */}
              <section ref={right} aria-label="Your shipment and signature" className="book-page book-page-right md:h-full md:overflow-y-auto md:overscroll-contain">
                <div data-page-item>
                  <Clause no="2">The shipment</Clause>
                  <div className="mt-4 space-y-4">
                    <ServicePicker idPrefix={ID} variant="chips" value={form.values.service} onChange={form.onChange} onBlur={form.onBlur} error={form.errors.service} touched={form.touched} />
                    <EnquiryFields idPrefix={ID} tone="paper" only={['pickup', 'destination', 'cargo', 'date']} {...form} />
                  </div>
                </div>

                <div data-page-item className="relative mt-7" data-seal-anchor>
                  <Clause no="3">Signature</Clause>
                  <p className="mb-1.5 mt-4 flex items-center justify-between gap-2 text-sm font-bold text-charcoal" id={`${ID}-sig-label`}>
                    <span className="flex items-center gap-2">
                      <Pen /> Sign here
                    </span>
                    <span className="text-xs font-semibold text-charcoal/50">Signed on {today()}</span>
                  </p>
                  <SignaturePad ref={sig} id={`${ID}-signature`} onChange={setSigEmpty} invalid={!!extraErrors.signature} describedBy={extraErrors.signature ? `${ID}-signature-error` : `${ID}-sig-label`} />
                  {sealed && (
                    <div className="pointer-events-none absolute -bottom-6 right-2 z-10" aria-hidden="true">
                      <span data-seal-ring className="absolute inset-0 rounded-full border-2 border-orange" />
                      <div data-seal className="seal relative flex flex-col items-center justify-center text-white">
                        <LogoMark className="h-7 w-auto text-white" />
                        <span className="mt-1 text-[0.55rem] font-extrabold uppercase tracking-[0.22em]">Received</span>
                      </div>
                    </div>
                  )}
                  <label htmlFor={`${ID}-typed`} className="mt-3 block text-xs font-semibold text-charcoal-muted">
                    Prefer the keyboard? Type your name to sign
                  </label>
                  <input id={`${ID}-typed`} value={typedSig} onChange={(e) => setTypedSig(e.target.value)} className="field field-paper serif-i mt-1 text-xl" autoComplete="name" aria-describedby={extraErrors.signature ? `${ID}-signature-error` : undefined} />
                  {extraErrors.signature && (
                    <p id={`${ID}-signature-error`} className="field-error">
                      {extraErrors.signature}
                    </p>
                  )}
                </div>

                <div data-page-item className="mt-5">
                  <label className="flex cursor-pointer items-start gap-3 text-sm text-charcoal">
                    <input
                      id={`${ID}-consent`}
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="check mt-0.5"
                      aria-invalid={extraErrors.consent ? 'true' : undefined}
                      aria-describedby={extraErrors.consent ? `${ID}-consent-error` : undefined}
                    />
                    <span>I understand this is a partnership enquiry and not a binding contract.</span>
                  </label>
                  {extraErrors.consent && (
                    <p id={`${ID}-consent-error`} className="field-error">
                      {extraErrors.consent}
                    </p>
                  )}
                </div>

                <div data-page-item className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/10 pt-5">
                  <p className="text-xs text-charcoal-muted" aria-live="polite">
                    {sealed
                      ? isDemoMode
                        ? 'Signed. Demo mode, so nothing was sent.'
                        : 'Signed and sent. Thank you.'
                      : form.status === 'error'
                        ? 'We could not send your enquiry. Please try again.'
                        : form.touched.__all && (form.errorCount || Object.keys(extraErrors).length)
                          ? 'A few details still need your attention.'
                          : isDemoMode
                            ? 'Demo mode: nothing will be sent.'
                            : 'We reply to every enquiry.'}
                  </p>
                  <button type="submit" className="btn-primary" disabled={submitting || sealed}>
                    {submitting ? 'Signing' : isDemoMode ? 'Sign and finish demo' : 'Sign and send'}
                    <ArrowRight />
                  </button>
                </div>
              </section>
            </div>

            {/* Spine shading between the pages */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-16 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(27,33,33,.16)_48%,rgba(27,33,33,.24)_50%,rgba(27,33,33,.16)_52%,transparent)] md:block" aria-hidden="true" />

            {/* A loose page that turns over after the cover opens */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 right-0 z-10 hidden [transform-style:preserve-3d] md:block" aria-hidden="true">
              <div data-leaf className="book-leaf">
                <div data-leaf-shade className="absolute inset-0 rounded-[inherit] bg-black opacity-0" />
              </div>
            </div>

            {/* Cover: front is the leather contract cover with foil lettering, back is the inside paper */}
            <div ref={cover} className="book-cover absolute inset-0 z-20 md:left-1/2 md:w-1/2" aria-hidden="true">
              <div className="book-cover-face book-cover-front">
                <div className="absolute inset-4 rounded-[10px] border border-[#EA6A1F]/45" />
                <div className="absolute inset-[22px] rounded-[8px] border border-white/5" />
                <div className="relative flex h-full flex-col items-center justify-center overflow-hidden px-8 text-center">
                  <span className="flex items-end text-[2.6rem] font-extrabold leading-none text-white/90">
                    MOV
                    <LogoA className="mb-[0.15em] ml-[0.03em] h-[0.72em] w-auto" />
                  </span>
                  <p className="mt-2 pl-[0.6em] text-[0.62rem] font-bold uppercase tracking-[0.6em] text-white/60">Logistics</p>
                  <p className="book-foil mt-10 text-[2.6rem] font-extrabold uppercase tracking-[0.14em] sm:text-[3.2rem]">Contract</p>
                  <span className="mt-5 h-[2px] w-24 bg-orange" />
                  <p className="serif-i mt-5 text-xl text-white/70">Partnership enquiry</p>
                  <span data-foil-sweep className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </div>
                <div data-cover-shade className="absolute inset-0 rounded-[inherit] bg-black opacity-0" />
              </div>
              <div className="book-cover-face book-cover-back" />
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
