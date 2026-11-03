import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { nav } from '../content/site'
import { useUI } from '../context/UIContext'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useScrollLock } from '../hooks/useScrollLock'
import { prefersReducedMotion } from '../lib/gsap'
import Logo from './Logo'
import { ArrowUpRight, Close, Menu } from './Icons'

/*
 * Route navigation.
 *
 * The page is a delivery route and every section is a numbered stop, in page order.
 * A small MOVA truck drives along the road under the stops as the visitor scrolls,
 * turns around when they scroll back up, and the road behind it lights up orange.
 * Tapping a stop scrolls to that section, so the truck drives there.
 * On phones the menu button carries a progress ring and opens a vertical route map.
 */

const RING = 2 * Math.PI * 24

function TruckMark({ className = '' }) {
  return (
    <svg viewBox="0 0 30 17" className={className} aria-hidden="true" focusable="false">
      <rect x="1" y="2" width="17.5" height="10.5" rx="1.8" fill="#FFFFFF" />
      <rect x="3.6" y="5.2" width="9" height="1.5" rx=".75" fill="#EA6A1F" />
      <path d="M19.4 5h5.2l3.9 4.1v3.4h-9.1z" fill="#EA6A1F" />
      <path d="M21.2 6.5h2.8l2.1 2.3h-4.9z" fill="#1B2121" opacity=".6" />
      <circle cx="6.2" cy="13.6" r="2.5" fill="#1B2121" stroke="#FFFFFF" strokeWidth="1.3" />
      <circle cx="23.8" cy="13.6" r="2.5" fill="#1B2121" stroke="#FFFFFF" strokeWidth="1.3" />
    </svg>
  )
}

/* Scroll positions at which each stop is reached: the section top, less the scroll padding. */
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
  const { openQuote } = useUI()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const panelRef = useRef(null)
  // desktop route
  const trackRef = useRef(null)
  const nodeRefs = useRef([])
  const fillRef = useRef(null)
  const truckRef = useRef(null)
  const nodesX = useRef([])
  const dir = useRef(1)
  const lastY = useRef(0)
  // mobile
  const ringRef = useRef(null)
  const mListRef = useRef(null)
  const mNodeRefs = useRef([])
  const mFillRef = useRef(null)
  const mTruckRef = useRef(null)

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track || !track.offsetWidth) {
      nodesX.current = []
      return
    }
    const tr = track.getBoundingClientRect()
    nodesX.current = nodeRefs.current.map((n) => {
      const r = n.getBoundingClientRect()
      return r.left + r.width / 2 - tr.left
    })
  }, [])

  const update = useCallback(() => {
    const { y, max, stops } = readStops()
    let a = -1
    stops.forEach((t, i) => {
      if (y >= t - 4) a = i
    })
    setActive((p) => (p === a ? p : a))
    setScrolled(y > 24)

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
    if (trackRef.current) ro.observe(trackRef.current)
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

  useScrollLock(open)
  useFocusTrap(panelRef, open, { onEscape: () => setOpen(false) })

  /* Go to a stop: scroll to its section, then move keyboard focus there. */
  const go = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (!el) return
    const wasOpen = open
    setOpen(false)
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
    openQuote()
  }

  const state = (i) => (i < active ? 'is-passed' : i === active ? 'is-active' : 'is-next')

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className={`absolute inset-x-0 top-0 h-[5.25rem] transition-[background-color,box-shadow,backdrop-filter] duration-500 lg:h-[5.6rem] ${scrolled ? 'bg-ivory/80 shadow-[0_10px_30px_-22px_rgba(27,33,33,.45)] backdrop-blur-xl' : 'bg-transparent'}`} aria-hidden="true" />
        <nav aria-label="Main" className="site-x relative flex h-[5.25rem] items-center gap-3 lg:h-[5.6rem] lg:gap-4">
          {/* Logo tab: the depot the route starts from */}
          <a href="#top" onClick={(e) => go(e, '#top')} className="slant slant-shadow flex h-[52px] shrink-0 items-center pl-5 pr-10 lg:h-[60px] lg:pl-7 lg:pr-12" style={{ '--r': '14px', '--tip': '22px' }} aria-label="MOVA Logistics, back to top">
            <Logo />
          </a>

          {/* Route bar */}
          <div className="route-bar relative hidden h-[64px] flex-1 lg:block">
            <ol className="relative z-10 flex h-full items-stretch justify-between px-7 xl:px-9">
              {nav.map((item, i) => (
                <li key={item.href} className="flex">
                  <a href={item.href} onClick={(e) => go(e, item.href)} aria-current={i === active ? 'location' : undefined} className={`route-stop ${state(i)}`}>
                    <span className="route-label">
                      <span className="route-no" aria-hidden="true">
                        0{i + 1}
                      </span>
                      {item.label}
                    </span>
                    <span ref={(el) => (nodeRefs.current[i] = el)} className="route-node" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ol>
            <div ref={trackRef} className="route-track" aria-hidden="true">
              <span ref={fillRef} className="route-fill" />
              <span ref={truckRef} className="route-truck">
                <TruckMark className="h-auto w-full" />
              </span>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            {/* Destination: Get a quote */}
            <button type="button" onClick={quote} className="group hidden h-[60px] items-center gap-4 rounded-full bg-orange pl-7 pr-2 text-[1.08rem] font-extrabold text-white shadow-[0_12px_26px_-14px_rgba(234,106,31,.95)] transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-orange-deep sm:flex">
              Get a quote
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-charcoal transition-transform duration-500 ease-out group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5" />
              </span>
            </button>
            {/* Mobile: menu button with a scroll progress ring */}
            <button type="button" className="relative flex h-[54px] w-[54px] items-center justify-center rounded-full bg-charcoal text-white lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label="Open menu" onClick={() => setOpen(true)}>
              <svg viewBox="0 0 52 52" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2.5" />
                <circle ref={ringRef} cx="26" cy="26" r="24" fill="none" stroke="#EA6A1F" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={RING} strokeDashoffset={RING} />
              </svg>
              <Menu className="relative h-6 w-6" />
            </button>
          </div>
        </nav>
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
            <button type="button" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-orange" aria-label="Close menu" onClick={() => setOpen(false)}>
              <Close className="h-6 w-6" />
            </button>
          </div>
          <p className="mt-9 text-[0.72rem] font-extrabold uppercase tracking-[0.22em] text-orange">Your route through MOVA</p>
          <ol ref={mListRef} className="relative mt-4">
            <span className="absolute bottom-6 left-[13px] top-6 w-[2px] bg-[repeating-linear-gradient(180deg,rgba(255,255,255,.3)_0_7px,transparent_7px_13px)]" aria-hidden="true" />
            <span ref={mFillRef} className="absolute left-[13px] w-[2px] rounded bg-orange shadow-[0_0_10px_rgba(234,106,31,.8)] transition-[height] duration-500 ease-out" aria-hidden="true" />
            <span ref={mTruckRef} className="absolute left-[14px] z-10 w-[26px] -translate-x-1/2 -translate-y-1/2 rotate-90 transition-[top] duration-500 ease-out" aria-hidden="true">
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
