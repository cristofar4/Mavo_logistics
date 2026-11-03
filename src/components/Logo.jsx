/*
 * MOVA wordmark as in the design: bold "MOV" and a crossbarless "Λ" whose right leg is orange,
 * with LOGISTICS letterspaced underneath.
 */
export function LogoA({ className = 'h-[0.74em] w-auto' }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <path d="M6 100 L41 4 H59 L24 100 Z" fill="currentColor" />
      <path d="M41 4 H59 L94 100 H76 Z" fill="#EA6A1F" />
    </svg>
  )
}

/* Compact M mark (contract cover, seal). */
export function LogoMark({ className = 'h-8 w-auto' }) {
  return (
    <svg viewBox="0 0 100 84" className={className} aria-hidden="true" focusable="false">
      <path d="M0 84 V0 H20 L50 44 L80 0 H100 V84 H80 V34 L56 70 H44 L20 34 V84 Z" fill="currentColor" />
      <path d="M80 0 H100 V18 Z" fill="#EA6A1F" />
    </svg>
  )
}

export default function Logo({ tone = 'dark', size = 'md', className = '' }) {
  const text = tone === 'light' ? 'text-white' : 'text-charcoal'
  const big = size === 'lg'
  return (
    <span className={`inline-flex flex-col items-center leading-none transition-colors duration-500 ${text} ${className}`}>
      <span className={`flex items-end font-extrabold tracking-[0.01em] ${big ? 'text-[2.6rem]' : 'text-[1.55rem] sm:text-[1.7rem]'}`}>
        MOV
        <LogoA className={`${big ? 'mb-[0.16em] ml-[0.04em] h-[0.72em]' : 'mb-[0.15em] ml-[0.03em] h-[0.72em]'} w-auto`} />
      </span>
      <span className={`font-semibold uppercase ${big ? 'mt-1 text-[0.72rem] tracking-[0.62em]' : 'mt-[3px] text-[0.5rem] tracking-[0.58em] sm:text-[0.54rem]'} pl-[0.5em] opacity-90`}>
        Logistics
      </span>
    </span>
  )
}
