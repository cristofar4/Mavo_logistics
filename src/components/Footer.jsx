import { brand, contact, industries, nav, services, socials } from '../content/site'
import { useUI } from '../context/UIContext'
import Logo from './Logo'
import { Mail, Phone, Social } from './Icons'

/* Charcoal footer with the outlined MOVA mark, as in the design. */
export default function Footer() {
  const { openService, openLegal, openQuote } = useUI()
  const year = new Date().getFullYear()

  const contactRows = [
    { icon: Mail, label: 'Email us', href: contact.email ? `mailto:${contact.email}` : null, value: contact.email, missing: 'Email address to be added' },
    { icon: Phone, label: 'Call or WhatsApp', href: contact.phone ? `tel:${contact.phone.replace(/\s/g, '')}` : null, value: contact.phone, missing: 'Phone number to be added' },
  ]

  return (
    <footer className="relative overflow-hidden bg-charcoal text-ivory" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <p className="pointer-events-none absolute -left-4 top-6 select-none text-[clamp(7rem,22vw,17rem)] font-extrabold leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_rgba(245,242,234,0.08)]" aria-hidden="true">
        MOVA
      </p>
      <div className="site-x relative grid gap-12 pb-10 pt-16 lg:grid-cols-12 lg:pt-20">
        <div className="lg:col-span-4 lg:pt-24">
          <a href="#top" aria-label="MOVA Logistics, back to top" className="inline-block rounded-md">
            <Logo tone="light" />
          </a>
          <p className="mt-5 text-lg font-extrabold tracking-tight text-ivory">{brand.tagline}</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ivory/60">{brand.description}</p>
          <button type="button" onClick={() => openQuote()} className="btn-primary mt-6">
            Get a quote
          </button>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5">
          <div>
            <h3 className="text-sm font-extrabold text-ivory">Services</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {services.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => openService(s.id)} className="footer-link" aria-haspopup="dialog">
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-ivory">Industries</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {industries.map((i) => (
                <li key={i.id}>
                  <a href="#industries" className="footer-link">
                    {i.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-ivory">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              {nav
                .filter((n) => n.href !== '#services' && n.href !== '#industries')
                .map((n) => (
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
        </nav>

        <div className="lg:col-span-3">
          <h3 className="text-sm font-extrabold text-ivory">Get in touch</h3>
          <ul className="mt-4 space-y-4 text-sm">
            {contactRows.map(({ icon: Icon, label, href, value, missing }) => (
              <li key={label} className="flex items-start gap-3">
                <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ivory/80" />
                <span className="flex flex-col gap-1">
                  <span className="text-ivory/85">{label}</span>
                  {href ? (
                    <a href={href} className="footer-link">
                      {value}
                    </a>
                  ) : (
                    <span className="placeholder-tag-dark w-fit">{missing}</span>
                  )}
                </span>
              </li>
            ))}
            {socials.map((s) => (
              <li key={s.label} className="flex items-start gap-3">
                <Social className="mt-0.5 h-5 w-5 shrink-0 text-ivory/80" />
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="footer-link">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="flex flex-col gap-1">
                    <span className="text-ivory/85">{s.label}</span>
                    <span className="placeholder-tag-dark w-fit">Profile link to be added</span>
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-x relative flex flex-col gap-4 border-t border-ivory/10 py-6 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p>© {year} MOVA Logistics</p>
          <span className="h-3 w-px bg-ivory/20" aria-hidden="true" />
          <button type="button" onClick={() => openLegal('privacy')} className="footer-link" aria-haspopup="dialog">
            Privacy policy
          </button>
          <span className="h-3 w-px bg-ivory/20" aria-hidden="true" />
          <button type="button" onClick={() => openLegal('terms')} className="footer-link" aria-haspopup="dialog">
            Terms
          </button>
        </div>
        <span className="font-bold tracking-[0.3em] text-ivory/45">PEOPLE MOVE POSSIBILITIES</span>
      </div>
    </footer>
  )
}
