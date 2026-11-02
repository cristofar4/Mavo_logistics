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
| Hero | Editorial split, staggered headline, masked image reveal with a settling zoom |
| Services | Asymmetric mosaic with angled image edges. Hover, keyboard focus or touch reveals more detail; each card opens a service detail dialog with a quote shortcut |
| Contract scene | The signature animation (see below) |
| Our fleet | Accessible tabs (arrow keys, Home, End) with image wipes. Unknown specs show "To be confirmed" |
| Coverage | Dotted world map with route lines that draw in. Clearly labelled as illustrative |
| Industries | Editorial index with a crossfading image stage |
| Process | Three steps joined by a line that draws in on scroll |
| About | Editorial photo layout and three value statements |
| FAQ | Accessible accordion with animated expansion |
| Contact and footer | Quote action, contact details, navigation, service links, social links, privacy and terms dialogs |

### The contract scene

`src/components/ContractScene.jsx` and `src/components/ContractBook.jsx`

1. When about 35% of the section has entered the viewport, a GSAP timeline plays once: the representative rises from behind the ivory parapet wall (1.1s), a cast shadow and contact shadow follow, the cloud bubble pops in near his head (0.4s), then the headline and action appear (0.5s).
2. The cloud asks **"Ready to sign with us?"** with **Yes** and **Not yet**.
3. **Yes** (or **Let’s work together**) makes the contract book fly out of the representative’s folder to the centre of the screen while the page behind blurs. The cover swings open to reveal a two page enquiry form with a signature pad (draw with mouse, pen or finger, or type your name).
4. **Sign** validates the form, closes the cover, flies the book back to the representative, removes the blur and the cloud says thank you. In demo mode the thank you message clearly says nothing was sent.
5. Closing the book without signing returns the cloud to a friendly "No rush" message.

Layers, back to front: back wall with an arched opening, pillar, cast shadow, representative, front parapet, cloud. The representative is never faded over the wall; the parapet physically occludes him as he rises. After the entrance only a very slow breathing movement remains. With `prefers-reduced-motion: reduce` the finished scene is shown immediately and the book opens without movement.

## Editing content

All copy, contact details, socials, image references, FAQ answers and legal text live in **`src/content/site.js`**. House style: no hyphens or dash punctuation in visible copy.

Values set to `null` (email, phone, address, hours, social URLs, fleet specs) render as clearly marked placeholders such as "Email address to be added". Social entries only become links once a URL is supplied, so there are no dead links.

## Images

Images are in `public/images` as WebP at 800 and 1600 pixels wide (`name-800.webp`, `name-1600.webp`). They carry width and height to reserve layout space, and everything below the hero is lazy loaded. To replace an image, export both sizes with the same name and update `w`/`h` in `src/content/site.js` if the aspect ratio changes.

| File | Source |
| --- | --- |
| `hero-port`, `road`, `air`, `sea` | Supplied by MOVA |
| `representative` | Cut out of the supplied design reference, upscaled and background removed (see below) |
| `warehouse` | Unsplash photo `1616401784845-180882ba9ba8` |
| `about` | Unsplash photo `1586528116311-ad8dd3c8310d` |
| `retail` | Unsplash photo `1566576721346-d4a3b4eaeb55` |
| `manufacturing` | Unsplash photo `1567789884554-0b844b597180` |
| `agriculture` | Unsplash photo `1500937386664-56d1dfef3854` |
| `construction` | Unsplash photo `1541888946425-d81bb19240f5` |
| `fleet-van` | Unsplash photo `1612630741022-b29ec17d013d` |
| `fleet-cargo` | Unsplash photo `1519003722824-194d4455a60c` |
| `fleet-heavy` | Unsplash photo `1591768793355-74d04bb6608f` |
| `world-dots.svg` | Generated from Natural Earth land data (public domain) |

Unsplash photos are used under the Unsplash License. View any of them at `https://unsplash.com/photos/<id>`.

## Missing assets and integrations

These are needed before launch:

1. **Representative photo.** The current cut out comes from the low resolution design reference, so it is slightly soft on large screens. Replace `public/images/representative-800.webp` and `representative-1600.webp` with a real, high resolution transparent photo: a MOVA team member cropped at the waist, holding an open contract folder in their left hand and offering a pen with their right, body edge straight on the left where it meets the pillar. Keep the same framing or adjust the hotspot in `ContractScene.jsx` (`bookOrigin`) and the `0.143` pillar ratio in `index.css`.
2. **Optional representative video.** For realistic hand movement, supply a transparent video and set `representativeVideo.webm` (and `.mov` for Safari) in `site.js`. The scene will use it instead of the still.
3. **Form endpoint.** Set `VITE_FORM_ENDPOINT` (see above).
4. **Contact details.** Email, phone, address, opening hours.
5. **Social profile URLs.**
6. **Privacy policy and terms.** Placeholder text is shown in the dialogs.
7. **Fleet specifications.** Payload, load space, pallet spaces, trailer types and availability.
8. **Real service areas.** The coverage map is illustrative. To show confirmed locations, edit `NODES` and `ROUTES` in `Coverage.jsx`.
9. **Own fleet photography.** The fleet section uses stock photos; MOVA branded vehicles would be stronger.

## Project structure

```
src/
  content/site.js          all editable copy and data
  lib/                     gsap setup, validation, submission adapter
  hooks/                   reveal animations, focus trap, scroll lock, form state
  context/UIContext.jsx    opens dialogs from anywhere
  components/              one file per section plus shared pieces
```
