import { isDemoMode } from '../lib/submitEnquiry'

export default function DemoNotice({ className = '' }) {
  if (!isDemoMode) return null
  return (
    <div role="note" className={`flex gap-3 rounded-2xl border border-orange/30 bg-orange-soft/60 px-4 py-3 text-sm text-charcoal ${className}`}>
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange" aria-hidden="true" />
      <p>
        <strong className="font-semibold">Demonstration form.</strong> No form service is connected yet, so nothing you enter
        here will be sent. Your details are not stored.
      </p>
    </div>
  )
}
