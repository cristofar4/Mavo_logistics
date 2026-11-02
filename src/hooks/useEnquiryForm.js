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

  const submit = useCallback(
    async (extra = {}) => {
      setTouched({ __all: true })
      const extraErrors = extraValidate ? extraValidate() : {}
      const all = { ...errors, ...extraErrors }
      const firstKey = [...fieldOrder, ...Object.keys(extraErrors)].find((k) => all[k])
      if (firstKey) {
        const el = document.getElementById(`${idPrefix}-${firstKey}`)
        if (el) {
          el.scrollIntoView({ block: 'center', behavior: 'smooth' })
          el.focus({ preventScroll: true })
        }
        return null
      }
      setStatus('submitting')
      setErrorMessage('')
      try {
        const res = await submitEnquiry(kind, { ...values, ...extra })
        setStatus(res.status)
        return res.status
      } catch (err) {
        setStatus('error')
        setErrorMessage(err?.message || 'Something went wrong.')
        return 'error'
      }
    },
    [errors, extraValidate, idPrefix, kind, values],
  )

  const errorCount = Object.keys(errors).length
  return { values, setValues, errors, touched, status, setStatus, errorMessage, errorCount, onChange, onBlur, submit, reset }
}
