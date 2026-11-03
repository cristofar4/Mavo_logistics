import { brand, contact, footer, services, socials } from '../content/site'
import { useUI } from '../context/UIContext'
import Logo from './Logo'
import { Mail, MapPinLine, Phone, Social } from './Icons'

/*
 * Charcoal footer as in the design. The "Get in touch" column is the Contact stop in the navigation.
 * Email, phone, address and social profiles appear automatically once they are filled in (content/site.js).
 */
export default function Footer() {
  const { openService, openLegal, openQuote } = useUI()
  const year = new Date().getFullYear()
  const rows = [
    contact.email && { icon: Mail, label: contact.email, href: `mailto:${contact.email}` },
    contact.phone && { icon: Phone, label: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
    contact.address && { icon: MapPinLine, label: contact.address },
  ].filter(Boolean)
  const links = socials.filter((s) => s.url)

  return (
    <footer className="relative overflow-hidden bg-charcoal text-white" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Site footer
      </h2>
      <p className="pointer-events-none absolute -bottom-[0.22em] left-[2%] select-none text-[clamp(7rem,20vw,16rem)] font-extrabold leading-none tracking-[-0.03em] text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.06)]" aria-hidden="true">
        MOVA
      </p>
      <div className="site-x relative grid gap-10 pb-8 pt-12 lg:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,2fr)] lg:gap-14 lg:pt-14">
        <div>
          <a href="#top" aria-label="MOVA Logistics, back to top" className="inline-block rounded-md">
            <Logo tone="light" size="lg" />
          </a>
          <p className="mt-5 max-w-[20rem] text-[0.95rem] leading-relaxed text-white/80">{brand.description}</p>
        </div>
        <span className="hidden w-[3px] rounded-full bg-orange lg:block" aria-hidden="true" />
        <div className="grid gap-10 sm:grid-cols-3">
          <nav aria-label="Company">
            <h3 className="text-[1.05rem] font-extrabold">Company</h3>
            <ul className="mt-3 space-y-1.5 text-[0.92rem]">
              {footer.company.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="footer-link">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Services">
            <h3 className="text-[1.05rem] font-extrabold">Services</h3>
            <ul className="mt-3 space-y-1.5 text-[0.92rem]">
              {services.map((s) => (
                <li key={s.id}>
                  <button type="button" onClick={() => openService(s.id)} className="footer-link" aria-haspopup="dialog">
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div id="contact">
            <h3 className="text-[1.05rem] font-extrabold">Get in touch</h3>
            <p className="mt-3 max-w-[16rem] text-[0.92rem] leading-snug text-white/80">{footer.getInTouch}</p>
            {rows.length > 0 && (
              <ul className="mt-4 space-y-2 text-[0.9rem]">
                {rows.map(({ icon: Icon, label, href }) => (
                  <li key={label} className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 text-orange" />
                    {href ? (
                      <a href={href} className="footer-link">
                        {label}
                      </a>
                    ) : (
                      <span className="text-white/80">{label}</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {links.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-3 text-[0.9rem]">
                {links.map((s) => (
                  <li key={s.label}>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="footer-link gap-1.5">
                      <Social className="h-4 w-4" />
                      {s.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" onClick={() => openQuote()} className="btn-outline-light mt-5">
              Get a quote
            </button>
          </div>
        </div>
      </div>
      <div className="site-x relative">
        <div className="flex flex-col gap-3 border-t border-white/15 py-5 text-[0.85rem] text-white/80 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {year} MOVA Logistics. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <button type="button" onClick={() => openLegal('privacy')} className="footer-link" aria-haspopup="dialog">
              Privacy
            </button>
            <span className="h-4 w-px bg-white/40" aria-hidden="true" />
            <button type="button" onClick={() => openLegal('terms')} className="footer-link" aria-haspopup="dialog">
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
