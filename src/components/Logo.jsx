export function LogoMark({ className = 'h-8 w-auto' }) {
  return (
    <svg viewBox="0 0 52 40" className={className} aria-hidden="true" focusable="false">
      <path d="M0 40V5.2C0 2.3 2.3 0 5.2 0h6.4c1.6 0 3.1.8 4.1 2.1L26 16.8l-6.6 9L10.6 13.6V40z" fill="#D96936" />
      <path d="M52 40V5.2C52 2.3 49.7 0 46.8 0h-6.4c-1.6 0-3.1.8-4.1 2.1L19 27.4l6 7.9L41.4 13.6V40z" fill="currentColor" />
    </svg>
  )
}

export default function Logo({ tone = 'dark', className = '' }) {
  const text = tone === 'light' ? 'text-ivory' : 'text-charcoal'
  return (
    <span className={`inline-flex items-center gap-2.5 ${text} ${className}`}>
      <LogoMark className="h-8 w-auto sm:h-9" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.45rem] font-extrabold tracking-[0.02em] sm:text-[1.6rem]">MOVA</span>
        <span className="mt-[3px] text-[0.55rem] font-semibold uppercase tracking-[0.46em] opacity-80">Logistics</span>
      </span>
    </span>
  )
}
