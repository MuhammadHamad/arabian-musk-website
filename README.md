# Arabian Musk website

Public website for Arabian Musk, an attar and perfume shop at Malogo Chowk, Jhagra, Peshawar.
Live at https://arabianmusk.co. It is separate from the Arabian Musk management app and shares no
code or database with it.

Visitors browse all scents with prices, tap sizes to build an order, and send the order to the shop
on WhatsApp. There is no backend: the order lives in the visitor's browser until they send it.

## Stack

Next.js 16 (App Router, every page static), React 19, Tailwind CSS 4, hosted on Vercel. Pushing to
`main` deploys production.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Where to change things

| What | File |
|---|---|
| WhatsApp number, address, hours, Instagram/Facebook/TikTok | `src/content/site.ts` (anything `null` is hidden) |
| Scent names and prices | `src/content/scents.ts` |
| Questions and answers | `src/content/faqs.ts` |
| Collections (Best Sellers, Oud & Musk, …) | `src/content/collections.ts` |
| Home page sections | `src/app/page.tsx` |
| Colours, type, buttons | `src/app/globals.css` |

Each scent has five prices: attar 12 ml and perfume 10, 30, 50 and 100 ml. `rank` is the scent's
place by bottles sold in the shop's records (Sep 2025 to Sep 2026); the top 8 show a "Best seller"
badge. `inspiredBy` names the famous perfume a scent is modelled on and is shown as
"Inspired by …"; leave it out when unsure.

A new scent needs a unique `slug`, which becomes its address: `/scents/<slug>`.

## Photography

Every image is a render of the shop's two bottle formats, made in Blender 4.2 (Cycles) by
`scripts/render/scene.py`, in four settings: plaster with sunlight through a jaali, white marble,
dark wood against an amber wall, and desert sand at dusk. The perfume label is left blank and the
site sets each scent's name and number on it; each scent gets a setting from its number
(`sceneFor` in `src/lib/scent.ts`), so 102 scents share six renders in `src/assets/renders/`.

```bash
blender -b --factory-startup --python scripts/render/scene.py -- perfume out.png 1.0 160 marble
```

Shots: `perfume`, `attar`, `hero` (2400 × 1350), `hero_tall` (1200 × 1600). Settings: `plaster`,
`marble`, `wood`, `sand`, `amber` (heroes). Each run prints where the label lands in the frame; those
numbers live in `src/lib/renders.ts`. The camera and bottle are the same in every setting, so one
box serves all perfume renders; if the camera or bottle moves, update them. Convert the PNG to JPEG (`sips -s format jpeg -s formatOptions 86`) before committing.
Real photographs of the shop's bottles can replace these files later.

The look follows aldeenfragrances.com at the owner's request; what was taken and what is ours is in `docs/design-direction.md`.

## Facts the copy relies on

These come from the shop's own records; change the wording if the shop changes how it works.

- Every perfume is 40% oil (true of all 487 perfume sales recorded).
- Attars are pure oil with no alcohol.
- Attars are sold in sizes below 12 ml (3 ml and 6 ml are common), priced on request.
- Two oils can be mixed in one bottle; bottles can go out in a gift box.

## Domain

`arabianmusk.co` is registered at Spaceship and points to Vercel through DNS records set there.
