import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const UIContext = createContext(null)

/* Central place to open dialogs from anywhere on the page. */
export function UIProvider({ children }) {
  const [dialog, setDialog] = useState(null) // { type: 'quote'|'service'|'legal', payload }

  const openQuote = useCallback((service = '') => setDialog({ type: 'quote', payload: { service } }), [])
  const openService = useCallback((id) => setDialog({ type: 'service', payload: { id } }), [])
  const openLegal = useCallback((kind) => setDialog({ type: 'legal', payload: { kind } }), [])
  const close = useCallback(() => setDialog((d) => (d ? { ...d, closing: true } : null)), [])

  const value = useMemo(
    () => ({ dialog, openQuote, openService, openLegal, close, setDialog }),
    [dialog, openQuote, openService, openLegal, close],
  )
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used inside UIProvider')
  return ctx
}
