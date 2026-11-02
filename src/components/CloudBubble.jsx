import { forwardRef } from 'react'

/*
 * Cloud shaped speech bubble. The SVG cloud stretches behind the HTML content,
 * the trailing puffs point down and to the left, toward the speaker's head.
 */
const CloudBubble = forwardRef(function CloudBubble({ children, className = '', style }, ref) {
  return (
    <div ref={ref} className={`cloud-bubble ${className}`} style={style}>
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 360 250" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <g data-cloud className="cloud-shape" fill="#FFFDF8">
          <ellipse cx="185" cy="108" rx="150" ry="74" />
          <circle cx="88" cy="82" r="54" />
          <circle cx="152" cy="54" r="52" />
          <circle cx="224" cy="50" r="54" />
          <circle cx="290" cy="82" r="50" />
          <circle cx="310" cy="130" r="42" />
          <circle cx="240" cy="164" r="44" />
          <circle cx="160" cy="170" r="44" />
          <circle cx="80" cy="140" r="46" />
        </g>
        <g fill="#FFFDF8" className="cloud-tail">
          <circle data-puff cx="56" cy="206" r="13" />
          <circle data-puff cx="30" cy="232" r="8" />
          <circle data-puff cx="12" cy="252" r="5" />
        </g>
      </svg>
      <div data-cloud-content className="relative flex h-full flex-col items-center justify-center px-[14%] pb-[24%] pt-[11%] text-center">{children}</div>
    </div>
  )
})

export default CloudBubble
