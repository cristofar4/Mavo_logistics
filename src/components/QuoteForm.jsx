import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { images, serviceOptions } from '../content/site'
import { useEnquiryForm } from '../hooks/useEnquiryForm'
import { gsap, prefersReducedMotion } from '../lib/gsap'
import { isDemoMode, warmUp } from '../lib/submitEnquiry'
import EnquiryFields from './EnquiryFields'
import ServicePicker from './ServicePicker'
import Img from './Img'
import Logo from './Logo'
import { ArrowRight, Box, Check } from './Icons'

/*
 * Quote planner: three short steps with a route panel beside them, then a booking ticket summary.
 *   1 What are we moving   service cards and cargo details
 *   2 Where is it going    pickup, destination and preferred date
 *   3 Who should we reply  name, company, email and phone
 * Each step is validated before moving on. With no form service connected the ticket says
 * plainly that nothing was sent.
 */
const STEPS = [
  { key: 'what', label: 'What are we moving?', short: 'Your cargo', fields: ['service', 'cargo'] },
  { key: 'where', label: 'Where is it going?', short: 'The route', fields: ['pickup', 'destination', 'date'] },
  { key: 'who', label: 'Who should we reply to?', short: 'Your details', fields: ['name', 'company', 'email', 'phone'] },
]

/*
 * Pickup and destination as one route card: the pins and the dotted line live in their own
 * column, so they never cross the labels. The swap button reverses the route.
 */
