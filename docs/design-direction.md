# Design direction (v2, 17 Oct 2026)

## What the leading houses do

Studied: Amouage, Maison Francis Kurkdjian, Diptyque, Kilian, Byredo, Le Labo, Xerjoff, Ajmal.

1. **Restraint.** Warm paper or white backgrounds and ink text. Colour comes from photography, not
   from the interface. Gold appears as a material in photographs, almost never as gradient text.
2. **A quiet frame.** Slim announcement bar, centred wordmark, small spaced capitals for navigation.
3. **Image first.** A full-bleed photograph, one line of copy, one rectangular button.
4. **Product cards carry little.** Image on a quiet backdrop, the name, one descriptor line, a price.
   Quick add sits on the image; sizes are chosen on the product page or in a small sheet.
5. **Product pages follow one pattern.** Large images on the left; on the right the name, a
   descriptor line, the price, size boxes, quantity, one full-width black button, gift options,
   then folded sections for the details.
6. **Type.** A refined serif for names (MFK uses Bodoni) and a quiet sans for everything else.
7. **Sharp corners, hairlines, space.** Motion is slow and slight.

The generic look to avoid (seen at Ajmal, and in this site's first version): gold geometry
everywhere, gradient gold lettering, pill buttons, dense price tables on every card.

## Arabian Musk's own identity

- **Signature image: sunlight through a jaali.** An arched window of carved eight-pointed stars
  throws patterned light on a plaster wall. It appears in every photograph and as the faint
  texture of the dark sections. No other perfume site uses it.
- **One bottle family.** Every scent is sold in the same bottles, so every scent is photographed in
  the same perfume bottle and crystal attar flacon. The website sets each scent's name on the black
  label, so 102 scents share one consistent set of renders (`scripts/render/scene.py`).
- **A perfumer's register.** Each scent carries its number from the shop's own price list:
  "N° 28", with the Eastern Arabic numeral beside it.
- **Palette.** Paper `#F6F1E9`, plaster `#ECE3D6`, ink `#1D1813`, oud `#231A14` for the few dark
  sections, brass `#9A7748` for hairlines and small accents. No gradients.
- **Type.** Bodoni Moda for names and headings, Jost for the interface. The Arabic name in Aref Ruqaa
  is the one ornamental flourish, used once per page.
- **Honesty.** Images are renders of the shop's bottle formats and say so where a customer chooses;
  "inspired by" names stay labelled, with the not-affiliated note.
