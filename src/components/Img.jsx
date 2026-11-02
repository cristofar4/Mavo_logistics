/*
 * Responsive WebP image with reserved layout space.
 * `image` comes from content/site.js -> images. Files are `/images/<name>-<width>.webp`;
 * `image.widths` lists the exported widths (default 800 and 1600).
 */
export default function Img({ image, sizes = '100vw', priority = false, className = '', alt, ...rest }) {
  const base = `/images/${image.name}`
  const widths = image.widths || [800, 1600]
  const largest = widths[widths.length - 1]
  return (
    <img
      src={`${base}-${largest}.webp`}
      srcSet={widths.length > 1 ? widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ') : undefined}
      sizes={widths.length > 1 ? sizes : undefined}
      width={image.w}
      height={image.h}
      alt={alt ?? image.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      draggable="false"
      {...rest}
    />
  )
}
