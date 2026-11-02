const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
}

export const ArrowRight = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 12h15M13 6l6 6-6 6" /></svg>
)
export const Close = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const Menu = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 8h16M4 16h16" /></svg>
)
export const Plus = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 5v14M5 12h14" /></svg>
)
export const Check = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)
export const Pin = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
)
export const Truck = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M2 6.5h11v9H2zM13 9.5h4.5l3.5 3.5v2.5h-8" /><circle cx="6" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>
)
export const Globe = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" /></svg>
)
export const Doc = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 15.5h5" /></svg>
)
export const Route = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="6" cy="18" r="2" /><path d="M8 18h6.5a3.5 3.5 0 0 0 0-7h-5a3.5 3.5 0 0 1 0-7H16" /><path d="M18 2.5 19.5 4 18 5.5" /></svg>
)
export const Box = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" /><path d="M4 7.5l8 4.5 8-4.5M12 12v9" /></svg>
)
export const Mail = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3.5 6.5 12 13l8.5-6.5" /></svg>
)
export const Phone = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 4h3.5l1.5 4.5-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4z" /></svg>
)
export const MapPinLine = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 17s5-4.4 5-8.2A5 5 0 0 0 7 8.8C7 12.6 12 17 12 17z" /><circle cx="12" cy="8.8" r="1.8" /><path d="M5 21h14" /></svg>
)
export const Clock = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)
export const Pen = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z" /><path d="M14.5 6.5l3 3" /></svg>
)
export const Social = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" /></svg>
)
