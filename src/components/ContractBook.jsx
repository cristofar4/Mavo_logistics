import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { useEnquiryForm } from '../hooks/useEnquiryForm'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useScrollLock } from '../hooks/useScrollLock'
import { isDemoMode } from '../lib/submitEnquiry'
import EnquiryFields from './EnquiryFields'
import DemoNotice from './DemoNotice'
import SignaturePad from './SignaturePad'
import { LogoMark } from './Logo'
import { ArrowRight, Close, Pen } from './Icons'

const ID = 'partner'

/*
 * The partnership "contract book".
 * Opens from the representative's folder (originRef), flies to the centre of a blurred page,
 * opens its cover, collects an enquiry with a signature, then closes and flies back.
 * onFinished(result) is called after the closing animation: 'sent' | 'demo' | null (cancelled).
 */
export default function ContractBook({ open, originRef, onFinished }) {
  const [mounted, setMounted] = useState(false)
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

  /* Geometry: where the cover must start so that it sits exactly on the representative's folder. */
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
    const fields = book.current.querySelectorAll('[data-page-item]')
    busy.current = true

    if (prefersReducedMotion()) {
      gsap.set(overlay.current, { autoAlpha: 1 })
      gsap.set(cover.current, { autoAlpha: 0 })
      gsap.set([left.current, right.current, book.current], { autoAlpha: 1 })
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
    gsap.set('[data-board-left]', { autoAlpha: 0 })
    gsap.set(right.current, { autoAlpha: 1 })
    gsap.set(fields, { autoAlpha: 0, y: 12 })
    tl.fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' }, 0)
      .fromTo(
        book.current,
        { x: start.x, y: start.y, scale: start.scale, rotation: -7, autoAlpha: 0.2 },
        { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 0.85, ease: 'power3.inOut' },
        0.05,
      )
      .to(cover.current, { rotationY: -180, duration: 1, ease: 'power2.inOut' }, '+=0.05')
      .to('[data-board-left]', { autoAlpha: 1, duration: 0.35, ease: 'power1.out' }, '<0.45')
      .to('[data-cover-shade]', { opacity: 0.35, duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<')
    if (desktop) tl.set(left.current, { autoAlpha: 1 }, '-=0.02').set(cover.current, { autoAlpha: 0 })
    else tl.to(cover.current, { autoAlpha: 0, duration: 0.3 }, '-=0.35')
    tl.to(fields, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.035, ease: 'power2.out' }, '-=0.1')

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
      const fields = book.current.querySelectorAll('[data-page-item]')
      const tl = gsap.timeline({ onComplete: done })
      tl.to(fields, { autoAlpha: 0, y: -8, duration: 0.25, stagger: 0.01 })
      tl.set(cover.current, { autoAlpha: 1 })
      if (desktop) tl.set(left.current, { autoAlpha: 0 })
      tl.to(cover.current, { rotationY: 0, duration: 0.85, ease: 'power2.inOut' })
      tl.to('[data-board-left]', { autoAlpha: 0, duration: 0.3 }, '<0.3')
      tl.add(() => {
        const t = fromOrigin()
        gsap.to(book.current, { x: t.x, y: t.y, scale: t.scale, rotation: -5, duration: 0.8, ease: 'power3.inOut' })
        gsap.to(book.current, { autoAlpha: 0, duration: 0.3, delay: 0.55 })
      }, '+=0.1')
      tl.to(overlay.current, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, '+=0.45')
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [form, onFinished],
  )

  const onSubmit = async (e) => {
    e.preventDefault()
    if (busy.current) return
    const status = await form.submit({
      signatureTyped: typedSig.trim() || null,
      signatureImage: !sigEmpty && sig.current ? sig.current.toDataURL() : null,
      consent,
    })
    if (status === 'sent' || status === 'demo') setTimeout(() => close(status), 450)
  }

  if (!mounted) return null

  const submitting = form.status === 'submitting'

  return createPortal(
    <div ref={overlay} className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden p-3 sm:p-6" style={{ visibility: 'hidden' }}>
      <div className="absolute inset-0 bg-charcoal/35 backdrop-blur-[14px] backdrop-saturate-[.8]" onClick={() => close(null)} aria-hidden="true" />

      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={`${ID}-title`} className="relative [perspective:2600px]">
        <button
          type="button"
          onClick={() => close(null)}
          className="icon-btn absolute -top-1 right-1 z-30 bg-ivory shadow-soft sm:-right-3 sm:-top-3"
          aria-label="Close the contract book"
        >
          <Close />
        </button>

        <form ref={book} noValidate onSubmit={onSubmit} className="contract-book relative h-[min(740px,90dvh)] w-[min(1080px,94vw)] [transform-style:preserve-3d]">
          {/* Hardcover boards behind the pages. The left board only shows once the cover opens. */}
          <div className="book-board absolute inset-0 rounded-[18px] md:-inset-y-3 md:left-1/2 md:-right-3 md:rounded-l-none" aria-hidden="true" />
          <div data-board-left className="book-board absolute -inset-y-3 -left-3 right-1/2 hidden rounded-r-none rounded-l-[18px] md:block" aria-hidden="true" />

          <div className="relative grid h-full overflow-hidden rounded-[14px] md:grid-cols-2 md:overflow-visible">
            <div className="h-full overflow-y-auto overscroll-contain md:contents">
              {/* Left page */}
              <section ref={left} aria-label="Your details" className="book-page book-page-left md:h-full md:overflow-y-auto md:overscroll-contain">
                <div data-page-item className="flex items-center gap-3 text-charcoal">
                  <LogoMark className="h-6 w-auto" />
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.35em]">MOVA Logistics</span>
                </div>
                <p data-page-item className="eyebrow mt-8">Partnership enquiry</p>
                <h2 data-page-item id={`${ID}-title`} className="mt-2 text-[1.9rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-charcoal sm:text-[2.3rem]">
                  Let’s plan your journey <span className="text-orange">together.</span>
                </h2>
                <p data-page-item className="mt-3 text-[0.95rem] leading-relaxed text-charcoal-muted">
                  Fill in these pages and sign at the end. Our team reviews every enquiry and plans the details with you before anything is agreed.
                </p>
                <div data-page-item>
                  <DemoNotice className="mt-5" />
                </div>
                <div data-page-item className="mt-6">
                  <EnquiryFields idPrefix={ID} tone="paper" only={['name', 'company', 'email', 'phone']} {...form} />
                </div>
                <p data-page-item className="mt-6 hidden text-right text-xs italic text-charcoal/40 md:block" aria-hidden="true">
                  Page 1 of 2
                </p>
              </section>

              {/* Right page */}
              <section ref={right} aria-label="Your shipment and signature" className="book-page book-page-right md:h-full md:overflow-y-auto md:overscroll-contain">
                <h3 data-page-item className="text-sm font-semibold uppercase tracking-[0.22em] text-charcoal">Your shipment</h3>
                <div data-page-item className="mt-4">
                  <EnquiryFields idPrefix={ID} tone="paper" only={['service', 'pickup', 'destination', 'cargo', 'date']} {...form} />
                </div>

                <div data-page-item className="mt-6">
                  <p className="mb-1.5 flex items-center gap-2 text-sm font-medium text-charcoal" id={`${ID}-sig-label`}>
                    <Pen /> Signature
                  </p>
                  <SignaturePad
                    ref={sig}
                    id={`${ID}-signature`}
                    onChange={setSigEmpty}
                    invalid={!!extraErrors.signature}
                    describedBy={extraErrors.signature ? `${ID}-signature-error` : `${ID}-sig-label`}
                  />
                  <label htmlFor={`${ID}-typed`} className="mt-3 block text-xs font-medium text-charcoal-muted">
                    Prefer the keyboard? Type your name to sign
                  </label>
                  <input
                    id={`${ID}-typed`}
                    value={typedSig}
                    onChange={(e) => setTypedSig(e.target.value)}
                    className="field field-paper mt-1 text-lg font-semibold italic"
                    autoComplete="name"
                    aria-describedby={extraErrors.signature ? `${ID}-signature-error` : undefined}
                  />
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
                    {form.status === 'error'
                      ? 'We could not send your enquiry. Please try again.'
                      : form.touched.__all && (form.errorCount || Object.keys(extraErrors).length)
                        ? 'A few details still need your attention.'
                        : isDemoMode
                          ? 'Demo mode: nothing will be sent.'
                          : 'We reply to every enquiry.'}
                  </p>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Signing' : isDemoMode ? 'Sign and finish demo' : 'Sign and send'}
                    <ArrowRight />
                  </button>
                </div>
              </section>
            </div>

            {/* Spine shading between the pages */}
            <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-16 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,rgba(32,35,33,.16)_48%,rgba(32,35,33,.22)_50%,rgba(32,35,33,.16)_52%,transparent)] md:block" aria-hidden="true" />

            {/* Cover: front is the leather contract cover, back is the inside paper */}
            <div ref={cover} className="book-cover absolute inset-0 z-20 md:left-1/2 md:w-1/2" aria-hidden="true">
              <div className="book-cover-face book-cover-front">
                <div className="absolute inset-4 rounded-[10px] border border-[#D96936]/40" />
                <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
                  <LogoMark className="h-10 w-auto text-ivory" />
                  <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.5em] text-ivory/70">MOVA Logistics</p>
                  <p className="mt-8 text-4xl font-extrabold uppercase tracking-[0.12em] text-ivory sm:text-5xl">Contract</p>
                  <span className="mt-6 h-px w-24 bg-orange" />
                  <p className="mt-6 text-sm text-ivory/60">Partnership enquiry</p>
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
