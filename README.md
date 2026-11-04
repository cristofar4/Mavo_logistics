# MOVA Logistics website

A responsive marketing website for MOVA Logistics, built with **React 19**, **Vite**, **Tailwind CSS 3** and **GSAP + ScrollTrigger**. The layout follows the supplied design reference section by section.

## Run it

```bash
npm install
npm run dev        # local development at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the production build at http://localhost:4173
```

Requires Node 18 or newer.

## How the forms send email

Both the **Get a quote** planner and the **partnership contract book** are connected through `src/lib/submitEnquiry.js` and email every enquiry to the address in `src/content/site.js` (`forms.formsubmit`), using [FormSubmit](https://formsubmit.co): free, no account and no server.

**One time activation (required):**

1. Open the live site and send one test enquiry.
2. FormSubmit emails that address a message with an **Activate Form** button. Click it (check spam if it is not in the inbox).
3. From then on every quote request and partnership enquiry arrives as an email with a clear subject (for example "New quote request from Grace Hopper") and all the details in a table. Reply goes straight to the customer.

Until the form is activated, visitors see an honest message that it could not be delivered yet; the site never shows a false success.

**Optional, keep the address private:** after activating, FormSubmit shows a random alias string. Put that alias in `forms.formsubmit` instead of the email address so the address is not visible in the site code.

**Other settings:** set `VITE_FORMSUBMIT_TARGET` (an email or alias) in Vercel to override the address without changing code, or set `VITE_FORM_ENDPOINT` to post enquiries as JSON to your own backend instead. Spam protection: a hidden honeypot field is sent with each enquiry and FormSubmit discards anything that fills it.

The quote planner is a three step dialog (**Your cargo**, **The route**, **Your details**) with a route panel showing progress, service photo cards, a route card for pickup and destination, and a shipment ticket at the end.

## What is on the page (in design order)

| Section | Notes |
| --- | --- |
| Navigation | **Glass dock.** One frosted dock holds the logo, the section links in page order (Services, Industries, Our fleet, About, Contact) and the quote button. It turns to dark glass over dark sections, and shrinks into a floating bar after the hero. A tab marks the section in view and a soft glow follows the pointer. Hovering or focusing Services previews the four services with photos; clicking the link scrolls to the section. A rail along the bottom edge fills as you scroll, with a mark under each section and a small truck that turns round when scrolling back up. On phones the dock shows the section being read and the menu opens a vertical route map with "You are here" |
| Hero | "Moving business. *Connecting* people." with the port truck in a slanted panel that bleeds off the right edge, "ROAD. AIR. SEA." and a choreographed entrance |
| Values strip | Careful handling, Clear communication, Connected journeys |
| Services | 01 Road freight, 02 Air freight, 03 Warehousing, 04 Sea freight in the design's mosaic. Hover, focus or touch reveals "View details"; each card opens a service panel with a quote shortcut |
| Industries | Retail, Manufacturing, Agriculture as slanted photo cards on charcoal |
| Our fleet | Large cargo truck photo plus Delivery vans and Heavy freight cards; hover reveals suitable cargo |
| Partnership | The signature scene (see below). This is the About stop in the navigation |
| Coverage | Dark map with glowing routes that draw in and shipments travelling along a few of them. Labelled as illustrative |
| Process | Tell us, We plan, We deliver with circled numbers that draw in |
| FAQ | Six questions in two columns, accessible accordion |
| Footer | Logo, description, Company and Services links, Get in touch with a quote button, Privacy and Terms dialogs. Contact details and social links appear automatically once filled in |

### The partnership scene and the contract book

`src/components/ContractScene.jsx` and `src/components/ContractBook.jsx`

1. When about half of the section is in view, a GSAP timeline plays once. The representative is a real photograph (a smiling team member in a hard hat with a pen and an orange clipboard) and his pose never changes; the motion comes from camera, light and depth: he slides out from behind the plaster pillar turning toward the visitor in 3D, a warm light sweeps the wall and his shadow lands on it, the speech cloud inflates with **"Hi there!"**, the headline rises word by word, then the cloud asks **"Ready to sign with us?"** and two reply chips (**Yes, let's go** and **Not yet**) pop in under the cloud, while a gloss runs over the clipboard and the pen tip glints.
2. **Yes, let's go** (or **Let's work together**) blurs the page and the contract book flies out of his clipboard. The copper foil lettering shimmers, the cover swings open, a page turns and a ribbon bookmark drops.
3. The pages are laid out like an agreement: a MOVA letterhead dated today, then three numbered clauses: **1 The parties** (name, company, email, phone), **2 The shipment** (service chips, pickup, destination, cargo, date) and **3 Signature** (signature pad with mouse, pen or finger, or type your name, plus the enquiry confirmation).
4. **Sign** validates everything, an orange MOVA seal stamps onto the signature, the book closes, flies back to him, the blur lifts and the cloud says thank you. In demo mode the message says plainly that nothing was sent.
5. Closing the book without signing makes the cloud say "No rush".

With `prefers-reduced-motion: reduce` the finished scene shows immediately and the book opens without movement.

## Editing content

All copy, images, contact details, socials, FAQ answers and legal text live in **`src/content/site.js`**. House style: no hyphens or dash punctuation in visible copy.

Contact details and social profiles are `null` until supplied; the footer only shows them once a real value is set, so there are no invented details or dead links.

## Images

Images are in `public/images` as WebP at 800 and 1600 pixels wide. They carry width and height to reserve layout space, and everything below the hero is lazy loaded.

| File | Source |
| --- | --- |
| `hero-port` (white truck at the port), `fleet-heavy` (low loader) | Supplied by MOVA |
| `road`, `air`, `sea`, `warehouse` | Supplied by MOVA (mountain road truck, cargo plane, container ship) and Unsplash photo `1616401784845-180882ba9ba8` (warehouse) |
| `rep-worker` | Unsplash photo `1659353590896-3ad327ec4b42` (Fotos), cut out from its studio background |
| `sea-aerial` | Unsplash photo `1585713181935-d5f622cc2415` |
| `retail` | Unsplash photo `1764795849885-e226e3cabe87` |
| `manufacturing` | Unsplash photo `1647427060118-4911c9821b82` |
| `agriculture` | Unsplash photo `1565647952915-9644fcd446a4` |
| `fleet-truck` | Unsplash photo `1711236441158-78a3479678cf` |
| `fleet-van` | Unsplash photo `1641199788912-9a7385a35c82` |
| `world-dark` | Rendered from Natural Earth land data (public domain) |

Unsplash photos are used under the Unsplash License. View any of them at `https://unsplash.com/photos/<id>`.

## Missing assets and integrations

1. **Form endpoint.** Set `VITE_FORM_ENDPOINT` (see above).
2. **Contact details and social links** in `site.js`.
3. **Privacy policy and terms.** Placeholder text is shown in the dialogs.
4. **Your own representative photo.** The scene uses a free stock photo. To feature a MOVA team member, photograph them in a similar pose (pen in one hand, clipboard or contract in the other) against a plain wall, cut them out, replace `rep-worker-800.webp` and `rep-worker-1008.webp`, then update `representativeGeometry` in `site.js` (`aspect`, `penTip`, `contract`). A transparent video can replace the still via `representativeVideo`.
5. **Real service areas.** The map is illustrative; edit `NODES` and `ROUTES` in `Coverage.jsx`.
6. **Own fleet photography.** The van and highway truck are stock photos.

## Project structure

```
src/
  content/site.js          all editable copy and data
  lib/                     gsap setup, validation, submission adapter
  hooks/                   focus trap, scroll lock, form state
  context/UIContext.jsx    opens dialogs from anywhere
  components/              one file per section plus shared pieces
```
