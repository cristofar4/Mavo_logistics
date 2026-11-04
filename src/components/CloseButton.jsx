/*
 * Close button used by every dialog, the contract book and the mobile menu.
 * A round frosted button; on hover or keyboard focus the X turns and the button opens into a
 * "Close" pill with an Esc hint on devices that have a keyboard.
 *   tone="light"  for light surfaces (default)
 *   tone="dark"   for dark surfaces
 */
export default function CloseButton({ onClick, label = 'Close', tone = 'light', className = '' }) {
  return (
    <button type="button" onClick={onClick} aria-label={label} title="Close (Esc)" className={`close-btn ${tone === 'dark' ? 'is-dark' : ''} ${className}`}>
      <span className="close-btn-text" aria-hidden="true">
        Close
        <kbd className="close-btn-kbd">Esc</kbd>
      </span>
      <span className="close-btn-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="h-[18px] w-[18px]">
          <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
        </svg>
      </span>
    </button>
  )
}
