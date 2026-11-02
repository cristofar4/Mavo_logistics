import { useEffect } from 'react'

const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'

/*
 * Keeps keyboard focus inside `ref` while active, closes on Escape
 * and returns focus to the previously focused element on deactivate.
 */
export function useFocusTrap(ref, active, { onEscape, initialFocus } = {}) {
  useEffect(() => {
    if (!active || !ref.current) return
    const root = ref.current
    const previous = document.activeElement

    const focusFirst = () => {
      const target =
        (initialFocus && initialFocus.current) ||
        root.querySelector('[data-autofocus]') ||
        root.querySelector(FOCUSABLE) ||
        root
      target.focus({ preventScroll: true })
    }
    const raf = requestAnimationFrame(focusFirst)

    const onKey = (e) => {
      if (e.key === 'Escape' && onEscape) {
        e.stopPropagation()
        onEscape()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...root.querySelectorAll(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      )
      if (!items.length) {
        e.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('keydown', onKey, true)
      if (previous && typeof previous.focus === 'function') previous.focus({ preventScroll: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
