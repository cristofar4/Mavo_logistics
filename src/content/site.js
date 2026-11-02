/*
 * MOVA Logistics: editable site content.
 *
 * All visible copy lives here so it can be changed without touching components.
 * House style: no hyphens or dash punctuation in visible copy.
 *
 * Values set to `null` are details the business has not supplied yet.
 * The UI renders them as clearly marked placeholders instead of inventing data.
 */

export const brand = {
  name: 'MOVA Logistics',
  short: 'MOVA',
  tagline: 'People. Freight. Progress.',
  description:
    'Reliable logistics for a connected world. Road, air and sea freight with warehousing, planned around your business.',
}

/* Contact details. Replace null with real values when available. */
export const contact = {
  email: null, // e.g. 'hello@movalogistics.com'
  phone: null, // e.g. '+1 555 0100'
  whatsapp: null, // e.g. 'https://wa.me/15550100'
  address: null, // e.g. '12 Harbour Road, Port City'
  hours: null, // e.g. 'Monday to Friday, 8am to 6pm'
}

/* Social profiles. Only entries with a url are rendered as links. */
export const socials = [
  { label: 'LinkedIn', url: null },
  { label: 'Instagram', url: null },
  { label: 'Facebook', url: null },
]

export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Our fleet', href: '#fleet' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

/*
 * Images live in /public/images as `<name>-800.webp` and `<name>-1600.webp`.
 * `w` and `h` are the intrinsic size of the 1600 version (used to reserve layout space).
 */
export const images = {
  heroPort: { name: 'hero-port', w: 1600, h: 900, alt: 'White MOVA truck parked at a container port at sunset' },
  road: { name: 'road', w: 1600, h: 900, alt: 'White truck driving along a mountain road at sunrise' },
  air: { name: 'air', w: 1600, h: 900, alt: 'Cargo aircraft taking off against an orange evening sky' },
  sea: { name: 'sea', w: 1600, h: 900, alt: 'Container ship sailing along a mountainous coastline at sunset' },
  warehouse: { name: 'warehouse', w: 1600, h: 1066, alt: 'Orange reach truck between racks of palletised stock in a warehouse' },
  about: { name: 'about', w: 1600, h: 1066, alt: 'Busy distribution centre with rows of parcels and storage racks' },
  retail: { name: 'retail', w: 1600, h: 2000, alt: 'Parcel being handed over to a customer' },
  manufacturing: { name: 'manufacturing', w: 1600, h: 1066, alt: 'Robotic arms assembling a car body on a production line' },
  agriculture: { name: 'agriculture', w: 1600, h: 1066, alt: 'Two people shaking hands in a golden wheat field' },
  construction: { name: 'construction', w: 1600, h: 1066, alt: 'Construction team in high visibility vests on a large building site' },
  office: { name: 'office', w: 1600, h: 900, alt: '' },
  worldMap: { name: 'world-relief', w: 1600, h: 736, alt: '' },
  vehicleVan: { name: 'vehicle-van', w: 729, h: 391, widths: [800], alt: 'White MOVA Logistics delivery van' },
  vehicleCargo: { name: 'vehicle-cargo', w: 744, h: 472, widths: [800], alt: 'White MOVA Logistics rigid cargo truck' },
  vehicleHeavy: { name: 'vehicle-heavy', w: 763, h: 467, widths: [800], alt: 'White heavy freight tractor unit with curtain side trailer' },
  /*
   * Representative for the contract scene (the MOVA team member from the design reference),
   * in two layers so the pen hand can move on its own:
   *   rep-body: the person with the pen hand removed (shirt restored behind it)
   *   rep-hand: the pen hand on its own, positioned with `handBox` (percent of the body image)
   * Both come from the same 1712 x 1480 image. The body's far edge is straight at `edgeRatio`
   * of the image width and lines up with the wall edge in the scene.
   * Replace with your own transparent photo shoot assets using the same framing (see README).
   */
  repBody: { name: 'rep-body', w: 1600, h: 1383, alt: 'Smiling MOVA Logistics representative holding an open contract and offering a pen' },
  repHand: { name: 'rep-hand', w: 396, h: 377, alt: '' },
}

/*
 * Optional enhancement for the contract scene.
 * Supply a transparent video (WebM with alpha, plus HEVC with alpha .mov for Safari)
 * of the representative to replace the still image. Keep the same framing.
 */
export const representativeGeometry = {
  edgeRatio: 0.1437, // straight body edge, as a fraction of image width
  aspect: 1712 / 1480,
  handBox: { left: 5.2, top: 56.69, width: 24.77, height: 27.23 }, // percent of the body image
  penTip: { x: 28.5, y: 74.9 }, // where the pen tip glints, percent of the body image
}

export const representativeVideo = {
  webm: null, // e.g. '/media/representative.webm'
  mov: null, // e.g. '/media/representative.mov'
}

export const hero = {
  label: 'Logistics that moves you forward',
  titleA: 'Moving business.',
  titleB: 'Connecting people.',
  body: 'Reliable road, air and sea freight, from the first mile to the final destination. One team plans every step.',
  link: 'Explore our services',
  side: 'People move possibilities',
}

