import { serviceOptions } from '../content/site'
import { todayISO } from '../lib/validate'

/*
 * Shared, accessible field set used by the quote dialog and the partnership book.
 * Controlled: pass `values`, `errors`, `onChange(name, value)` and `onBlur(name)`.
 * `layout` = 'stack' renders one column, 'grid' renders two columns from sm upwards.
 * `only` limits which fields render (used to split fields across book pages).
 */
const FIELDS = [
  { name: 'name', label: 'Full name', type: 'text', autoComplete: 'name', required: true, span: 1 },
  { name: 'company', label: 'Company name', type: 'text', autoComplete: 'organization', span: 1 },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true, span: 1, inputMode: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', span: 1, inputMode: 'tel' },
  { name: 'service', label: 'Service required', type: 'select', required: true, span: 2 },
  { name: 'pickup', label: 'Pickup location', type: 'text', required: true, span: 1, placeholder: 'Town, city or postcode' },
  { name: 'destination', label: 'Destination', type: 'text', required: true, span: 1, placeholder: 'Town, city or country' },
  {
    name: 'cargo',
    label: 'Cargo details',
    type: 'textarea',
    required: true,
    span: 2,
    placeholder: 'What are you moving? Approximate size, weight, quantity and packaging.',
  },
  { name: 'date', label: 'Preferred date', type: 'date', span: 1 },
]

export default function EnquiryFields({ idPrefix, values, errors, touched, onChange, onBlur, layout = 'grid', only, tone = 'ivory' }) {
  const list = only ? FIELDS.filter((f) => only.includes(f.name)) : FIELDS
  const grid = layout === 'grid' ? 'grid gap-x-5 gap-y-5 sm:grid-cols-2' : 'grid gap-y-4'

  return (
    <div className={grid}>
      {list.map((f) => {
        const id = `${idPrefix}-${f.name}`
        const err = touched?.[f.name] || touched?.__all ? errors[f.name] : undefined
        const describedBy = err ? `${id}-error` : undefined
        const common = {
          id,
          name: f.name,
          value: values[f.name],
          onChange: (e) => onChange(f.name, e.target.value),
          onBlur: () => onBlur?.(f.name),
          'aria-invalid': err ? 'true' : undefined,
          'aria-describedby': describedBy,
          'aria-required': f.required ? 'true' : undefined,
          className: `field ${tone === 'paper' ? 'field-paper' : ''}`,
        }
        return (
          <div key={f.name} className={layout === 'grid' && f.span === 2 ? 'sm:col-span-2' : ''}>
            <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between gap-2 text-sm font-medium text-charcoal">
              <span>{f.label}</span>
              {!f.required && <span className="text-xs font-normal text-charcoal-muted">Optional</span>}
            </label>
            {f.type === 'select' ? (
              <select {...common}>
                <option value="">Choose a service</option>
                {serviceOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            ) : f.type === 'textarea' ? (
              <textarea {...common} rows={3} placeholder={f.placeholder} />
            ) : (
              <input
                {...common}
                type={f.type}
                autoComplete={f.autoComplete}
                inputMode={f.inputMode}
                placeholder={f.placeholder}
                min={f.type === 'date' ? todayISO() : undefined}
              />
            )}
            {err && (
              <p id={`${id}-error`} className="field-error">
                {err}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
