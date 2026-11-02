import { useRef } from 'react'
import { about, images } from '../content/site'
import { useReveal } from '../hooks/useReveal'
import Img from './Img'

export default function About() {
  const root = useRef(null)
  useReveal(root)

  return (
    <section id="about" ref={root} className="relative bg-ivory-soft py-14 sm:py-16 lg:py-24" aria-labelledby="about-title">
      <div className="site-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="relative lg:col-span-7">
          <div data-reveal="img" className="relative aspect-[4/3] overflow-hidden rounded-xl lg:aspect-[5/4]">
            <Img image={images.about} sizes="(min-width:1024px) 55vw, 100vw" className="h-full w-full object-cover" />
          </div>
          <div data-reveal className="relative -mt-16 ml-auto mr-4 max-w-xs rounded-lg bg-charcoal p-6 text-ivory shadow-lift sm:-mt-24 sm:mr-8 lg:absolute lg:-bottom-12 lg:right-10 lg:m-0">
            <p className="text-xl font-extrabold leading-snug tracking-tight">“Every handover is a promise kept.”</p>
            <p className="mt-3 text-xs uppercase tracking-[0.25em] text-ivory/60">How we work</p>
          </div>
        </div>

        <div className="lg:col-span-5 lg:pl-8 lg:pt-6">
          <p data-reveal className="eyebrow mb-3">{about.eyebrow}</p>
          <h2 data-reveal id="about-title" className="h2">
            Logistics with a personal touch.
          </h2>
          <p data-reveal className="mt-6 text-[1.05rem] leading-relaxed text-charcoal-muted">{about.intro}</p>
          <ul className="mt-10 space-y-0">
            {about.values.map((v, i) => (
              <li key={v.title} data-reveal className="grid grid-cols-[3rem_1fr] border-t border-charcoal/10 py-5 last:border-b">
                <span className="text-lg font-extrabold text-orange">0{i + 1}</span>
                <div>
                  <h3 className="text-[1.02rem] font-extrabold tracking-tight">{v.title}</h3>
                  <p className="mt-1 text-[0.95rem] text-charcoal-muted">{v.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
