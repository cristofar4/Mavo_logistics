# MOVA Logistics website

A responsive marketing website for MOVA Logistics, built with **React 19**, **Vite**, **Tailwind CSS 3** and **GSAP + ScrollTrigger**.

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

## What is on the page

| Section | Notes |
| --- | --- |
| Navigation | Sticky, background turns on as you scroll, highlights the section in view, full mobile menu with focus trap, Escape and a close button |
| Hero | Bold split layout with the orange brand bracket, staggered headline, slanted photo panel that bleeds off the right edge and reveals with a settling zoom |
| Services | Slanted, rounded card mosaic as in the design. Hover, keyboard focus or touch reveals more detail; each card opens a service detail dialog with a quote shortcut |
| Contract scene | The signature animation (see below) |
| Our fleet | MOVA vehicle line up with accessible tabs (arrow keys, Home, End). Unknown specs show "To be confirmed" |
| Coverage | Relief world map with glowing route lines that draw in. Clearly labelled as illustrative |
| Industries | Slanted photo cards with captions and examples |
| Process | Three steps joined by a line that draws in on scroll |
| About | Editorial photo layout and three value statements |
| FAQ | Accessible accordion with animated expansion |
| Contact and footer | Quote action, contact details, navigation, service links, social links, privacy and terms dialogs |

### The contract scene

`src/components/ContractScene.jsx` and `src/components/ContractBook.jsx`

1. When about 35% of the section has entered the viewport, a GSAP timeline plays once:
   * the representative slides out from behind the ivory wall panel that carries the headline (1.1s)
   * he raises the pen hand beside his head and waves from behind the wall edge while the cloud says **"Hi there!"**
   * he lowers the hand and reaches toward the visitor, offering the pen; the wall's clip slides away so the hand comes around the edge
   * the cloud changes to **"Ready to sign with us?"** (0.4s), then the headline and action appear (0.5s)
2. The cloud offers **Yes, let’s go** and **Not yet**.
3. **Yes** (or **Let’s work together**) makes the contract book fly out of the representative’s folder to the centre of the screen while the page behind blurs. The cover swings open to reveal a two page enquiry form with a signature pad (draw with mouse, pen or finger, or type your name).
4. **Sign** validates the form, closes the cover, flies the book back to the representative, removes the blur and the cloud says thank you. In demo mode the thank you message clearly says nothing was sent.
5. Closing the book without signing returns the cloud to a friendly "No rush" message.

Layers, back to front: blurred office backdrop, representative body (clipped at the wall edge) with a cast shadow, the ivory wall panel, the pen hand (its own layer so it can wave), the cloud. The body is never faded over the wall; the wall edge physically hides him as he slides out. After the entrance only a very slow breathing movement remains. With `prefers-reduced-motion: reduce` the finished scene is shown immediately and the book opens without movement.

## Editing content

All copy, contact details, socials, image references, FAQ answers and legal text live in **`src/content/site.js`**. House style: no hyphens or dash punctuation in visible copy.

Values set to `null` (email, phone, address, hours, social URLs, fleet specs) render as clearly marked placeholders such as "Email address to be added". Social entries only become links once a URL is supplied, so there are no dead links.

## Images

Images are in `public/images` as WebP at 800 and 1600 pixels wide (`name-800.webp`, `name-1600.webp`); the vehicle cut outs only come in 800 (`widths: [800]` in `site.js`). They carry width and height to reserve layout space, and everything below the hero is lazy loaded. To replace an image, export both sizes with the same name and update `w`/`h` in `src/content/site.js` if the aspect ratio changes.

| File | Source |
| --- | --- |
| `hero-port`, `road`, `air`, `sea` | Supplied by MOVA |
| `rep-body`, `rep-hand` | The representative from the supplied design, upscaled, cut out and split into body and pen hand layers (the shirt behind the hand was restored) |
| `vehicle-van`, `vehicle-cargo`, `vehicle-heavy` | MOVA branded vehicles from the supplied design, upscaled and cut out |
| `office` | Unsplash photo `1556761175-5973dc0f32e7`, blurred and warmed |
| `world-relief` | Rendered from Natural Earth land data (public domain) |
| `warehouse` | Unsplash photo `1616401784845-180882ba9ba8` |
| `about` | Unsplash photo `1586528116311-ad8dd3c8310d` |
| `retail` | Unsplash photo `1566576721346-d4a3b4eaeb55` |
| `manufacturing` | Unsplash photo `1567789884554-0b844b597180` |
| `agriculture` | Unsplash photo `1500937386664-56d1dfef3854` |
| `construction` | Unsplash photo `1541888946425-d81bb19240f5` |

Unsplash photos are used under the Unsplash License. View any of them at `https://unsplash.com/photos/<id>`.

## Missing assets and integrations

These are needed before launch:

1. **Representative photos.** The current cut outs come from the low resolution design reference, so they are slightly soft on large screens, and the wave is made by moving a still photo of the pen hand. For a sharper and more natural result, shoot a MOVA team member against a plain background and supply two transparent images with the same framing: the body (cropped at the waist, open contract folder in one hand, body edge straight where it meets the wall) and the pen hand on its own. Replace `rep-body-*` and `rep-hand-*`, then update `representativeGeometry` in `site.js` (`edgeRatio`, `aspect`, `handBox`) and the folder hotspot in `ContractScene.jsx` (`bookOrigin`).
2. **Optional representative video.** For a truly realistic wave, supply a transparent video and set `representativeVideo.webm` (and `.mov` for Safari) in `site.js`. The scene will use it instead of the two still layers.
3. **Form endpoint.** Set `VITE_FORM_ENDPOINT` (see above).
4. **Contact details.** Email, phone, address, opening hours.
5. **Social profile URLs.**
6. **Privacy policy and terms.** Placeholder text is shown in the dialogs.
7. **Fleet specifications.** Payload, load space, pallet spaces, trailer types and availability.
8. **Real service areas.** The coverage map is illustrative. To show confirmed locations, edit `NODES` and `ROUTES` in `Coverage.jsx`.
9. **Own fleet photography.** The vehicle cut outs come from the design reference and are soft when enlarged; real photos of MOVA vehicles would be sharper.

## Project structure

```
src/
  content/site.js          all editable copy and data
  lib/                     gsap setup, validation, submission adapter
  hooks/                   reveal animations, focus trap, scroll lock, form state
  context/UIContext.jsx    opens dialogs from anywhere
  components/              one file per section plus shared pieces
```
