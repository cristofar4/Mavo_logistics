import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

/*
 * Pointer based signature canvas (mouse, pen and touch).
 * Exposes: isEmpty(), clear(), toDataURL().
 * A typed signature alternative is rendered by the parent for keyboard users.
 */
const SignaturePad = forwardRef(function SignaturePad({ onChange, invalid, describedBy, id }, ref) {
  const canvasRef = useRef(null)
  const drawing = useRef(false)
  const last = useRef(null)
  const strokes = useRef(0)
  const [empty, setEmpty] = useState(true)

  const setup = useCallback(() => {
    const c = canvasRef.current
    if (!c) return
    // Layout size, unaffected by the book's CSS transforms while it animates.
    const r = { width: c.offsetWidth, height: c.offsetHeight }
    if (!r.width) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const prev = strokes.current ? c.toDataURL() : null
    c.width = Math.round(r.width * dpr)
    c.height = Math.round(r.height * dpr)
    const ctx = c.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#1c2a4a'
    if (prev) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, r.width, r.height)
      img.src = prev
    }
  }, [])

  useEffect(() => {
    setup()
    const ro = new ResizeObserver(setup)
    if (canvasRef.current) ro.observe(canvasRef.current)
    return () => ro.disconnect()
  }, [setup])

  const point = (e) => {
    const c = canvasRef.current
    const r = c.getBoundingClientRect()
    const sx = c.offsetWidth / r.width || 1
    const sy = c.offsetHeight / r.height || 1
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy, p: e.pressure || 0.5 }
  }

  const down = (e) => {
    e.preventDefault()
    canvasRef.current.setPointerCapture(e.pointerId)
    drawing.current = true
    last.current = point(e)
  }
  const move = (e) => {
    if (!drawing.current) return
    const ctx = canvasRef.current.getContext('2d')
    const p = point(e)
    const l = last.current
    const dist = Math.hypot(p.x - l.x, p.y - l.y)
    ctx.lineWidth = Math.max(1.4, Math.min(3.2, 3.4 - dist * 0.08)) * (0.75 + p.p * 0.5)
    ctx.beginPath()
    ctx.moveTo(l.x, l.y)
    ctx.quadraticCurveTo(l.x, l.y, (l.x + p.x) / 2, (l.y + p.y) / 2)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    last.current = p
    if (empty) {
      setEmpty(false)
      onChange?.(false)
    }
  }
  const up = () => {
    if (drawing.current) strokes.current++
    drawing.current = false
  }

  const clear = useCallback(() => {
    const c = canvasRef.current
    c.getContext('2d').clearRect(0, 0, c.width, c.height)
    strokes.current = 0
    setEmpty(true)
    onChange?.(true)
  }, [onChange])

  useImperativeHandle(ref, () => ({
    isEmpty: () => empty,
    clear,
    toDataURL: () => canvasRef.current.toDataURL('image/png'),
  }))

  return (
    <div className={`relative rounded-xl border bg-white/70 ${invalid ? 'border-orange-deep' : 'border-charcoal/15'}`}>
      <canvas
        id={id}
        ref={canvasRef}
        className="block h-32 w-full touch-none cursor-crosshair rounded-xl"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
        role="img"
        aria-label={empty ? 'Signature area, empty. Draw your signature or type it below.' : 'Signature area, signed.'}
        aria-describedby={describedBy}
      />
      <span className="pointer-events-none absolute bottom-6 left-5 right-5 border-b border-dashed border-charcoal/25" aria-hidden="true" />
      <span className="pointer-events-none absolute bottom-2 left-5 text-[0.65rem] uppercase tracking-[0.25em] text-charcoal/40" aria-hidden="true">
        {empty ? 'Sign here' : 'Signed'}
      </span>
      {!empty && (
        <button type="button" onClick={clear} className="absolute right-2 top-2 rounded-full bg-ivory px-3 py-1.5 text-xs font-medium text-charcoal shadow-soft hover:text-orange">
          Clear
        </button>
      )}
    </div>
  )
})

export default SignaturePad