function RouteFields({ idPrefix, form }) {
  const { values, errors, touched, onChange, onBlur } = form
  const rows = [
    { name: 'pickup', label: 'Pickup location', hint: 'From', placeholder: 'Town, city or postcode', pin: 'is-from' },
    { name: 'destination', label: 'Destination', hint: 'To', placeholder: 'Town, city or country', pin: 'is-to' },
  ]
  const shown = (n) => (touched[n] || touched.__all) && errors[n]
  const swap = () => {
    const a = values.pickup
    onChange('pickup', values.destination)
    onChange('destination', a)
  }
  return (
    <div>
      <div className="route-box">
        <span className="route-line" aria-hidden="true" />
        {rows.map((r, i) => {
          const id = `${idPrefix}-${r.name}`
          const err = shown(r.name)
          return (
            <div key={r.name} className={`route-row ${err ? 'is-invalid' : ''} ${i === 0 ? 'border-b border-charcoal/10' : ''}`}>
              <span className={`route-pin ${r.pin}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <label htmlFor={id} className="flex items-center gap-2 text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-charcoal/55">
                  {r.label}
                </label>
                <input
                  id={id}
                  name={r.name}
                  value={values[r.name]}
                  onChange={(e) => onChange(r.name, e.target.value)}
                  onBlur={() => onBlur(r.name)}
                  placeholder={r.placeholder}
                  autoComplete="off"
                  aria-required="true"
                  aria-invalid={err ? 'true' : undefined}
                  aria-describedby={err ? `${id}-error` : undefined}
                  className="route-input"
                />
              </div>
            </div>
          )
        })}
        <button type="button" onClick={swap} className="route-swap" aria-label="Swap pickup and destination" title="Swap pickup and destination">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
            <path d="M8 4v15M8 4L4.5 7.5M8 4l3.5 3.5M16 20V5M16 20l3.5-3.5M16 20l-3.5-3.5" />
          </svg>
        </button>
      </div>
      {rows.map((r) =>
        shown(r.name) ? (
          <p key={r.name} id={`${idPrefix}-${r.name}-error`} className="field-error">
            {errors[r.name]}
          </p>
        ) : null,
      )}
    </div>
  )
}

function formatDate(v) {
  if (!v) return 'Flexible'
  const d = new Date(`${v}T12:00:00`)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function QuoteForm({ initialService = '', onDone, titleId }) {
  const idPrefix = `quote${useId().replace(/:/g, '')}`
  const form = useEnquiryForm({ kind: 'quote', idPrefix, initial: { service: initialService } })
  const [step, setStep] = useState(0)
  const [attempted, setAttempted] = useState(false)
  const stage = useRef(null)
  const firstRender = useRef(true)
  const { status, values } = form
  const done = status === 'demo' || status === 'sent'
  // The ticket appears the moment the visitor presses send: "Sending" first, then confirmed or failed.
  const sending = attempted && status === 'submitting'
  const failed = attempted && status === 'error'
  const showTicket = done || sending || failed

  // Open the connection to the email service while the visitor fills in the last step.
  useEffect(() => {
    if (step === STEPS.length - 1) warmUp()
  }, [step])

  // Slide the step content in when the step changes.
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    if (!stage.current) return
    if (!prefersReducedMotion()) gsap.fromTo(stage.current.children, { autoAlpha: 0, x: 26 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.05, ease: 'power3.out' })
    const first = stage.current.querySelector('input:not([type=radio]), textarea, input[type=radio]')
    first?.focus({ preventScroll: true })
  }, [step, showTicket])

  const stepErrors = (i) => STEPS[i].fields.filter((f) => form.errors[f])

  const next = () => {
    STEPS[step].fields.forEach((f) => form.onBlur(f))
    const bad = stepErrors(step)
    if (bad.length) {
      document.getElementById(`${idPrefix}-${bad[0]}`)?.focus()
      return
    }
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (step < STEPS.length - 1) return next()
    setAttempted(true)
    await form.submit()
  }

  const restart = () => {
    form.reset()
    setAttempted(false)
    setStep(0)
  }

  const editDetails = () => {
    setAttempted(false)
    setStep(STEPS.length - 1)
  }

  const serviceLabel = serviceOptions.find((o) => o.value === values.service)?.label || 'Not chosen'

  return (
    <div className="grid md:h-[min(760px,90dvh)] md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      {/* Route panel */}
      <aside className="quote-aside relative overflow-hidden text-white">
        <Img image={images.heroPort} sizes="400px" alt="" className="absolute inset-0 h-full w-full object-cover object-[45%_50%] opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/80 via-charcoal/90 to-charcoal" aria-hidden="true" />
        <div className="relative flex h-full flex-col p-6 sm:p-8">
          <Logo tone="light" className="hidden self-start md:inline-flex" />
          <p className="eyebrow pr-14 md:mt-10 md:pr-0">Get a quote</p>
          <h2 id={titleId} className="mt-2 pr-14 text-[1.6rem] md:pr-0 font-extrabold leading-[1.08] tracking-[-0.03em] sm:text-[2rem]">
            Plan your shipment in <span className="serif-i text-[1.1em] text-orange">three</span> steps.
          </h2>

          <ol className="quote-route mt-6 md:mt-9" aria-label="Steps">
            {STEPS.map((s, i) => {
              const state = showTicket || i < step ? 'is-done' : i === step ? 'is-current' : ''
              return (
                <li key={s.key} className={`quote-route-step ${state}`} aria-current={!showTicket && i === step ? 'step' : undefined}>
                  <span className="quote-route-dot" aria-hidden="true">
                    {state === 'is-done' ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span>
                    <span className="block text-[0.95rem] font-extrabold">{s.short}</span>
                    <span className="hidden text-[0.8rem] text-white/60 md:block">{s.label}</span>
                  </span>
                </li>
              )
            })}
          </ol>

          <div className="mt-auto hidden pt-8 md:block">
            <p className="text-[0.85rem] leading-relaxed text-white/70">Our team reviews every request and replies with a recommended plan and a price. A quote is not a booking.</p>
            {isDemoMode && (
              <p className="mt-4 flex gap-2.5 rounded-xl bg-white/10 px-3.5 py-3 text-[0.8rem] leading-snug text-white/85">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-orange" aria-hidden="true" />
                <span>
                  <strong className="font-extrabold">Demonstration form.</strong> No form service is connected yet, so nothing you enter here will be sent.
                </span>
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Steps */}
      <div className="relative flex min-h-0 flex-col bg-ivory md:overflow-y-auto md:overscroll-contain">
        {showTicket ? (
          <div ref={stage} className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10" role="status" aria-live="polite">
            <p className={`eyebrow ${failed ? '!text-orange-deep' : ''}`}>{sending ? 'Sending' : failed ? 'Not sent yet' : status === 'sent' ? 'Request received' : 'Demo complete'}</p>
            <h3 className="mt-2 text-[1.9rem] font-extrabold leading-tight tracking-[-0.03em] text-charcoal">
              {sending ? 'Sending your request…' : failed ? 'We could not send it yet.' : status === 'sent' ? 'Thank you. We are on it.' : 'Your request is ready.'}
            </h3>
            <p className="mt-2 max-w-md text-[0.95rem] text-charcoal/75">
              {sending ? (
                'This only takes a moment.'
              ) : failed ? (
                `${form.errorMessage} Your details are still here, so you can try again.`
              ) : status === 'sent' ? (
                'Our team will review your shipment and reply with a plan and a price.'
              ) : (
                <>
                  This form is a demonstration, so this request was <strong className="font-extrabold text-charcoal">not sent</strong>. Connect a form service to receive requests like this one.
                </>
              )}
            </p>

            {/* Ticket */}
            <div className={`quote-ticket mt-7 ${sending ? 'is-sending' : ''} ${failed ? 'is-failed' : ''}`}>
              <div className="flex items-center justify-between gap-4 px-6 pt-5">
                <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-charcoal/50">Shipment request</span>
                <span className="rounded-full bg-orange/10 px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.12em] text-orange-deep">{serviceLabel}</span>
              </div>
              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 pb-5 pt-4">
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-charcoal/45">From</p>
                  <p className="truncate text-[1.2rem] font-extrabold text-charcoal">{values.pickup}</p>
                </div>
                <span className="quote-ticket-path" aria-hidden="true">
                  <Box className="h-5 w-5" />
                </span>
                <div className="min-w-0 text-right">
                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-charcoal/45">To</p>
                  <p className="truncate text-[1.2rem] font-extrabold text-charcoal">{values.destination}</p>
                </div>
              </div>
              <div className="quote-ticket-tear" aria-hidden="true" />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-3 px-6 pb-6 pt-4 text-[0.88rem]">
                <div>
                  <dt className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-charcoal/45">Preferred date</dt>
                  <dd className="font-bold text-charcoal">{formatDate(values.date)}</dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-charcoal/45">Reply to</dt>
                  <dd className="truncate font-bold text-charcoal">{values.name}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-charcoal/45">Cargo</dt>
                  <dd className="line-clamp-2 text-charcoal/80">{values.cargo}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-7 flex min-h-[46px] flex-wrap items-center gap-3">
              {sending ? (
                <span className="flex items-center gap-2.5 text-sm font-bold text-charcoal/60">
                  <span className="quote-spinner" aria-hidden="true" />
                  Sending to the MOVA team
                </span>
              ) : failed ? (
                <>
                  <button type="button" className="btn-primary" onClick={() => form.submit()}>
                    Try again
                  </button>
                  <button type="button" className="btn-ghost" onClick={editDetails}>
                    Edit details
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="btn-primary" onClick={onDone}>
                    Close
                  </button>
                  <button type="button" className="btn-ghost" onClick={restart}>
                    Start a new request
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col">
            {/* Honeypot: hidden from people, bots fill it and FormSubmit then drops the message */}
            <input type="text" id={`${idPrefix}-hp`} name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" defaultValue="" />
            {/* Sticky step bar: the close button sits on it, so content never scrolls under the X */}
            <div className="sticky top-0 z-10 bg-ivory/90 px-6 pb-4 pt-[22px] backdrop-blur-md sm:px-10 sm:pt-[26px]">
              <div className="flex items-center gap-3 pr-14">
                <span className="text-[0.75rem] font-extrabold uppercase tracking-[0.2em] text-orange">
                  Step {step + 1} of {STEPS.length}
                </span>
                <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-charcoal/10" aria-hidden="true">
                  <span className="block h-full rounded-full bg-orange transition-[width] duration-500 ease-out" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
                </span>
              </div>
            </div>

            <div ref={stage} className="flex-1 px-6 pb-6 pt-2 sm:px-10">
              <h3 className="text-[1.6rem] font-extrabold tracking-[-0.03em] text-charcoal sm:text-[1.85rem]">{STEPS[step].label}</h3>

              {step === 0 && (
                <div className="mt-5 space-y-5">
                  <ServicePicker idPrefix={idPrefix} value={values.service} onChange={form.onChange} onBlur={form.onBlur} error={form.errors.service} touched={form.touched} />
                  <EnquiryFields idPrefix={idPrefix} only={['cargo']} {...form} />
                </div>
              )}

              {step === 1 && (
                <div className="mt-5 space-y-5">
                  <RouteFields idPrefix={idPrefix} form={form} />
                  <div className="max-w-xs">
                    <EnquiryFields idPrefix={idPrefix} only={['date']} layout="stack" {...form} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="mt-5">
                  <EnquiryFields idPrefix={idPrefix} only={['name', 'company', 'email', 'phone']} {...form} />
                  {isDemoMode && <p className="mt-5 text-[0.8rem] text-charcoal/60 md:hidden">Demonstration form: nothing you enter here will be sent.</p>}
                </div>
              )}

              <div aria-live="polite" className="mt-4 min-h-[1.25rem] text-sm">
                {status === 'error' && <p className="text-orange-deep">We could not send your request. Please try again in a moment. ({form.errorMessage})</p>}
              </div>
            </div>

            <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-charcoal/10 bg-ivory/95 px-6 py-4 backdrop-blur sm:px-10">
              {step > 0 ? (
                <button type="button" className="btn-ghost" onClick={() => setStep((s) => s - 1)}>
                  Back
                </button>
              ) : (
                <span className="text-xs text-charcoal/55">Takes about a minute</span>
              )}
              <button type="submit" className="btn-primary" disabled={status === 'submitting'} onPointerEnter={warmUp} onFocus={warmUp}>
                {step < STEPS.length - 1 ? 'Continue' : 'Request my quote'}
                <ArrowRight />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
