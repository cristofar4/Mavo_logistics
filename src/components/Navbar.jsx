import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { nav, services } from '../content/site'
import { useUI } from '../context/UIContext'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useScrollLock } from '../hooks/useScrollLock'
import { prefersReducedMotion } from '../lib/gsap'
import Img from './Img'
import Logo from './Logo'
import CloseButton from './CloseButton'
import { ArrowRight, ArrowUpRight, ChevronDown, Menu } from './Icons'

/*
 * Dock navigation.
 *
 * One glassy dock holds everything: the logo key on the left, the section links in page order and the
 * quote button on the right.
 *   Active tab     a white tab sits on the section in view; a soft glow follows the pointer and
 *                  springs back to the active tab when the pointer leaves.
 *   Compact mode   after the hero the dock shrinks into a floating bar.
 *   Services       hovering (or focusing) Services previews the four services; clicking the link
 *                  still scrolls to the section, clicking a preview opens that service.
 *   Route rail     a thin rail along the bottom edge fills as the page scrolls, with a mark under
 *                  each section and a small MOVA truck that turns round when scrolling back up.
 *   Phones         the dock shows the section being read; the menu opens a vertical route map.
 */

const RING = 2 * Math.PI * 24
const canHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

function TruckMark({ className = '' }) {
  return (
    <svg viewBox="0 0 30 17" className={className} aria-hidden="true" focusable="false">
      <rect x="1" y="2" width="17.5" height="10.5" rx="1.8" fill="currentColor" />
      <rect x="3.6" y="5.2" width="9" height="1.5" rx=".75" fill="#EA6A1F" />
      <path d="M19.4 5h5.2l3.9 4.1v3.4h-9.1z" fill="#EA6A1F" />
      <path d="M21.2 6.5h2.8l2.1 2.3h-4.9z" fill="#1B2121" opacity=".6" />
      <circle cx="6.2" cy="13.6" r="2.5" fill="#1B2121" stroke="#F7F2E8" strokeWidth="1.3" />
      <circle cx="23.8" cy="13.6" r="2.5" fill="#1B2121" stroke="#F7F2E8" strokeWidth="1.3" />
    </svg>
  )
}

/* Scroll positions at which each section is reached: the section top, less the scroll padding. */
function readStops() {
  const y = window.scrollY
  const doc = document.documentElement
  const max = Math.max(1, doc.scrollHeight - window.innerHeight)
  const pad = parseFloat(getComputedStyle(doc).scrollPaddingTop) || 0
  return {
    y,
    max,
    stops: nav.map((n) => {
      const el = document.querySelector(n.href)
      return el ? Math.min(max, Math.max(0, el.getBoundingClientRect().top + y - pad)) : max
    }),
  }
}

