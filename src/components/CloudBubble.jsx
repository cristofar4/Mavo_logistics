import { forwardRef } from 'react'

/*
 * Cloud shaped speech bubble with a pointed tail toward the speaker on its lower left, as in the design.
 * The SVG stretches behind the HTML content. [data-cloud] and [data-tail] are animated by the scene.
 */
const CloudBubble = forwardRef(function CloudBubble({ children, className = '', style }, ref) {
  return (
    <div ref={ref} className={`cloud-bubble ${className}`} style={style}>
      <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 360 240" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path data-tail d="M74 150 C 52 176, 26 196, 0 206 C 44 206, 86 192, 116 168 Z" fill="#FFFFFF" />
        <g data-cloud fill="#FFFFFF">
          <ellipse cx="186" cy="118" rx="146" ry="74" />
          <circle cx="92" cy="92" r="56" />
          <circle cx="158" cy="62" r="56" />
          <circle cx="232" cy="58" r="58" />
          <circle cx="296" cy="96" r="52" />
          <circle cx="306" cy="146" r="44" />
          <circle cx="238" cy="178" r="46" />
          <circle cx="158" cy="182" r="46" />
          <circle cx="86" cy="150" r="44" />
        </g>
      </svg>
      <div data-cloud-content className="relative flex h-full min-h-[7.5rem] flex-col items-center justify-center px-[15%] pb-[17%] pt-[13%] text-center">
        {children}
      </div>
    </div>
  )
})

export default CloudBubble
