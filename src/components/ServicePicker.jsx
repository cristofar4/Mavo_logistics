import { serviceOptions, services } from '../content/site'
import Img from './Img'
import { Check, Globe } from './Icons'

const byId = Object.fromEntries(services.map((s) => [s.id, s]))

/*
 * Service choice as a radio group.
 *   variant="cards"  photo cards (quote dialog)
 *   variant="chips"  compact chips (contract book)
 * The first radio carries id `${idPrefix}-service`, so validation can focus it.
 */
export default function ServicePicker({ idPrefix, value, onChange, onBlur, error, touched, variant = 'cards', label = 'Service required' }) {
  const showError = !!error && (touched?.service || touched?.__all)
  const errId = `${idPrefix}-service-error`
  const name = `${idPrefix}-service-group`

  return (
    <fieldset aria-describedby={showError ? errId : undefined} aria-invalid={showError ? 'true' : undefined}>
      <legend className="mb-2.5 text-sm font-bold text-charcoal">{label}</legend>
      <div className={variant === 'cards' ? 'grid grid-cols-2 gap-2.5 sm:grid-cols-3' : 'flex flex-wrap gap-2'}>
        {serviceOptions.map((o, i) => {
          const s = byId[o.value]
          const checked = value === o.value
          const id = i === 0 ? `${idPrefix}-service` : `${idPrefix}-service-${o.value}`
          const input = (
            <input
              id={id}
              type="radio"
              name={name}
              value={o.value}
              checked={checked}
              onChange={() => onChange('service', o.value)}
              onBlur={() => onBlur?.('service')}
              className="peer sr-only"
            />
          )
          if (variant === 'chips') {
            return (
              <label key={o.value} htmlFor={id} className="svc-chip">
                {input}
                <span className="svc-chip-body">
                  {checked && <Check className="h-3.5 w-3.5" />}
                  {o.label}
                </span>
              </label>
            )
          }
          return (
            <label key={o.value} htmlFor={id} className={`svc-card ${o.value === 'unsure' ? 'col-span-2 sm:col-span-1' : ''}`}>
              {input}
              <span className="svc-card-body">
                <span className={`svc-card-media ${s ? '' : 'aspect-[16/4] sm:aspect-[16/8]'}`}>
                  {s ? (
                    <Img image={s.detailImage || s.image} sizes="180px" alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-charcoal text-orange">
                      <Globe className="h-8 w-8" />
                    </span>
                  )}
                  {s && (
                    <span className="serif-i absolute left-2 top-1 text-xl text-white [text-shadow:0_2px_8px_rgba(0,0,0,.55)]" aria-hidden="true">
                      {s.no}
                    </span>
                  )}
                  <span className="svc-card-check" aria-hidden="true">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                </span>
                <span className="block px-3 pb-2.5 pt-2">
                  <span className="block text-[0.9rem] font-extrabold text-charcoal">{o.label}</span>
                  <span className="mt-0.5 block text-[0.74rem] leading-snug text-charcoal/65">{s ? s.tags.join(' · ') : 'We will recommend the best option'}</span>
                </span>
              </span>
            </label>
          )
        })}
      </div>
      {showError && (
        <p id={errId} className="field-error">
          {error}
        </p>
      )}
    </fieldset>
  )
}
