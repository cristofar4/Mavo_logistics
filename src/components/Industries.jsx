import { useRef, useState } from 'react'
import { industries } from '../content/site'
import { useReveal } from '../hooks/useReveal'
import Img from './Img'

/*
 * Editorial index: a large image panel on the left crossfades to the industry
 * that is hovered, focused or tapped on the right. On small screens each entry carries its own image.
 */
export default function Industries() {
  const root = useRef(null)
  const [active, setActive] = useState(0)
  useReveal(root)

  return (
    <section id="industries" ref={root} className="section-y relative bg-charcoal text-ivory" aria-labelledby="industries-title">
      <div className="site-x">
        <div className="mb-12 grid gap-6 lg:mb-16 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p data-reveal className="eyebrow mb-4">Industries</p>
            <h2 data-reveal id="industries-title" className="display text-[clamp(2.3rem,4.6vw,4rem)] !text-ivory">
              Built around <em className="accent">your business.</em>
            </h2>
          </div>
          <p data-reveal className="max-w-md text-[1.02rem] leading-relaxed text-ivory/70 lg:col-span-4 lg:col-start-9">
            Logistics for the industries that keep our world moving, shaped around the way each one works.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Image stage (desktop) */}
          <div className="relative hidden lg:col-span-5 lg:block">
            <div data-reveal="img" className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[2rem]">
              {industries.map((ind, i) => (
                <div
                  key={ind.id}
                  className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-out ${i === active ? 'scale-100 opacity-100' : 'scale-[1.04] opacity-0'}`}
                  aria-hidden={i !== active}
                >
                  <Img image={ind.image} sizes="40vw" className="h-full w-full object-cover" />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" aria-hidden="true" />
              <p className="absolute bottom-6 left-7 right-7 font-serif text-3xl italic text-ivory" aria-hidden="true">
                {industries[active].title}
              </p>
            </div>
          </div>

          {/* Index */}
          <ol className="lg:col-span-7">
            {industries.map((ind, i) => {
              const isActive = i === active
              return (
                <li key={ind.id} data-reveal className="border-t border-ivory/15 last:border-b">
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={isActive}
                    className="group grid w-full grid-cols-[auto_1fr] gap-x-5 gap-y-3 py-7 text-left sm:gap-x-8 sm:py-8"
                  >
                    <span className={`font-serif text-3xl italic transition-colors duration-300 sm:text-4xl ${isActive ? 'text-orange' : 'text-ivory/30 group-hover:text-ivory/60'}`}>0{i + 1}</span>
                    <span>
                      <span className="flex items-center justify-between gap-4">
                        <span className={`text-2xl font-medium tracking-tight transition-colors duration-300 sm:text-[1.9rem] ${isActive ? 'text-ivory' : 'text-ivory/75'}`}>{ind.title}</span>
                        <span className={`hidden h-px flex-1 origin-left bg-orange transition-transform duration-500 ease-out sm:block ${isActive ? 'scale-x-100' : 'scale-x-0'}`} aria-hidden="true" />
                      </span>
                      <span className="mt-3 block max-w-lg text-[0.98rem] leading-relaxed text-ivory/65">{ind.body}</span>
                      <span className="mt-4 flex flex-wrap gap-2">
                        {ind.tags.map((t) => (
                          <span key={t} className="rounded-full border border-ivory/15 px-3 py-1 text-xs text-ivory/70">
                            {t}
                          </span>
                        ))}
                      </span>
                    </span>
                    {/* Mobile and tablet image */}
                    <span className="col-span-2 mt-3 block aspect-[16/10] overflow-hidden rounded-2xl lg:hidden">
                      <Img image={ind.image} sizes="100vw" alt={ind.image.alt} className="h-full w-full object-cover" />
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