export const services = [
  {
    id: 'road',
    title: 'Road freight',
    short: 'Reliable transport across regions.',
    image: images.road,
    summary:
      'Scheduled and on demand road transport for parcels, pallets and full loads, planned around your pickup windows and delivery points.',
    suits: ['Palletised and boxed goods', 'Full and part loads', 'Regular regional runs'],
    detail: [
      'Road freight is the everyday backbone of moving goods. We match your shipment to a suitable vehicle, agree collection and delivery windows with you and coordinate the handover at each end.',
      'It works well for regular replenishment, one off moves and anything that needs to reach several destinations on the same journey.',
    ],
    steps: ['Share pickup and delivery points', 'We match the right vehicle', 'Collection, transport and handover'],
  },
  {
    id: 'air',
    title: 'Air freight',
    short: 'Speed for urgent cargo.',
    image: images.air,
    summary:
      'When time matters most, we arrange air cargo and look after the paperwork and handovers at both ends of the journey.',
    suits: ['Time sensitive parts', 'High value goods', 'Samples and documents'],
    detail: [
      'Air freight is the fastest way to move goods over long distances. We arrange space with air cargo carriers, prepare the shipment for travel and coordinate the road legs to and from the airport.',
      'Tell us your deadline and we will recommend whether air is the right choice or whether another mode can do the job for less.',
    ],
    steps: ['Confirm deadline and cargo', 'Booking and preparation', 'Airport handover and final delivery'],
  },
  {
    id: 'sea',
    title: 'Sea freight',
    short: 'Global reach. Dependable delivery.',
    image: images.sea,
    summary:
      'Container and shared container shipments for larger volumes, coordinated from origin pickup to final delivery.',
    suits: ['Full container loads', 'Shared container space', 'Bulky and heavy goods'],
    detail: [
      'Sea freight is a cost effective way to move larger volumes internationally. We arrange the container, coordinate the port handling and connect the sea journey with road transport at both ends.',
      'If you do not need a whole container, ask us about sharing space with other shipments.',
    ],
    steps: ['Plan volume and timing', 'Container and port coordination', 'Onward delivery from port'],
  },
  {
    id: 'warehousing',
    title: 'Warehousing',
    short: 'Space for your next move.',
    image: images.warehouse,
    summary:
      'Storage and handling that keeps stock organised between journeys, ready for dispatch when you need it.',
    suits: ['Short and long term storage', 'Pick and pack support', 'Cross docking between vehicles'],
    detail: [
      'Warehousing gives your goods a safe place to wait between journeys. We can receive, store and prepare stock for dispatch so that it moves on as soon as you are ready.',
      'Storage terms, locations and handling options are agreed with you for each project.',
    ],
    steps: ['Agree space and handling', 'Receive and store', 'Prepare and dispatch'],
  },
]

export const contractScene = {
  eyebrow: 'Partnership',
  titleA: 'Your next chapter',
  titleB: 'starts here.',
  body: 'Tell us what you need to move. Let us plan the journey.',
  cta: 'Let’s work together',
  bubble: 'Ready to sign with us?',
  hello: 'Hi there!',
  bubbleYes: 'Yes, let’s go',
  bubbleNo: 'Not yet',
  bubbleLater: 'No rush. I will be right here when you are ready.',
  bubbleThanks: 'Thank you for booking with us! We will get back to you soon.',
  bubbleThanksDemo: 'Thank you for signing! This was a demo, so nothing was sent yet.',
  note: 'Signing opens a partnership enquiry. It is not a binding contract.',
}

export const fleet = [
  {
    id: 'vans',
    tab: 'Delivery vans',
    title: 'Delivery vans',
    lead: 'Flexible capacity for local and regional drops.',
    body: 'Compact and quick to load, vans suit smaller consignments that need to reach many addresses in towns and cities.',
    suits: ['Parcels and small consignments', 'Retail and ecommerce orders', 'Multi stop routes in towns and cities'],
    image: images.vehicleVan,
    specs: [
      { label: 'Payload', value: null },
      { label: 'Load space', value: null },
      { label: 'Availability', value: null },
    ],
  },
  {
    id: 'trucks',
    tab: 'Cargo trucks',
    title: 'Cargo trucks',
    lead: 'Room for larger shipments across regions.',
    body: 'Rigid cargo trucks carry palletised and bulky goods on scheduled routes and dedicated runs between sites.',
    suits: ['Palletised goods', 'Furniture and bulky items', 'Scheduled distribution between sites'],
    image: images.vehicleCargo,
    specs: [
      { label: 'Payload', value: null },
      { label: 'Pallet spaces', value: null },
      { label: 'Availability', value: null },
    ],
  },
  {
    id: 'heavy',
    tab: 'Heavy freight',
    title: 'Heavy freight vehicles',
    lead: 'Built for the biggest loads.',
    body: 'Tractor units and trailers handle full loads, machinery and oversized cargo over longer distances.',
    suits: ['Full truckloads', 'Machinery and construction materials', 'Long distance haulage'],
    image: images.vehicleHeavy,
    specs: [
      { label: 'Payload', value: null },
      { label: 'Trailer types', value: null },
      { label: 'Availability', value: null },
    ],
  },
]

