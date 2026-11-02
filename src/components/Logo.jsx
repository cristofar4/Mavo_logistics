export function LogoMark({ className = 'h-8 w-auto' }) {
  return (
    <svg viewBox="0 0 48 36" className={className} aria-hidden="true" focusable="false">
      <path d="M0 36V4.5C0 2 2 0 4.5 0h4.8c1.4 0 2.7.7 3.6 1.8L24 16.4 18.2 24 9.6 12.4V36z" fill="#D96936" />
      <path d="M48 36V4.5C48 2 46 0 43.5 0h-4.8c-1.4 0-2.7.7-3.6 1.8L17.6 25.3l5.2 6.9 15.6-19.8V36z" fill="currentColor" />
    </svg>
  )
}

export default function Logo({ tone = 'dark', className = '' }) {
  const text = tone === 'light' ? 'text-ivory' : 'text-charcoal'
  return (
    <span className={`inline-flex items-center gap-2.5 ${text} ${className}`}>
      <LogoMark className="h-7 w-auto sm:h-8" />
      <span className="flex flex-col leading-none">
        <span className="text-[1.3rem] font-semibold tracking-[0.04em] sm:text-[1.4rem]">MOVA</span>
        <span className="mt-1 text-[0.56rem] font-medium uppercase tracking-[0.42em] opacity-80">Logistics</span>
      </span>
    </span>
  )
}
