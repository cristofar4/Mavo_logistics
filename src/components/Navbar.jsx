import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { nav, services } from '../content/site'
import { useUI } from '../context/UIContext'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useScrollLock } from '../hooks/useScrollLock'
import Logo from './Logo'
import { ArrowRight, ArrowUpRight, ChevronDown, Close, Menu } from './Icons'

/*
 * Navigation as in the design: a white logo tab, a dark bar with a white highlight that slides to
 * the section in view (Services opens a dropdown of the four services) and an orange quote pill.
 */
export default function Navbar() {
  const { openQuote, openService } = useUI()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [drop, setDrop] = useState(false)
  const [active, setActive] = useState('services')
  const [pill, setPill] = useState(null)
  const panelRef = useRef(null)
  const barRef = useRef(null)
  const itemRefs = useRef({})
  const dropRef = useRef(null)
  const dropBtn = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Track the section in view; before Services is reached the highlight rests on Services, as in the design.
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1))
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          // Near the top of the page the highlight rests on Services, as in the design.
          setActive(window.scrollY < 300 ? 'services' : e.target.id)
        }),
      { rootMargin: '-40% 0px -55% 0px' },
    )
    const onTop = () => window.scrollY < 300 && setActive('services')
    window.addEventListener('scroll', onTop, { passive: true })
    els.forEach((el) => io.observe(el))
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onTop)
    }
  }, [])

  // Slide the white highlight under the active item.
  const measure = useCallback(() => {
    const el = itemRefs.current[active]
    const bar = barRef.current
    if (!el || !bar || !bar.offsetWidth) return
    const r = el.getBoundingClientRect()
    const rb = bar.getBoundingClientRect()
    setPill({ x: r.left - rb.left, w: r.width })
  }, [active])
  useLayoutEffect(() => {
    measure()
    document.fonts?.ready.then(measure)
    const ro = new ResizeObserver(measure)
    if (barRef.current) ro.observe(barRef.current)
    Object.values(itemRefs.current).forEach((el) => el && ro.observe(el))
    return () => ro.disconnect()
  }, [measure])

  // Close the dropdown on outside click or Escape.
  useEffect(() => {
    if (!drop) return
    const onDown = (e) => {
      if (!dropRef.current?.contains(e.target) && !dropBtn.current?.contains(e.target)) setDrop(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setDrop(false)
        dropBtn.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [drop])

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
    setDrop(false)
    openQuote()
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className={`absolute inset-x-0 top-0 h-[5.25rem] transition-[background-color,box-shadow,backdrop-filter] duration-500 lg:h-[5.6rem] ${scrolled ? 'bg-ivory/80 shadow-[0_10px_30px_-22px_rgba(27,33,33,.45)] backdrop-blur-xl' : 'bg-transparent'}`} aria-hidden="true" />
        <nav aria-label="Main" className="site-x relative flex h-[5.25rem] items-center gap-3 lg:h-[5.6rem] lg:gap-4">
          {/* Logo tab */}
          <a href="#top" className="slant slant-shadow flex h-[52px] shrink-0 items-center pl-5 pr-10 lg:h-[60px] lg:pl-7 lg:pr-12" style={{ '--r': '14px', '--tip': '22px' }} aria-label="MOVA Logistics, back to top">
            <Logo />
          </a>

          {/* Dark bar */}
          <div ref={barRef} className="slant relative hidden h-[60px] flex-1 items-center pl-2 pr-10 lg:flex" style={{ '--bg': '#1B2121', '--r': '28px', '--tip': '24px' }}>
            {pill && (
              <span
                className="slant slant-shadow pointer-events-none absolute left-0 top-[7px] h-[46px] transition-[transform,width] duration-500 ease-out"
                style={{ '--bg': '#fff', '--r': '22px', '--tip': '14px', width: pill.w + 4, transform: `translateX(${pill.x}px)` }}
                aria-hidden="true"
              />
            )}
            <ul className="relative flex items-center">
              {nav.map((item) => {
                const id = item.href.slice(1)
                const isActive = active === id
                if (item.dropdown) {
                  return (
                    <li key={item.href} className="relative" ref={(el) => (itemRefs.current[id] = el)}>
                      <button
                        ref={dropBtn}
                        type="button"
                        className={`nav-item ${isActive ? 'is-active' : ''}`}
                        aria-expanded={drop}
                        aria-controls="services-menu"
                        onClick={() => setDrop((d) => !d)}
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 text-orange transition-transform duration-300 ${drop ? 'rotate-180' : ''}`} />
                      </button>
                      <div
                        id="services-menu"
                        ref={dropRef}
                        className={`absolute left-0 top-[calc(100%+18px)] w-[25rem] origin-top-left rounded-2xl bg-white p-2 shadow-lift transition duration-300 ease-out ${
                          drop ? 'visible translate-y-0 scale-100 opacity-100' : 'invisible -translate-y-2 scale-[.97] opacity-0'
                        }`}
                      >
                        <ul>
                          {services.map((s) => (
                            <li key={s.id}>
                              <button
                                type="button"
                                aria-haspopup="dialog"
                                onClick={() => {
                                  setDrop(false)
                                  openService(s.id)
                                }}
                                className="group flex w-full items-start gap-4 rounded-xl px-4 py-3 text-left transition-colors hover:bg-ivory focus-visible:bg-ivory"
                              >
                                <span className="serif-i w-8 shrink-0 text-2xl leading-none text-orange" aria-hidden="true">{s.no}</span>
                                <span>
                                  <span className="flex items-center gap-2 text-[0.98rem] font-extrabold text-charcoal">
                                    {s.title}
                                    <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-orange opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                                  </span>
                                  <span className="mt-0.5 block text-[0.82rem] leading-snug text-charcoal-muted">{s.short}</span>
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                        <a href="#services" onClick={() => setDrop(false)} className="mt-1 flex items-center justify-between rounded-xl bg-charcoal px-4 py-3 text-sm font-extrabold text-white transition-colors hover:bg-orange">
                          See all services
                          <ArrowRight />
                        </a>
                      </div>
                    </li>
                  )
                }
                return (
                  <li key={item.href} ref={(el) => (itemRefs.current[id] = el)}>
                    <a href={item.href} className={`nav-item ${isActive ? 'is-active' : ''}`} aria-current={isActive ? 'true' : undefined}>
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {/* Quote pill */}
            <button type="button" onClick={quote} className="group hidden h-[60px] items-center gap-4 rounded-full bg-orange pl-7 pr-2 text-[1.08rem] font-extrabold text-white shadow-[0_12px_26px_-14px_rgba(234,106,31,.95)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-orange-deep sm:flex">
              Get a quote
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal transition-transform duration-500 ease-out group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </button>
            <button
              type="button"
              className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-charcoal text-white lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-charcoal/45 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          inert={!open}
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-charcoal px-6 pb-8 pt-5 text-white shadow-lift transition-transform duration-[400ms] ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between">
            <Logo tone="light" />
            <button type="button" className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-orange" aria-label="Close menu" onClick={() => setOpen(false)}>
              <Close className="h-6 w-6" />
            </button>
          </div>
          <ul className="mt-10 flex flex-col">
            {nav.map((item, i) => (
              <li
                key={item.href}
                className={`border-b border-white/10 transition duration-500 ${open ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`}
                style={{ transitionDelay: open ? `${120 + i * 50}ms` : '0ms' }}
              >
                <a href={item.href} onClick={() => setOpen(false)} className="flex items-center justify-between py-4 text-2xl font-extrabold tracking-tight transition-colors hover:text-orange focus-visible:text-orange">
                  {item.label}
                  <ArrowRight className="h-5 w-5 text-orange" />
                </a>
              </li>
            ))}
          </ul>
          <button type="button" onClick={quote} className="group mt-auto flex h-14 items-center justify-between rounded-full bg-orange pl-6 pr-1.5 text-base font-extrabold">
            Get a quote
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </button>
        </div>
      </div>
    </>
  )
}
