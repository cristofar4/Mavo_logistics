import { useRef } from 'react'
import { images } from '../content/site'
import { useUI } from '../context/UIContext'
import { useReveal } from '../hooks/useReveal'
import ContactInfo from './ContactInfo'
import Img from './Img'
import { ArrowRight } from './Icons'

export default function Contact() {
  const root = useRef(null)
  const { openQuote } = useUI()
  useReveal(root)

  return (
    <section id="contact" ref={root} className="relative bg-ivory pb-16 sm:pb-20 lg:pb-24" aria-labelledby="contact-title">
      <div className="site-x">
        <div className="relative overflow-hidden rounded-xl bg-charcoal text-ivory">
          <div className="absolute inset-0 opacity-40" aria-hidden="true">
            <Img image={images.sea} sizes="100vw" alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/40" />
          </div>
          <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-12 lg:p-16">
            <div className="lg:col-span-7">
              <p data-reveal className="eyebrow mb-3">Contact</p>
              <h2 data-reveal id="contact-title" className="display text-[clamp(2.2rem,4vw,3.4rem)] !text-ivory">
                Let’s plan your <span className="text-orange">next shipment.</span>
              </h2>
              <p data-reveal className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-ivory/70">
                Tell us what you need to move and where it needs to go. We will come back with a clear plan and a price.
              </p>
              <div data-reveal className="mt-9 flex flex-wrap gap-3">
                <button type="button" className="btn-primary btn-lg" onClick={() => openQuote()}>
                  Get a quote
                  <ArrowRight />
                </button>
                <a href="#faq" className="inline-flex min-h-[44px] items-center gap-2 rounded-md border border-ivory/25 px-6 text-[0.95rem] font-semibold text-ivory transition-colors duration-300 hover:border-ivory hover:bg-ivory hover:text-charcoal">
                  Read the FAQ
                </a>
              </div>
            </div>
            <div data-reveal className="lg:col-span-4 lg:col-start-9">
              <div className="rounded-lg border border-ivory/10 bg-charcoal/60 p-6 backdrop-blur-md">
                <ContactInfo tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
