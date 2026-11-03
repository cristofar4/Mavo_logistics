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

## Connecting the forms

Both the **Get a quote** form and the **partnership contract book** go through `src/lib/submitEnquiry.js`.

* With no endpoint configured the forms run in **demonstration mode**. They show a visible "Demonstration form" notice, validate every field, and never claim a submission was sent.
* To receive real enquiries, copy `.env.example` to `.env` and set:

  ```
  VITE_FORM_ENDPOINT=https://formspree.io/f/your-id
  ```

  Any service that accepts a JSON `POST` works (Formspree, Basin, Getform, a serverless function or your own API). The payload contains `kind` (`quote` or `partnership`), `submittedAt` and the form fields. Partnership enquiries also include `signatureTyped`, `signatureImage` (PNG data URL) and `consent`.

## What is on the page (in design order)

| Section | Notes |
| --- | --- |
| Navigation | **Route navigation.** Each section is a numbered stop on a road in page order: 01 Services, 02 Industries, 03 Our fleet, 04 About (the partnership section), 05 Contact. A small MOVA truck drives along the road as you scroll, turns round when you scroll back up, and the road behind it lights up orange. Tapping a stop scrolls to that section and moves keyboard focus there. On phones the menu button has a scroll progress ring and opens a vertical route map with "You are here" |
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

1. When about half of the section is in view, a GSAP timeline plays once. The representative's pose is fixed; the motion comes from camera, light and depth: he walks out from behind the plaster pillar turning toward the visitor in 3D, a warm light sweeps the wall and his shadow lands on it, the speech cloud inflates from its tail with **"Hi there!"**, the headline rises word by word, then the cloud asks **"Ready to sign with us?"** while a gloss runs over the contract and the pen tip glints. Afterwards the layers shift very slightly with the pointer on desktop.
2. **Yes, let's go** (or **Let's work together**) blurs the page and the contract book flies out of the contract in his hands. The copper foil lettering shimmers, the cover swings open, a page turns and a ribbon bookmark drops.
3. The pages hold the enquiry form and a signature pad (mouse, pen or finger, or type your name).
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
| `rep-body`, `rep-hand` | The MOVA representative from the design reference, upscaled, cut out and split into body and pen hand layers |
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
4. **Sharper representative photo.** He is cut from the low resolution design reference. For a sharper result, photograph a MOVA team member in the same pose and replace `rep-body-*` and `rep-hand-*`, then update `representativeGeometry` in `site.js`. A transparent video can replace the still via `representativeVideo`.
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
