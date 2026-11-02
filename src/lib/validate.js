const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE = /^\+?[0-9\s().]{7,20}$/

export const emptyEnquiry = {
  name: '',
  company: '',
  email: '',
  phone: '',
  service: '',
  pickup: '',
  destination: '',
  cargo: '',
  date: '',
}

export function todayISO() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export function validateEnquiry(v) {
  const e = {}
  if (!v.name.trim()) e.name = 'Please enter your full name.'
  else if (v.name.trim().length < 2) e.name = 'Your name looks too short.'
  if (!v.email.trim()) e.email = 'Please enter your email address.'
  else if (!EMAIL.test(v.email.trim())) e.email = 'Please enter a valid email address, for example name@company.com.'
  if (v.phone.trim() && !PHONE.test(v.phone.trim())) e.phone = 'Please use digits only, with an optional + at the start.'
  if (!v.service) e.service = 'Please choose the service you need.'
  if (!v.pickup.trim()) e.pickup = 'Please tell us where the cargo is collected from.'
  if (!v.destination.trim()) e.destination = 'Please tell us where the cargo is going.'
  if (!v.cargo.trim()) e.cargo = 'Please describe your cargo.'
  else if (v.cargo.trim().length < 10) e.cargo = 'A little more detail helps us plan, such as size, weight or packaging.'
  if (v.date && v.date < todayISO()) e.date = 'Please choose today or a future date.'
  return e
}

export const fieldOrder = ['name', 'company', 'email', 'phone', 'service', 'pickup', 'destination', 'cargo', 'date']