export default function Navbar() {
  const { openQuote, openService } = useUI()
  const [compact, setCompact] = useState(false)
  const [onDark, setOnDark] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [hover, setHover] = useState(null)
  const [preview, setPreview] = useState(false)
  const [tabs, setTabs] = useState([])
  const panelRef = useRef(null)
  const dockRef = useRef(null)
  const logoRef = useRef(null)
  const quoteRef = useRef(null)
  const ulRef = useRef(null)
  const linkRefs = useRef([])
  const servicesLi = useRef(null)
  const previewTimer = useRef(0)
  // route rail
  const railRef = useRef(null)
  const fillRef = useRef(null)
  const truckRef = useRef(null)
  const tickRefs = useRef([])
  const nodesX = useRef([])
  const dir = useRef(1)
  const lastY = useRef(0)
  // mobile
  const ringRef = useRef(null)
  const mListRef = useRef(null)
  const mNodeRefs = useRef([])
  const mFillRef = useRef(null)
  const mTruckRef = useRef(null)

  /* Tab positions (relative to the link list) and section marks (relative to the rail). */
  const measure = useCallback(() => {
    const ul = ulRef.current
    const rail = railRef.current
    if (!ul || !ul.offsetWidth || !rail) {
      if (rail) {
        rail.style.left = ''
        rail.style.right = ''
      }
      nodesX.current = []
      return
    }
    // The rail runs between the logo key and the quote button.
    const dr = dockRef.current.getBoundingClientRect()
    const lr = logoRef.current.getBoundingClientRect()
    const qr = quoteRef.current.getBoundingClientRect()
    rail.style.left = `${lr.right - dr.left + 10}px`
    rail.style.right = `${dr.right - qr.left + 10}px`
    const ur = ul.getBoundingClientRect()
    const rr = rail.getBoundingClientRect()
    const next = linkRefs.current.map((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left - ur.left, w: r.width }
    })
    setTabs((prev) => (prev.length === next.length && prev.every((p, i) => Math.abs(p.x - next[i].x) < 0.5 && Math.abs(p.w - next[i].w) < 0.5) ? prev : next))
    nodesX.current = linkRefs.current.map((el) => {
      const r = el.getBoundingClientRect()
      return r.left + r.width / 2 - rr.left
    })
    nodesX.current.forEach((x, i) => {
      if (tickRefs.current[i]) tickRefs.current[i].style.left = `${x}px`
    })
  }, [])

  const update = useCallback(() => {
    const { y, max, stops } = readStops()
    let a = -1
    stops.forEach((t, i) => {
      if (y >= t - 4) a = i
    })
    setActive((p) => (p === a ? p : a))
    setCompact(y > 140)

    // Match the section beneath the dock: dark glass over dark sections, light glass elsewhere.
    const probe = (dockRef.current?.getBoundingClientRect().top || 10) + (dockRef.current?.offsetHeight || 60) / 2
    let dark = false
    document.querySelectorAll('[data-nav-dark]').forEach((el) => {
      const r = el.getBoundingClientRect()
      if (r.top <= probe && r.bottom >= probe) dark = true
    })
    setOnDark((p) => (p === dark ? p : dark))

    if (Math.abs(y - lastY.current) > 1) dir.current = y < lastY.current ? -1 : 1
    lastY.current = y

    const xs = nodesX.current
    if (xs.length === nav.length && fillRef.current && truckRef.current) {
      let x
      if (a < 0) x = xs[0] * Math.min(1, y / Math.max(1, stops[0]))
      else if (a >= nav.length - 1) x = xs[xs.length - 1]
      else {
        const t = (y - stops[a]) / Math.max(1, stops[a + 1] - stops[a])
        x = xs[a] + (xs[a + 1] - xs[a]) * Math.min(1, Math.max(0, t))
      }
      fillRef.current.style.width = `${x}px`
      truckRef.current.style.transform = `translateX(${x}px) translateX(-50%) scaleX(${dir.current})`
      tickRefs.current.forEach((t, i) => t?.classList.toggle('is-reached', i <= a))
    }
    if (ringRef.current) ringRef.current.style.strokeDashoffset = `${RING * (1 - Math.min(1, y / max))}`
  }, [])

  useLayoutEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        update()
        ticking = false
      })
    }
    const onResize = () => {
      measure()
      update()
    }
    onResize()
    document.fonts?.ready.then(onResize)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onResize)
    const ro = new ResizeObserver(onResize)
    if (railRef.current) ro.observe(railRef.current)
    if (ulRef.current) ro.observe(ulRef.current)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onResize)
      ro.disconnect()
    }
  }, [measure, update])

  /* Mobile route map: park the truck at the current stop. */
  useLayoutEffect(() => {
    const list = mListRef.current
    if (!list || !mFillRef.current || !mTruckRef.current) return
    const lr = list.getBoundingClientRect()
    const ys = mNodeRefs.current.map((n) => {
      const r = n.getBoundingClientRect()
      return r.top + r.height / 2 - lr.top
    })
    if (!ys.length) return
    const y = active < 0 ? ys[0] - 30 : ys[active]
    mFillRef.current.style.top = `${ys[0]}px`
    mFillRef.current.style.height = `${Math.max(0, y - ys[0])}px`
    mTruckRef.current.style.top = `${y}px`
  }, [active, open])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => e.matches && setOpen(false)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  /* Services preview: Escape closes it and returns focus to the link. */
  useEffect(() => {
    if (!preview) return
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setPreview(false)
      linkRefs.current[0]?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [preview])

  useScrollLock(open)
  useFocusTrap(panelRef, open, { onEscape: () => setOpen(false) })

  const showPreview = (on, delay) => {
    clearTimeout(previewTimer.current)
    previewTimer.current = setTimeout(() => setPreview(on), delay)
  }

  /* Go to a section: scroll to it, then move keyboard focus there. */
  const go = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (!el) return
    const wasOpen = open
    setOpen(false)
    setPreview(false)
    const run = () => {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
      history.replaceState(null, '', href)
    }
    if (wasOpen) requestAnimationFrame(() => requestAnimationFrame(run))
    else run()
  }

  const quote = () => {
    setOpen(false)
    setPreview(false)
    openQuote()
  }

  const activeTab = active >= 0 ? tabs[active] : null
  const hoverTab = hover !== null && hover !== active ? tabs[hover] : null

  return (
    <>
      <header className="dock-header fixed inset-x-0 top-0 z-50">
        <div className="site-x">
          <nav ref={dockRef} aria-label="Main" className={`dock ${compact ? 'is-compact' : ''} ${onDark ? 'on-dark' : ''}`}>
            {/* Logo key */}
            <a ref={logoRef} href="#top" onClick={(e) => go(e, '#top')} className="dock-logo" aria-label="MOVA Logistics, back to top">
              <Logo tone={onDark ? 'light' : 'dark'} />
            </a>

            {/* Section links (desktop) */}
            <div className="hidden min-w-0 flex-1 justify-center lg:flex">
              <ul ref={ulRef} className="relative flex items-center" onMouseLeave={() => setHover(null)}>
                {activeTab && <span className="dock-tab" style={{ width: activeTab.w, transform: `translateX(${activeTab.x}px)` }} aria-hidden="true" />}
                <span className={`dock-glow ${hoverTab ? 'is-on' : ''}`} style={hoverTab ? { width: hoverTab.w, transform: `translateX(${hoverTab.x}px)` } : activeTab ? { width: activeTab.w, transform: `translateX(${activeTab.x}px)` } : undefined} aria-hidden="true" />
                {nav.map((item, i) => {
                  const isServices = item.href === '#services'
                  return (
                    <li
                      key={item.href}
                      ref={isServices ? servicesLi : undefined}
                      className={isServices ? 'relative' : undefined}
                      onMouseEnter={isServices ? () => canHover() && showPreview(true, 140) : undefined}
                      onMouseLeave={isServices ? () => showPreview(false, 180) : undefined}
                      onBlur={isServices ? (e) => !servicesLi.current?.contains(e.relatedTarget) && setPreview(false) : undefined}
                    >
                      <a
                        ref={(el) => (linkRefs.current[i] = el)}
                        href={item.href}
                        onClick={(e) => go(e, item.href)}
                        onMouseEnter={() => setHover(i)}
                        onFocus={isServices ? () => setPreview(true) : undefined}
                        aria-current={i === active ? 'location' : undefined}
                        aria-describedby={isServices ? 'services-preview-hint' : undefined}
                        className={`dock-link ${i === active ? 'is-active' : ''}`}
                      >
                        {item.label}
                        {isServices && <ChevronDown className={`h-4 w-4 text-orange transition-transform duration-300 ${preview ? 'rotate-180' : ''}`} />}
                      </a>

                      {isServices && (
                        <div className={`dock-preview ${preview ? 'is-open' : ''}`} inert={!preview}>
                          <span id="services-preview-hint" className="sr-only">
                            Opens a preview of our four services.
                          </span>
                          <div className="flex items-end justify-between gap-6 px-2 pb-3 pt-1">
                            <div>
                              <p className="eyebrow">Our services</p>
                              <p className="mt-1 text-[1.15rem] font-extrabold tracking-tight text-charcoal">Every route. One trusted partner.</p>
                            </div>
                            <a href="#services" onClick={(e) => go(e, '#services')} className="inline-flex shrink-0 items-center gap-1.5 text-sm font-extrabold text-charcoal hover:text-orange-deep">
                              See all
                              <ArrowRight className="h-4 w-4 text-orange" />
                            </a>
                          </div>
                          <ul className="grid grid-cols-4 gap-2.5">
                            {services.map((s, k) => (
                              <li key={s.id} style={{ transitionDelay: preview ? `${60 + k * 45}ms` : '0ms' }} className="dock-preview-item">
                                <button
                                  type="button"
                                  aria-haspopup="dialog"
                                  onClick={() => {
                                    setPreview(false)
                                    openService(s.id)
                                  }}
                                  className="group block w-full overflow-hidden rounded-xl bg-ivory text-left transition-shadow duration-300 hover:shadow-soft"
                                >
                                  <span className="relative block aspect-[4/3] overflow-hidden">
                                    <Img image={s.detailImage || s.image} sizes="160px" alt="" className="zoom-img h-full w-full object-cover" />
                                    <span className="serif-i absolute left-2.5 top-1.5 text-2xl text-white [text-shadow:0_2px_10px_rgba(0,0,0,.5)]" aria-hidden="true">
                                      {s.no}
                                    </span>
                                  </span>
                                  <span className="flex items-center justify-between gap-1 px-3 py-2.5 text-[0.88rem] font-extrabold text-charcoal">
                                    {s.title}
                                    <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-orange opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>

            {/* Section being read (phones and tablets) */}
            <button type="button" onClick={() => setOpen(true)} className="dock-readout lg:hidden" aria-label={active >= 0 ? `Now viewing ${nav[active].label}. Show all sections` : 'Show all sections'}>
              <span key={active} className="dock-readout-text">
                {active >= 0 ? (
                  <>
                    <span className="serif-i text-orange">0{active + 1}</span> {nav[active].label}
                  </>
                ) : (
                  <span className="text-[0.82rem] tracking-[0.14em] opacity-70 sm:text-[0.9rem] sm:tracking-[0.22em]">ROAD. AIR. SEA.</span>
                )}
              </span>
            </button>

            {/* Get a quote */}
            <button ref={quoteRef} type="button" onClick={quote} className="quote-pill hidden sm:flex">
              <span className="quote-sheen" aria-hidden="true">
                <span />
              </span>
              <span className="relative">Get a quote</span>
              <span className="quote-chip" aria-hidden="true">
                <ArrowUpRight className="quote-arrow is-out h-5 w-5" />
                <ArrowUpRight className="quote-arrow is-in h-5 w-5" />
              </span>
            </button>

            {/* Menu button with a scroll progress ring (phones and tablets) */}
            <button type="button" className="dock-menu lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label="Open menu" onClick={() => setOpen(true)}>
              <svg viewBox="0 0 52 52" className="absolute inset-[3px] h-[calc(100%-6px)] w-[calc(100%-6px)] -rotate-90" aria-hidden="true">
                <circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeOpacity=".14" strokeWidth="3" />
                <circle ref={ringRef} cx="26" cy="26" r="24" fill="none" stroke="#EA6A1F" strokeWidth="3" strokeLinecap="round" strokeDasharray={RING} strokeDashoffset={RING} />
              </svg>
              <Menu className="relative h-5 w-5" />
            </button>

            {/* Route rail along the bottom edge */}
            <div ref={railRef} className="dock-rail" aria-hidden="true">
              <span ref={fillRef} className="dock-rail-fill" />
              {nav.map((n, i) => (
                <span key={n.href} ref={(el) => (tickRefs.current[i] = el)} className="dock-tick" />
              ))}
              <span ref={truckRef} className="dock-truck">
                <TruckMark className="h-auto w-full" />
              </span>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile route map */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-charcoal/45 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          inert={!open}
          className={`absolute inset-y-0 right-0 flex w-full max-w-sm flex-col overflow-y-auto bg-charcoal px-6 pb-8 pt-5 text-white shadow-lift transition-transform duration-[400ms] ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex items-center justify-between">
            <Logo tone="light" />
            <CloseButton tone="dark" label="Close menu" onClick={() => setOpen(false)} />
          </div>
          <p className="mt-9 text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-orange">Your route through MOVA</p>
          <ol ref={mListRef} className="relative mt-4">
            <span className="absolute bottom-6 left-[13px] top-6 w-[2px] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,.3)_0_7px,transparent_7px_13px)]" aria-hidden="true" />
            <span ref={mFillRef} className="absolute left-[13px] w-[2px] rounded bg-orange shadow-[0_0_10px_rgba(234,106,31,.8)] transition-[height] duration-500 ease-out" aria-hidden="true" />
            <span ref={mTruckRef} className="absolute left-[14px] z-10 w-[26px] text-white -translate-x-1/2 -translate-y-1/2 rotate-90 transition-[top] duration-500 ease-out" aria-hidden="true">
              <TruckMark className="h-auto w-full" />
            </span>
            {nav.map((item, i) => (
              <li key={item.href} className={`transition duration-500 ${open ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'}`} style={{ transitionDelay: open ? `${120 + i * 50}ms` : '0ms' }}>
                <a href={item.href} onClick={(e) => go(e, item.href)} aria-current={i === active ? 'location' : undefined} className="group relative flex items-center gap-3 py-3.5 pl-11">
                  <span ref={(el) => (mNodeRefs.current[i] = el)} className={`absolute left-[8px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full transition-colors duration-300 ${i <= active ? 'bg-orange shadow-[0_0_0_2px_#EA6A1F]' : 'bg-charcoal shadow-[0_0_0_2px_rgba(255,255,255,.45)]'}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline gap-2">
                      <span className="serif-i text-lg text-orange" aria-hidden="true">
                        0{i + 1}
                      </span>
                      <span className="text-[1.55rem] font-extrabold leading-tight tracking-tight transition-colors group-hover:text-orange">{item.label}</span>
                    </span>
                    <span className="block text-[0.85rem] text-white/60">{item.desc}</span>
                  </span>
                  {i === active && <span className="shrink-0 rounded-full bg-orange/15 px-2.5 py-1 text-[0.68rem] font-extrabold uppercase tracking-[0.08em] text-orange">You are here</span>}
                </a>
              </li>
            ))}
          </ol>
          <button type="button" onClick={quote} className="group mt-auto flex h-14 shrink-0 items-center justify-between rounded-full bg-orange pl-6 pr-1.5 text-base font-extrabold">
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
