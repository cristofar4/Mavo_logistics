/*
 * Submission adapter for the quote and partnership forms.
 *
 * Set VITE_FORM_ENDPOINT in a .env file to post enquiries as JSON to a real service
 * (Formspree, Basin, Getform, a serverless function or your own API).
 * Without an endpoint the forms run in demonstration mode and nothing is sent.
 */
const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT || ''

export const isDemoMode = !ENDPOINT

export async function submitEnquiry(kind, data) {
  if (!ENDPOINT) {
    await new Promise((r) => setTimeout(r, 700))
    return { status: 'demo' }
  }
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ kind, submittedAt: new Date().toISOString(), ...data }),
  })
  if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
  return { status: 'sent' }
}
