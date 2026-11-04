/*
 * Delivery for the quote and partnership forms.
 *
 * By default enquiries are emailed through FormSubmit (formsubmit.co): free, no account and no
 * server needed. The address (or the private alias FormSubmit gives you after activation) lives in
 * src/content/site.js -> forms.formsubmit, or can be set with VITE_FORMSUBMIT_TARGET.
 *
 * To use your own backend instead, set VITE_FORM_ENDPOINT: enquiries are then posted to it as JSON.
 * With neither configured the forms fall back to a clearly labelled demonstration mode.
 */
import { forms, serviceOptions } from '../content/site'

const CUSTOM = import.meta.env.VITE_FORM_ENDPOINT || ''
const TARGET = import.meta.env.VITE_FORMSUBMIT_TARGET || forms.formsubmit || ''

const ENDPOINT = CUSTOM || (TARGET ? `https://formsubmit.co/ajax/${encodeURIComponent(TARGET)}` : '')
export const isDemoMode = !ENDPOINT
const usesFormSubmit = !CUSTOM && !!TARGET

const serviceLabel = (v) => serviceOptions.find((o) => o.value === v)?.label || 'Not chosen'

/* A readable email: FormSubmit lays these fields out as a table. */
function emailPayload(kind, d) {
  const isQuote = kind === 'quote'
  const fields = {
    _subject: `${isQuote ? 'New quote request' : 'New partnership enquiry'} from ${d.name}${d.company ? ` (${d.company})` : ''}`,
    _template: 'table',
    _captcha: 'false',
    _honey: d.honey || '',
    _replyto: d.email,
    'Enquiry type': isQuote ? 'Quote request' : 'Partnership enquiry, signed in the contract book',
    'Full name': d.name,
    Company: d.company || 'Not given',
    email: d.email,
    Phone: d.phone || 'Not given',
    'Service required': serviceLabel(d.service),
    'Pickup location': d.pickup,
    Destination: d.destination,
    'Cargo details': d.cargo,
    'Preferred date': d.date || 'Flexible',
  }
  if (!isQuote) {
    fields.Signature = d.signatureTyped ? `Typed name: ${d.signatureTyped}` : 'Drawn on the signature pad'
    fields.Confirmation = 'Understands this is a partnership enquiry and not a binding contract'
  }
  fields['Sent from'] = window.location.href
  fields['Sent at'] = new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })
  return fields
}

export async function submitEnquiry(kind, data) {
  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 700))
    return { status: 'demo' }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 20000)
  let res
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(usesFormSubmit ? emailPayload(kind, data) : { kind, submittedAt: new Date().toISOString(), ...data }),
      signal: controller.signal,
    })
  } catch (err) {
    throw new Error(err?.name === 'AbortError' ? 'The connection timed out.' : 'Please check your internet connection.')
  } finally {
    clearTimeout(timer)
  }

  if (!usesFormSubmit) {
    if (!res.ok) throw new Error(`The server answered with status ${res.status}.`)
    return { status: 'sent' }
  }

  let body = null
  try {
    body = await res.json()
  } catch {
    body = null
  }
  if (res.ok && body && String(body.success) === 'true') return { status: 'sent' }
  const message = body?.message || `The form service answered with status ${res.status}.`
  if (/activat/i.test(message)) throw new Error('This form is waiting to be activated by the site owner, so it could not be delivered yet.')
  throw new Error(message)
}
