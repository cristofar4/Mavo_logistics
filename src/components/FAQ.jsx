import { useId, useRef, useState } from 'react'
import { faqs } from '../content/site'
import { useReveal } from '../hooks/useReveal'
import { useUI } from '../context/UIContext'
import { Plus } from './Icons'

function Item({ q, a, open, onToggle, id }) {
  return (
    <li data-reveal className="border-b border-charcoal/10">
      <h3>
        <button
          type="button"
          id={`${id}-btn`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left"
        >
          <span className={`text-lg font-medium tracking-tight transition-colors duration-300 sm:text-xl ${open ? 'text-orange-deep' : 'group-hover:text-orange-deep'}`}>{q}</span>
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
              open ? 'rotate-45 border-orange bg-orange text-ivory' : 'border-charcoal/15 text-charcoal group-hover:border-charcoal'
            }`}
            aria-hidden="true"
          >
            <Plus />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className={`grid transition-[grid-template-rows,opacity] duration-[400ms] ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
        inert={!open}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-7 pr-12 text-[0.98rem] leading-relaxed text-charcoal-muted">{a}</p>
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
    <section id="faq" ref={root} className="section-y relative" aria-labelledby="faq-title">
      <div className="site-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p data-reveal className="eyebrow mb-4">Questions</p>
          <h2 data-reveal id="faq-title" className="display text-[clamp(2.2rem,4vw,3.4rem)]">
            A few things <em className="accent">you might ask.</em>
          </h2>
          <p data-reveal className="mt-5 max-w-sm text-[1.02rem] leading-relaxed text-charcoal-muted">
            Quick answers to common questions. If yours is not here, our team is happy to help.
          </p>
          <button data-reveal type="button" onClick={() => openQuote()} className="text-link mt-8 inline-flex">
            Ask us directly
          </button>
        </div>
        <ul className="border-t border-charcoal/10 lg:col-span-7 lg:col-start-6">
          {faqs.map((f, i) => (
            <Item key={f.q} id={`${base}-${i}`} q={f.q} a={f.a} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </ul>
      </div>
    </section>
  )
}
