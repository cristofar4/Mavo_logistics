/*
 * MOVA Logistics: editable site content.
 *
 * All visible copy lives here so it can be changed without touching components.
 * House style: no hyphens or dash punctuation in visible copy.
 *
 * Values set to `null` are details the business has not supplied yet.
 * Contact rows and social links only appear once a real value is filled in,
 * so the site never shows invented details or dead links.
 */

export const brand = {
  name: 'MOVA Logistics',
  short: 'MOVA',
  description: 'Connecting businesses and people through reliable, flexible and forward thinking logistics.',
}

/* Contact details. Replace null with real values; each one then appears in the footer. */
export const contact = {
  email: null, // e.g. 'hello@movalogistics.com'
  phone: null, // e.g. '+1 555 0100'
  address: null, // e.g. '12 Harbour Road, Port City'
}

/*
 * Where quote requests and partnership enquiries are emailed, through FormSubmit (formsubmit.co).
 * The very first enquiry makes FormSubmit send an "Activate form" email to this address: click it
 * once and every enquiry after that arrives in the inbox. After activating, FormSubmit also shows a
 * private random alias: put that here instead of the address to keep the address out of the site code.
 */
export const forms = {
  formsubmit: 'christopherpraise159@gmail.com',
}

/* Social profiles. Only entries with a url are rendered. */
export const socials = [
  { label: 'LinkedIn', url: null },
  { label: 'Instagram', url: null },
  { label: 'Facebook', url: null },
]

/*
 * Navigation stops, in the same order as the sections on the page.
 * The nav draws them as stops on a route; `desc` shows in the mobile route map.
 */
export const nav = [
  { label: 'Services', href: '#services', desc: 'Road, air, sea and warehousing' },
  { label: 'Industries', href: '#industries', desc: 'Retail, manufacturing and agriculture' },
  { label: 'Our fleet', href: '#fleet', desc: 'Vans, cargo trucks and heavy freight' },
  { label: 'About', href: '#about', desc: 'Meet the team and partner with us' },
  { label: 'Contact', href: '#contact', desc: 'Get in touch and get a quote' },
]

/*
 * Images live in /public/images as `<name>-800.webp` and `<name>-1600.webp`.
 * `w` and `h` are the intrinsic size of the larger file (used to reserve layout space).
 */
export const images = {
  heroPort: { name: 'hero-port', w: 1600, h: 800, alt: 'White truck at a container port at sunset, with a cargo ship and cranes behind it' },
  road: { name: 'road', w: 1600, h: 900, alt: 'White truck driving along a winding mountain road' },
  air: { name: 'air', w: 1600, h: 900, alt: 'Cargo aircraft taking off' },
  sea: { name: 'sea', w: 1600, h: 900, alt: 'Container ship sailing along a mountainous coastline at sunset' },
  seaAerial: { name: 'sea-aerial', w: 1332, h: 2000, alt: 'Aerial view of a container ship loaded with colourful containers at sea' },
  warehouse: { name: 'warehouse', w: 1600, h: 1066, alt: 'Orange reach truck between racks of palletised stock in a warehouse' },
  retail: { name: 'retail', w: 1600, h: 900, alt: 'Woman checking stock on warehouse shelves with a tablet' },
  manufacturing: { name: 'manufacturing', w: 1600, h: 1066, alt: 'Orange robotic arms on a factory production line' },
  agriculture: { name: 'agriculture', w: 1600, h: 1066, alt: 'Combine harvester working a wheat field at sunset' },
  fleetTruck: { name: 'fleet-truck', w: 1600, h: 900, alt: 'White truck and trailer on an open road at sunset' },
  fleetVan: { name: 'fleet-van', w: 1600, h: 901, alt: 'White delivery van parked beside a brick building' },
  fleetHeavy: { name: 'fleet-heavy', w: 1600, h: 819, alt: 'Heavy freight truck carrying a large steel vessel strapped to a low loader' },
  worldMap: { name: 'world-dark', w: 1600, h: 736, alt: '' },
  /*
   * Representative for the partnership scene: a real photograph (Unsplash License, photo
   * 1659353590896-3ad327ec4b42 by Fotos), cut out from its studio background. He holds a pen
   * and an orange clipboard. Replace with your own team member in the same framing (see README).
   */
  repWorker: { name: 'rep-worker', w: 1008, h: 1486, widths: [800, 1008], alt: 'Smiling MOVA Logistics team member in a hard hat holding a pen and an orange clipboard' },
}

