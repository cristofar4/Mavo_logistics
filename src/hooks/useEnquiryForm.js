import { useCallback, useState } from 'react'
import { emptyEnquiry, fieldOrder, validateEnquiry } from '../lib/validate'
import { submitEnquiry } from '../lib/submitEnquiry'

/*
 * Form state, validation and submission shared by the quote dialog and the partnership book.
 * status: 'idle' | 'submitting' | 'demo' | 'sent' | 'error'
 */
export function useEnquiryForm({ kind, idPrefix, initial = {}, extraValidate }) {
  const [values, setValues] = useState({ ...emptyEnquiry, ...initial })
  const [touched, setTouched] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const errors = validateEnquiry(values)

  const onChange = useCallback((name, value) => setValues((v) => ({ ...v, [name]: value })), [])
  const onBlur = useCallback((name) => setTouched((t) => ({ ...t, [name]: true })), [])

  const reset = useCallback(() => {
    setValues({ ...emptyEnquiry, ...initial })
    setTouched({})
    setStatus('idle')
    setErrorMessage('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* Mark every field as touched and focus the first problem. Returns true when everything is valid. */
  const validateAll = useCallback(
    (extraErrors = {}) => {
      setTouched({ __all: true })
      const all = { ...errors, ...extraErrors }
      const firstKey = [...fieldOrder, ...Object.keys(extraErrors)].find((k) => all[k])
      if (!firstKey) return true
      const el = document.getElementById(`${idPrefix}-${firstKey}`)
      if (el) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' })
        el.focus({ preventScroll: true })
      }
      return false
    },
    [errors, idPrefix],
  )

  /* Hidden honeypot field: people never fill it, spam bots usually do. */
  const honeypot = useCallback(() => document.getElementById(`${idPrefix}-hp`)?.value || '', [idPrefix])

  const submit = useCallback(
    async (extra = {}) => {
      if (!validateAll(extraValidate ? extraValidate() : {})) return null
      setStatus('submitting')
      setErrorMessage('')
      try {
        const res = await submitEnquiry(kind, { ...values, ...extra, honey: honeypot() })
        setStatus(res.status)
        return res.status
      } catch (err) {
        setStatus('error')
        setErrorMessage(err?.message || 'Something went wrong.')
        return 'error'
      }
    },
    [extraValidate, honeypot, kind, validateAll, values],
  )

  const errorCount = Object.keys(errors).length
  return { values, setValues, errors, touched, status, setStatus, errorMessage, errorCount, onChange, onBlur, submit, reset, validateAll, honeypot }
}
