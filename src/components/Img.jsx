/*
 * Responsive WebP image with reserved layout space.
 * `image` comes from content/site.js -> images.
 */
export default function Img({ image, sizes = '100vw', priority = false, className = '', alt, ...rest }) {
  const base = `/images/${image.name}`
  return (
    <img
      src={`${base}-1600.webp`}
      srcSet={`${base}-800.webp 800w, ${base}-1600.webp 1600w`}
      sizes={sizes}
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