export const representativeGeometry = {
  aspect: 1008 / 1486, // width / height of the photo
  penTip: { x: 22.8, y: 35.8 }, // where the pen tip glints, percent of the photo
  contract: { left: 25, top: 61, width: 66, height: 24 }, // the clipboard, percent of the photo
}

/*
 * Optional: a transparent video (WebM with alpha, plus HEVC with alpha .mov for Safari)
 * of the representative to replace the still image. Keep the same framing.
 */
export const representativeVideo = {
  webm: null,
  mov: null,
}

export const hero = {
  label: 'Logistics without limits',
  body: 'Reliable and flexible logistics solutions that keep your goods, your business and your people moving.',
  cta: 'Explore our services',
  tagline: 'Road. Air. Sea.',
}

/* The dark strip under the hero. */
export const values = [
  { id: 'handling', title: 'Careful handling', body: 'Your goods are treated as if they were our own at every handover.' },
  { id: 'communication', title: 'Clear communication', body: 'One point of contact, plain answers and updates when they matter.' },
  { id: 'journeys', title: 'Connected journeys', body: 'Road, air, sea and storage planned as one connected journey.' },
]

export const services = [
  {
    id: 'road',
    no: '01',
    title: 'Road freight',
    short: 'Flexible, reliable transport that keeps your goods moving across cities and countries.',
    image: images.road,
    tags: ['Full loads', 'Part loads'],
    suits: ['Palletised and boxed goods', 'Full and part loads', 'Regular regional runs'],
    detail: [
      'Road freight is the everyday backbone of moving goods. We match your shipment to a suitable vehicle, agree collection and delivery windows with you and coordinate the handover at each end.',
      'It works well for regular replenishment, one off moves and anything that needs to reach several destinations on the same journey.',
    ],
    steps: ['Share pickup and delivery points', 'We match the right vehicle', 'Collection, transport and handover'],
  },
  {
    id: 'air',
    no: '02',
    title: 'Air freight',
    short: 'Fast, secure and efficient air transport for time sensitive shipments.',
    image: images.air,
    tags: ['Express', 'Global reach'],
    suits: ['Time sensitive parts', 'High value goods', 'Samples and documents'],
    detail: [
      'Air freight is the fastest way to move goods over long distances. We arrange space with air cargo carriers, prepare the shipment for travel and coordinate the road legs to and from the airport.',
      'Tell us your deadline and we will recommend whether air is the right choice or whether another mode can do the job for less.',
    ],
    steps: ['Confirm deadline and cargo', 'Booking and preparation', 'Airport handover and final delivery'],
  },
  {
    id: 'warehousing',
    no: '03',
    title: 'Warehousing',
    short: 'Safe, organised and flexible storage solutions that fit your supply chain.',
    image: images.warehouse,
    tags: ['Storage', 'Distribution'],
    suits: ['Short and long term storage', 'Pick and pack support', 'Cross docking between vehicles'],
    detail: [
      'Warehousing gives your goods a safe place to wait between journeys. We can receive, store and prepare stock for dispatch so that it moves on as soon as you are ready.',
      'Storage terms, locations and handling options are agreed with you for each project.',
    ],
    steps: ['Agree space and handling', 'Receive and store', 'Prepare and dispatch'],
  },
  {
    id: 'sea',
    no: '04',
    title: 'Sea freight',
    short: 'Cost effective and reliable shipping for cargo of every size across global routes.',
    image: images.seaAerial,
    detailImage: images.sea,
    tags: ['Full containers', 'Shared space'],
    suits: ['Full container loads', 'Shared container space', 'Bulky and heavy goods'],
    detail: [
      'Sea freight is a cost effective way to move larger volumes internationally. We arrange the container, coordinate the port handling and connect the sea journey with road transport at both ends.',
      'If you do not need a whole container, ask us about sharing space with other shipments.',
    ],
    steps: ['Plan volume and timing', 'Container and port coordination', 'Onward delivery from port'],
  },
]

export const industries = [
  {
    id: 'retail',
    title: 'Retail',
    body: 'Reliable supply for stores, platforms and growing brands.',
    image: images.retail,
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing',
    body: 'Dependable logistics for materials, components and finished goods.',
    image: images.manufacturing,
  },
  {
    id: 'agriculture',
    title: 'Agriculture',
    body: 'From field to market, we keep essential goods moving efficiently.',
    image: images.agriculture,
  },
]

