import { useId, useRef, useState } from 'react'
import { faqIntro, faqs } from '../content/site'
import { gsap, useGSAP, MOTION_OK } from '../lib/gsap'
import { ChevronDown } from './Icons'

function Item({ q, a, open, onToggle, id }) {
  return (
    <li data-faq className="border-b border-charcoal/15">
      <h3>
        <button type="button" id={`${id}-btn`} aria-expanded={open} aria-controls={`${id}-panel`} onClick={onToggle} className="group flex min-h-[48px] w-full items-center justify-between gap-4 py-3 text-left">
          <span className={`text-[0.95rem] font-extrabold tracking-tight transition-colors lg:text-[1.02rem] duration-300 ${open ? 'text-orange-deep' : 'text-charcoal group-hover:text-orange-deep'}`}>{q}</span>
          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-orange' : 'text-charcoal'}`} />
        </button>
      </h3>
      <div id={`${id}-panel`} role="region" aria-labelledby={`${id}-btn`} className={`grid transition-[grid-template-rows,opacity] duration-[400ms] ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`} inert={!open}>
        <div className="overflow-hidden">
          <p className="pb-4 pr-6 text-[0.88rem] leading-relaxed text-charcoal/75">{a}</p>
        </div>
      </div>
    </li>
  )
}

/* Frequently asked questions in two columns, as in the design. */
export default function FAQ() {
  const root = useRef(null)
  const base = useId().replace(/:/g, '')
  const [open, setOpen] = useState(-1)
  const half = Math.ceil(faqs.length / 2)
  const cols = [faqs.slice(0, half), faqs.slice(half)]

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        gsap.from('[data-head] > *', { autoAlpha: 0, y: 18, duration: 0.6, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } })
        gsap.from('[data-faq]', { autoAlpha: 0, y: 14, duration: 0.5, stagger: 0.06, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 85%', once: true } })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section id="faq" ref={root} className="bg-ivory pb-14 pt-10 sm:pb-16" aria-labelledby="faq-title">
      <div className="site-x">
        <div className="grid gap-8 border-t border-charcoal/10 pt-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.3fr)] lg:gap-12">
          <div data-head>
            <h2 id="faq-title" className="h2 max-w-[20rem] text-[clamp(1.75rem,2.8vw,2.7rem)] text-charcoal">
              {faqIntro.heading}
            </h2>
            <p className="mt-3 max-w-[15rem] text-[0.95rem] leading-snug text-charcoal/75">{faqIntro.body}</p>
          </div>
          <div className="grid gap-x-10 md:grid-cols-2">
            {cols.map((col, c) => (
              <ul key={c} className="border-t border-charcoal/15 md:border-t-0">
                {col.map((f, i) => {
                  const idx = c * half + i
                  return <Item key={f.q} id={`${base}-${idx}`} q={f.q} a={f.a} open={open === idx} onToggle={() => setOpen(open === idx ? -1 : idx)} />
                })}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
