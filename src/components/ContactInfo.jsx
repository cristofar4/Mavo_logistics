import { contact } from '../content/site'
import { Clock, Mail, MapPinLine, Phone } from './Icons'

/*
 * Contact details with clearly marked placeholders for anything not supplied yet.
 * Values come from content/site.js -> contact.
 */
export default function ContactInfo({ tone = 'light' }) {
  const dark = tone === 'dark'
  const tag = dark ? 'placeholder-tag-dark' : 'placeholder-tag'
  const label = dark ? 'text-ivory/50' : 'text-charcoal-muted'
  const value = dark ? 'text-ivory' : 'text-charcoal'
  const link = `${value} underline decoration-orange/40 underline-offset-4 transition-colors hover:text-orange`

  const rows = [
    {
      icon: Mail,
      label: 'Email',
      content: contact.email ? <a className={link} href={`mailto:${contact.email}`}>{contact.email}</a> : <span className={tag}>Email address to be added</span>,
    },
    {
      icon: Phone,
      label: 'Phone',
      content: contact.phone ? <a className={link} href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a> : <span className={tag}>Phone number to be added</span>,
    },
    {
      icon: MapPinLine,
      label: 'Address',
      content: contact.address ? <span className={value}>{contact.address}</span> : <span className={tag}>Office address to be added</span>,
    },
    {
      icon: Clock,
      label: 'Hours',
      content: contact.hours ? <span className={value}>{contact.hours}</span> : <span className={tag}>Opening hours to be added</span>,
    },
  ]

  return (
    <ul className="space-y-4">
      {rows.map(({ icon: Icon, label: l, content }) => (
        <li key={l} className="flex items-start gap-4">
          <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${dark ? 'border-ivory/15 text-orange' : 'border-charcoal/10 text-orange'}`}>
            <Icon className="h-[18px] w-[18px]" />
          </span>
          <span className="flex flex-col gap-1">
            <span className={`text-xs uppercase tracking-[0.2em] ${label}`}>{l}</span>
            {content}
          </span>
        </li>
      ))}
    </ul>
  )
}