/*
 * Fleet. Capacities and fleet sizes are not published yet: `specs` values stay null
 * and show as "To be confirmed" until real figures are added.
 */
export const fleet = {
  main: {
    id: 'trucks',
    title: 'Cargo trucks',
    body: 'Room for palletised and bulky goods on scheduled routes and dedicated runs between sites.',
    suits: ['Palletised goods', 'Bulky items', 'Scheduled distribution'],
    image: images.fleetTruck,
  },
  side: [
    {
      id: 'vans',
      title: 'Delivery vans',
      body: 'Agile and efficient for smaller, time sensitive loads.',
      suits: ['Parcels', 'Ecommerce orders', 'Multi stop city routes'],
      image: images.fleetVan,
    },
    {
      id: 'heavy',
      title: 'Heavy freight',
      body: 'Strong, versatile and built for larger, more demanding shipments.',
      suits: ['Full truckloads', 'Machinery', 'Oversized cargo'],
      image: images.fleetHeavy,
    },
  ],
  specs: [
    { label: 'Payload', value: null },
    { label: 'Fleet size', value: null },
  ],
}

export const contractScene = {
  titleA: 'Your next chapter',
  titleB: 'starts here.',
  body: 'Partner with a logistics team that is committed to your goals, your growth and what comes next.',
  cta: 'Let’s work together',
  hello: 'Hi there!',
  bubble: 'Ready to sign with us?',
  bubbleYes: 'Yes, let’s go',
  bubbleNo: 'Not yet',
  bubbleLater: 'No rush. I will be right here when you are ready.',
  bubbleThanks: 'Thank you for booking with us! We will get back to you soon.',
  bubbleThanksDemo: 'Thank you for signing! This was a demo, so nothing was sent yet.',
  note: 'Signing opens a partnership enquiry. It is not a binding contract.',
}

export const coverage = {
  heading: 'Closer to wherever you need us.',
  note: 'Illustrative map. Service areas and routes are confirmed for each enquiry.',
  items: [
    { id: 'local', title: 'Local' },
    { id: 'national', title: 'Nationwide' },
    { id: 'international', title: 'International' },
  ],
}

export const process = {
  eyebrow: 'Our process',
  heading: 'A simple path from request to delivery.',
  steps: [
    { title: 'Tell us', body: 'Share your shipment needs and where it is going.' },
    { title: 'We plan', body: 'Build the right solution with the best route, mode and schedule.' },
    { title: 'We deliver', body: 'Move your goods safely, efficiently and on time.' },
  ],
}

export const faqIntro = {
  heading: 'Frequently asked questions',
  body: 'Quick answers to the things our customers ask most.',
}

export const faqs = [
  {
    q: 'What types of shipments do you handle?',
    a: 'We move a wide range of general cargo, from parcels and pallets to bulky items, machinery and full loads. Some goods, such as hazardous or temperature controlled cargo, need special arrangements, so please describe your cargo and we will confirm what is possible.',
  },
  {
    q: 'Do you serve both local and international routes?',
    a: 'Yes. We plan local and nationwide road transport and coordinate international air and sea freight, connecting each leg into one journey. Destinations and timings are confirmed for each shipment.',
  },
  {
    q: 'How do you ensure my cargo is handled safely?',
    a: 'We agree packing, loading and handover requirements with you before anything moves, match your cargo to a suitable vehicle and keep you informed at each handover. Tell us about anything fragile or valuable so it can be planned for.',
  },
  {
    q: 'Can you support recurring shipments?',
    a: 'Yes. Regular collections and delivery schedules can be planned around your operations. Tell us about the frequency and volumes you expect and we will suggest an arrangement.',
  },
  {
    q: 'Do you offer warehousing as well as transport?',
    a: 'Yes. We can receive, store and prepare your stock for dispatch, then move it on by road, air or sea. Storage terms and handling options are agreed for each project.',
  },
  {
    q: 'How do I get a quote?',
    a: 'Select Get a quote and share a few details: what you are moving, where it is collected from, where it is going and when. Our team reviews every request and replies with a recommended plan and price.',
  },
]

export const footer = {
  company: [
    { label: 'About', href: '#about' },
    { label: 'Our fleet', href: '#fleet' },
    { label: 'Industries', href: '#industries' },
    { label: 'Contact center', href: '#contact' },
  ],
  getInTouch: 'Have a shipment in mind? Our team is ready to help you find the right solution.',
}

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
