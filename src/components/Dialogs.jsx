import { legal, services } from '../content/site'
import { useUI } from '../context/UIContext'
import Modal from './Modal'
import Img from './Img'
import QuoteForm from './QuoteForm'
import { ArrowRight, Check } from './Icons'

function ServiceDetail({ id }) {
  const { openQuote, openService } = useUI()
  const index = services.findIndex((s) => s.id === id)
  const s = services[index] || services[0]
  const next = services[(index + 1) % services.length]

  return (
    <div>
      <div className="relative aspect-[16/8] overflow-hidden sm:aspect-[16/6.5]">
        <Img key={s.id} image={s.detailImage || s.image} sizes="(min-width: 900px) 900px, 100vw" className="h-full w-full animate-[settle_900ms_cubic-bezier(.22,1,.36,1)] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" aria-hidden="true" />
        <p className="absolute bottom-5 left-6 flex max-w-lg items-end gap-3 text-lg font-extrabold leading-snug tracking-[-0.01em] text-white sm:left-8 sm:text-xl"><span className="serif-i text-5xl leading-[0.8] text-orange">{s.no}</span><span>{s.short}</span></p>
      </div>
      <div className="grid gap-8 px-6 py-7 sm:px-8 md:grid-cols-5">
        <div className="space-y-4 text-[0.98rem] leading-relaxed text-charcoal-muted md:col-span-3">
          {s.detail.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <h3 className="pt-3 text-sm font-semibold uppercase tracking-[0.2em] text-charcoal">How it works</h3>
          <ol className="grid gap-3 sm:grid-cols-3">
            {s.steps.map((step, i) => (
              <li key={step} className="rounded-2xl border border-charcoal/10 bg-ivory-soft p-4">
                <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-orange text-xs font-semibold text-ivory">{i + 1}</span>
                <span className="text-sm text-charcoal">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="md:col-span-2">
          <div className="rounded-2xl bg-charcoal p-6 text-ivory">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-ivory/70">Well suited to</h3>
            <ul className="mt-4 space-y-3">
              {s.suits.map((x) => (
                <li key={x} className="flex gap-3 text-[0.95rem]">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-orange" />
                  {x}
                </li>
              ))}
            </ul>
            <button type="button" className="btn-primary mt-6 w-full justify-center" onClick={() => openQuote(s.id)}>
              Request a quote for {s.title.toLowerCase()}
              <ArrowRight />
            </button>
          </div>
          <button type="button" onClick={() => openService(next.id)} className="mt-5 inline-flex items-center gap-2 border-b-2 border-orange pb-1 text-[0.92rem] font-extrabold text-charcoal transition-colors hover:text-orange-deep">
            Next: {next.title}
            <ArrowRight />
          </button>
        </div>
      </div>
    </div>
  )
}

function LegalDetail({ kind }) {
  const doc = legal[kind]
  return (
    <div className="space-y-4 px-6 py-7 text-charcoal-muted sm:px-8">
      {doc.body.map((p) => (
        <p key={p}>{p}</p>
      ))}
      <p className="placeholder-tag">Replace this text in src/content/site.js before launch.</p>
    </div>
  )
}

/* Renders whichever dialog is currently requested through UIContext. */
export default function Dialogs() {
  const { dialog, close } = useUI()
  const open = !!dialog && !dialog.closing
  const type = dialog?.type

  let title = ''
  let eyebrow = ''
  let body = null
  let size = 'md'

  if (type === 'quote') {
    title = 'Request a quote'
    eyebrow = 'Get a quote'
    body = <QuoteForm key={`q-${dialog.payload.service}`} initialService={dialog.payload.service} onDone={close} />
  } else if (type === 'service') {
    const s = services.find((x) => x.id === dialog.payload.id)
    title = s?.title
    eyebrow = 'Service details'
    size = 'lg'
    body = <ServiceDetail id={dialog.payload.id} />
  } else if (type === 'legal') {
    title = legal[dialog.payload.kind].title
    eyebrow = 'MOVA Logistics'
    size = 'sm'
    body = <LegalDetail kind={dialog.payload.kind} />
  }

  return (
    <Modal open={open} onClose={close} title={title} eyebrow={eyebrow} size={size}>
      {body}
    </Modal>
  )
}
