import { useId, useRef, useState } from 'react'
import { faqs } from '../content/site'
import { useReveal } from '../hooks/useReveal'
import { useUI } from '../context/UIContext'
import { Box, Doc, Globe, Route, Truck } from './Icons'

const ICONS = [Box, Doc, Globe, Truck, Route]

function Chevron({ open }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-orange' : 'text-charcoal/60'}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

function Item({ q, a, open, onToggle, id, Icon }) {
  return (
    <li data-reveal className={`rounded-lg border bg-white/70 transition-colors duration-300 ${open ? 'border-orange/40 shadow-soft' : 'border-charcoal/10 hover:border-charcoal/25'}`}>
      <h3>
        <button type="button" id={`${id}-btn`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={onToggle} className="flex w-full items-center gap-4 rounded-lg px-4 py-4 text-left sm:px-5">
          <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md transition-colors duration-300 ${open ? 'bg-orange text-white' : 'bg-ivory text-charcoal'}`}>
            <Icon className="h-5 w-5" />
          </span>
          <span className="flex-1 text-[0.95rem] font-bold tracking-tight">{q}</span>
          <Chevron open={open} />
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className={`grid transition-[grid-template-rows,opacity] duration-[400ms] ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} inert={!open}>
        <div className="overflow-hidden">
          <p className="pb-5 pl-[4.25rem] pr-6 text-[0.92rem] leading-relaxed text-charcoal-muted sm:pl-[4.5rem]">{a}</p>
        </div>
      </div>
    </li>
  )
}

export default function FAQ() {
  const root = useRef(null)
  const base = useId().replace(/:/g, '')
  const [open, setOpen] = useState(0)
  const { openQuote } = useUI()
  useReveal(root)

  return (
    <section id="faq" ref={root} className="relative bg-ivory py-14 sm:py-16 lg:py-20" aria-labelledby="faq-title">
      <div className="site-x grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 data-reveal id="faq-title" className="h2">
            A few things you might ask.
          </h2>
          <p data-reveal className="mt-4 max-w-xs text-[0.98rem] leading-relaxed text-charcoal-muted">
            Get the quick answers you need. If you still have questions, our team is here to help.
          </p>
          <button data-reveal type="button" onClick={() => openQuote()} className="btn-ghost mt-7">
            Ask our team
          </button>
        </div>
        <ul className="space-y-3 lg:col-span-8">
          {faqs.map((f, i) => (
            <Item key={f.q} id={`${base}-${i}`} q={f.q} a={f.a} Icon={ICONS[i % ICONS.length]} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
