import { brand, nav, services, socials } from '../content/site'
import { useUI } from '../context/UIContext'
import Logo from './Logo'
import ContactInfo from './ContactInfo'

export default function Footer() {
  const { openService, openLegal, openQuote } = useUI()
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden bg-charcoal text-ivory" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <p className="pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-[clamp(8rem,26vw,24rem)] font-semibold leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(245,242,234,0.07)]" aria-hidden="true">
        MOVA
      </p>
      <div className="site-x relative grid gap-12 pb-10 pt-20 lg:grid-cols-12 lg:pt-24">
        <div className="lg:col-span-4">
          <a href="#top" aria-label="MOVA Logistics, back to top" className="inline-block rounded-md">
            <Logo tone="light" />
          </a>
          <p className="mt-6 font-serif text-2xl italic text-ivory">{brand.tagline}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/60">{brand.description}</p>
          <button type="button" onClick={() => openQuote()} className="btn-primary mt-7">
            Get a quote
          </button>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-ivory/45">Company</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="footer-link">
                    {n.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq" className="footer-link">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-ivory/45">Services</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => openService(s.id)} className="footer-link" aria-haspopup="dialog">
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-ivory/45">Follow</h3>
            <ul className="mt-5 space-y-3 text-sm">
              {socials.map((s) =>
                s.url ? (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="footer-link">
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ) : (
                  <li key={s.label} className="flex flex-col gap-1">
                    <span className="text-ivory/80">{s.label}</span>
                    <span className="placeholder-tag-dark w-fit text-[0.7rem]">Profile link to be added</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </nav>

        <div className="lg:col-span-3">
          <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-ivory/45">Contact</h3>
          <div className="mt-5">
            <ContactInfo tone="dark" />
          </div>
        </div>
      </div>

      <div className="site-x relative flex flex-col gap-4 border-t border-ivory/10 py-7 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} MOVA Logistics. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <button type="button" onClick={() => openLegal('privacy')} className="footer-link" aria-haspopup="dialog">
            Privacy policy
          </button>
          <button type="button" onClick={() => openLegal('terms')} className="footer-link" aria-haspopup="dialog">
            Terms
          </button>
          <span className="hidden tracking-[0.3em] sm:inline">PEOPLE MOVE POSSIBILITIES</span>
        </div>
      </div>
    </footer>
  )
}
