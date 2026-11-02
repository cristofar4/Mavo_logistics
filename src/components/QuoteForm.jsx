import { useId } from 'react'
import EnquiryFields from './EnquiryFields'
import DemoNotice from './DemoNotice'
import { useEnquiryForm } from '../hooks/useEnquiryForm'
import { ArrowRight } from './Icons'

export default function QuoteForm({ initialService = '', onDone }) {
  const idPrefix = `quote${useId().replace(/:/g, '')}`
  const form = useEnquiryForm({ kind: 'quote', idPrefix, initial: { service: initialService } })
  const { status } = form

  const onSubmit = async (e) => {
    e.preventDefault()
    await form.submit()
  }

  if (status === 'demo' || status === 'sent') {
    return (
      <div className="px-6 py-10 sm:px-8" role="status" aria-live="polite">
        {status === 'sent' ? (
          <>
            <p className="eyebrow mb-3">Request received</p>
            <h3 className="text-3xl font-extrabold tracking-[-0.03em] text-charcoal">Thank you.</h3>
            <p className="mt-3 max-w-md text-charcoal-muted">Your quote request has been sent. Our team will review the details and get back to you.</p>
          </>
        ) : (
          <>
            <p className="eyebrow mb-3">Demo complete</p>
            <h3 className="text-3xl font-extrabold tracking-[-0.03em] text-charcoal">Your form passed every check.</h3>
            <p className="mt-3 max-w-md text-charcoal-muted">
              Because no form service is connected yet, this request was <strong className="font-semibold text-charcoal">not sent</strong>.
              Connect an endpoint with VITE_FORM_ENDPOINT to receive real enquiries.
            </p>
          </>
        )}
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={onDone}>
            Close
          </button>
          <button type="button" className="btn-ghost" onClick={form.reset}>
            Start a new request
          </button>
        </div>
      </div>
    )
  }

  return (
    <form noValidate onSubmit={onSubmit} className="px-6 py-6 sm:px-8 sm:py-7" aria-describedby={`${idPrefix}-intro`}>
      <p id={`${idPrefix}-intro`} className="mb-5 text-[0.95rem] text-charcoal-muted">
        Share a few details and we will recommend the right way to move your cargo. Fields marked Optional can be left blank.
      </p>
      <DemoNotice className="mb-6" />
      <EnquiryFields idPrefix={idPrefix} {...form} />
      <div aria-live="polite" className="mt-5 min-h-[1.25rem] text-sm">
        {form.touched.__all && form.errorCount > 0 && (
          <p className="text-orange-deep">
            Please check {form.errorCount === 1 ? 'one field' : `${form.errorCount} fields`} highlighted above.
          </p>
        )}
        {status === 'error' && <p className="text-orange-deep">We could not send your request. Please try again in a moment. ({form.errorMessage})</p>}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-charcoal/10 pt-5">
        <p className="max-w-xs text-xs text-charcoal-muted">A quote request is not a booking. We will confirm plans and prices with you first.</p>
        <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Checking details' : 'Request my quote'}
          <ArrowRight />
        </button>
      </div>
    </form>
  )
}
