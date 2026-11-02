import { useEffect, useRef, useState } from 'react'
import { nav } from '../content/site'
import { useUI } from '../context/UIContext'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useScrollLock } from '../hooks/useScrollLock'
import Logo from './Logo'
import { ArrowRight, Close, Menu } from './Icons'

export default function Navbar() {
  const { openQuote } = useUI()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const panelRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Highlight the section currently in view.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1))
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Close the mobile menu when resizing to desktop.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useScrollLock(open)
  useFocusTrap(panelRef, open, { onEscape: () => setOpen(false) })

  const quote = () => {
    setOpen(false)
    openQuote()
  }

  return (
    <>
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className={`pointer-events-auto overflow-hidden bg-charcoal/90 backdrop-blur-md transition-[max-height,opacity] duration-500 ${
          scrolled ? 'max-h-0 opacity-0' : 'max-h-9 opacity-100'
        }`}
      >
        <p className="site-x flex h-8 items-center justify-between text-[0.62rem] font-bold uppercase tracking-[0.3em] text-ivory/80">
          <span>Freight / Storage / Delivery</span>
          <span className="hidden text-ivory/50 sm:inline">People move possibilities</span>
        </p>
      </div>
      {/* The nav is a card that stops short of the right edge, as in the design; the hero photo shows beside it */}
      <div
        className={`nav-card pointer-events-auto transition-[background-color,box-shadow] duration-500 lg:mr-[max(4vw,calc(50vw-42rem))] lg:rounded-r-[24px] ${
          scrolled ? 'bg-ivory-soft/95 shadow-[0_10px_30px_-16px_rgba(32,35,33,.4)] backdrop-blur-xl' : 'bg-ivory-soft'
        }`}
      >
      <nav aria-label="Main" className={`site-x flex items-center justify-between gap-6 transition-[height] duration-500 lg:pr-8 ${scrolled ? 'h-16' : 'h-[4.5rem]'}`}>
        <a href="#top" className="rounded-md" aria-label="MOVA Logistics, back to top">
          <Logo />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {nav.map((item) => {
            const isActive = scrolled && active === item.href.slice(1)
            return (
              <li key={item.href}>
                <a href={item.href} className={`nav-link ${isActive ? 'is-active' : ''}`} aria-current={isActive ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button type="button" onClick={quote} className="btn-primary hidden !min-h-[42px] !px-5 !py-2 !text-[0.88rem] sm:inline-flex">
            Get a quote
          </button>
          <button
            type="button"
            className="icon-btn lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>
      </div>
    </header>

      {/* Mobile menu (outside the header so backdrop blur does not trap its fixed positioning) */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setOpen(false)}
        />
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          inert={!open}
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-ivory px-6 pb-8 pt-5 shadow-lift transition-transform duration-[400ms] ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button type="button" className="icon-btn" aria-label="Close menu" onClick={() => setOpen(false)}>
              <Close className="h-6 w-6" />
            </button>
          </div>
          <ul className="mt-12 flex flex-col">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className={`border-b border-charcoal/10 transition duration-500 ${open ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
                style={{ transitionDelay: open ? `${120 + i * 50}ms` : '0ms' }}
              >
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-4 text-2xl font-medium tracking-tight text-charcoal transition-colors hover:text-orange focus-visible:text-orange"
                >
                  {item.label}
                  <ArrowRight className="h-5 w-5 opacity-50" />
                </a>
              </li>
            ))}
          </ul>
          <button type="button" onClick={quote} className="btn-primary mt-auto w-full justify-center">
            Get a quote
          </button>
          <p className="mt-4 text-center text-xs uppercase tracking-[0.28em] text-charcoal-muted">People move possibilities</p>
        </div>
      </div>
    </>
  )
}
