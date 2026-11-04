import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useScrollLock } from '../hooks/useScrollLock'
import { Close } from './Icons'

/*
 * Accessible dialog: portal, focus trap, Escape and backdrop close,
 * scroll lock, focus restore and a 300ms enter/exit transition.
 */
export default function Modal({ open, onClose, title, eyebrow, children, size = 'md', labelledBy, bare = false }) {
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)
  const panelRef = useRef(null)
  const autoId = useId()
  const titleId = labelledBy || `${autoId}-title`

  useEffect(() => {
    if (open) {
      setMounted(true)
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      return () => cancelAnimationFrame(r)
    }
    setVisible(false)
    const t = setTimeout(() => setMounted(false), 320)
    return () => clearTimeout(t)
  }, [open])

  useScrollLock(mounted)
  useFocusTrap(panelRef, open && mounted, { onEscape: onClose })

  if (!mounted) return null

  const widths = { sm: 'max-w-lg', md: 'max-w-2xl', lg: 'max-w-4xl', xl: 'max-w-[68rem]' }

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6" data-state={visible ? 'open' : 'closed'}>
      <div
        className={`absolute inset-0 bg-charcoal/45 backdrop-blur-[6px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative flex max-h-[92dvh] w-full ${widths[size]} flex-col overflow-hidden rounded-t-[1.75rem] bg-ivory shadow-lift outline-none transition duration-300 ease-out sm:rounded-[1.75rem] ${
          visible ? 'translate-y-0 opacity-100 sm:scale-100' : 'translate-y-8 opacity-0 sm:scale-[.98]'
        }`}
      >
        {!bare && (
          <div className="flex items-start justify-between gap-4 border-b border-charcoal/10 px-6 py-5 sm:px-8">
            <div>
              {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
              <h2 id={titleId} className="text-2xl font-extrabold tracking-[-0.03em] text-charcoal sm:text-[1.7rem]">
                {title}
              </h2>
            </div>
            <button type="button" onClick={onClose} className="icon-btn -mr-2 shrink-0" aria-label="Close dialog">
              <Close />
            </button>
          </div>
        )}
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