export const coverage = {
  heading: 'Built for the journey ahead.',
  body: 'Local expertise, nationwide reach and international connections, coordinated by one team.',
  note: 'Illustrative map. Service areas and routes are confirmed for each enquiry.',
  items: [
    { id: 'local', title: 'Local delivery', body: 'Quick, careful drops for your community and nearby markets.' },
    { id: 'national', title: 'Nationwide transport', body: 'Road freight that links your sites, suppliers and customers across the country.' },
    { id: 'international', title: 'International freight', body: 'Air and sea shipments coordinated with onward delivery at both ends.' },
  ],
}

export const industries = [
  {
    id: 'retail',
    title: 'Retail and ecommerce',
    body: 'Stock replenishment for stores and dependable delivery of online orders, so shelves stay full and customers stay happy.',
    tags: ['Store replenishment', 'Online orders', 'Seasonal peaks'],
    image: images.retail,
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    body: 'Transport for raw materials, components and finished goods, timed around your production schedule.',
    tags: ['Inbound materials', 'Components', 'Finished goods'],
    image: images.manufacturing,
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
    body: 'Logistics for seasonal harvests and year round supply, from farm gate to processor and market.',
    tags: ['Harvest season', 'Equipment', 'Supply to market'],
    image: images.agriculture,
  },
  {
    id: 'construction',
    title: 'Construction',
    body: 'Planned deliveries of materials and equipment to sites, coordinated with your project timeline.',
    tags: ['Building materials', 'Plant and equipment', 'Site deliveries'],
    image: images.construction,
  },
]

export const process = {
  heading: 'A clear path from start to finish.',
  body: 'A simple process, designed to keep your business moving.',
  steps: [
    { title: 'Tell us what you need', body: 'Share your cargo, pickup point, destination and timing through a short form or a conversation with our team.' },
    { title: 'We plan your route', body: 'We recommend the right mode and vehicle, then confirm the plan and the price with you before anything moves.' },
    { title: 'Your cargo moves', body: 'We coordinate collection, transport and handover, and keep you informed along the way.' },
  ],
}

export const about = {
  eyebrow: 'About MOVA',
  heading: 'Logistics with a personal touch.',
  intro:
    'MOVA Logistics helps businesses move goods with less uncertainty. We focus on the parts of logistics that matter most to you: talking clearly, handling cargo with care and making sure every leg of the journey connects.',
  values: [
    { title: 'Clear communication', body: 'One point of contact, plain answers and updates when they matter.' },
    { title: 'Careful handling', body: 'Your goods are treated as if they were our own at every handover.' },
    { title: 'Coordinated transport', body: 'Road, air, sea and storage planned as one connected journey.' },
  ],
}

export const faqs = [
  {
    q: 'What goods can you transport?',
    a: 'We move a wide range of general cargo, from parcels and pallets to bulky items, machinery and full loads. Some goods, such as hazardous or temperature controlled cargo, need special arrangements, so please describe your cargo and we will confirm what is possible.',
  },
  {
    q: 'How do I request a quote?',
    a: 'Select Get a quote at the top of the page and share a few details about your shipment. Our team reviews every request and replies with a recommended plan and price.',
  },
  {
    q: 'Do you handle international freight?',
    a: 'Yes. We coordinate air and sea freight together with the road journeys at each end. Destinations, documents and timings are confirmed for each shipment.',
  },
  {
    q: 'Can you support recurring business deliveries?',
    a: 'Yes. Regular collections and delivery schedules can be planned around your operations. Tell us about the frequency and volumes you expect and we will suggest an arrangement.',
  },
  {
    q: 'What information should I provide?',
    a: 'The most useful details are the pickup location, the destination, what the cargo is, its approximate size and weight, how it is packed and when it needs to arrive. If you are unsure about anything, share what you know and we will help with the rest.',
  },
]

export const serviceOptions = [
  { value: 'road', label: 'Road freight' },
  { value: 'air', label: 'Air freight' },
  { value: 'sea', label: 'Sea freight' },
  { value: 'warehousing', label: 'Warehousing' },
  { value: 'unsure', label: 'Not sure yet' },
]

export const legal = {
  privacy: {
    title: 'Privacy policy',
    body: [
      'This privacy policy has not been published yet.',
      'Before collecting enquiries on a live website, add a policy explaining what personal data MOVA Logistics collects through its forms, why it is collected, how long it is kept and how people can contact the company about their data.',
    ],
  },
  terms: {
    title: 'Terms',
    body: [
      'Terms and conditions have not been published yet.',
      'Add the terms that apply to quotes, bookings and use of this website here. Until then, any quote or plan shared by the team is subject to written confirmation.',
    ],
  },
}
