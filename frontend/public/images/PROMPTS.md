# ChatGPT prompts for the site images

## How to use

1. Open a **new ChatGPT chat** and paste the **Style guide** message below first. Every image after that will
   share the same look.
2. Paste the prompts one at a time. If a result is close but not right, reply with a short fix ("darker
   background", "less text", "make the glow softer") instead of starting over.
3. Download each image, rename it to the file name shown, and put it in `frontend/public/images/<folder>/`.
   The site picks it up automatically.

**Sizes.** ChatGPT makes square (1024×1024), landscape (1536×1024) or portrait (1024×1536) images. Each prompt
says which one to request. Images that are bigger than the slot are fine; just crop to the shape listed.

**Formats.** Icons, 3D objects and phones need a **transparent background** (PNG). The gallery and office photos
must be **.jpg**: save them as JPG, or convert with `convert in.png out.jpg`.

---

## Style guide (paste this first)

```
You are the art director for "Nowcoin Digital", a premium crypto-finance brand (wallet, Visa debit card,
exchange, merchant payments, institutional custody, developer API). I will ask you for a series of images
for its website. Keep every image in this exact visual style:

- Look: high-end 3D product render, Blender/Octane quality, soft studio lighting, subtle depth of field.
- Palette: deep obsidian violet (#07060E, #110F1F), brand violet (#7C5CFF), neon lilac glow (#A58BFF,
  #E2D8FF), with tiny touches of pink (#F472B6) and sky blue (#60A5FA). No orange, no green, no gold.
- Materials: frosted glass, smoked glass, brushed dark metal, glowing neon-lilac edges (like light tubes
  embedded in the edges of objects), soft violet light bleeding up from the bottom edges.
- Mood: futuristic, calm, trustworthy, premium — like Apple product renders meets a sci-fi vault.
- Composition: clean, lots of breathing room, one clear subject.
- NEVER include real company logos, real coin logos, readable fine print, watermarks or signatures.
  Only use text when I explicitly ask for it.

Reply "Ready" and wait for my first request.
```

---

## 1. Feature icons (4) — features dome

Shown as small round icons (about 44 px) on dark **and** light backgrounds.
Request: **square, transparent background**. Files go in `features/`.

```
Make a set-matching 3D icon: a [SUBJECT], made of frosted violet glass with glowing neon-lilac edges
and a soft inner glow, seen in a 3/4 isometric view, centred, filling about 70% of the frame, tiny soft
shadow below. Mid-tone colours so it reads on both black and white backgrounds. Transparent background,
square image, no text.
```

Replace `[SUBJECT]` with:

| File           | Subject                                                                         |
| -------------- | ------------------------------------------------------------------------------- |
| `security.png` | shield with a small padlock in the centre                                       |
| `fast.png`     | lightning bolt with a short motion trail                                        |
| `support.png`  | rounded speech bubble with a small heart inside                                 |
| `global.png`   | glass globe with a checkmark badge on the front (stands for transparency/trust) |

---

## 2. Product icons (6) — menus, products page, gateway tiles

Request: **square, transparent background**. Files go in `products/icons/`.

```
Make a minimal 3D app-style icon of a [SUBJECT] in the same glass-and-neon style: frosted violet glass
body, glowing lilac edge highlights, soft rounded shapes, front 3/4 view, centred, filling 75% of the
frame. Simple and bold so it still reads at 40 pixels. Transparent background, square, no text.
```

| File           | Subject                                                       |
| -------------- | ------------------------------------------------------------- |
| `wallet.png`   | wallet with a glowing coin peeking out                        |
| `card.png`     | slim metal payment card tilted at an angle (no logos or text) |
| `exchange.png` | two curved arrows forming a circle (swap)                     |
| `pay.png`      | small storefront with an awning                               |
| `custody.png`  | round vault door with a handle wheel                          |
| `api.png`      | code brackets `< />` floating above a small glass block       |

---

## 3. Floating 3D object — over the highlight cards

The big render that floats across the three stat cards. Request: **square, transparent background**.
File: `highlights/float.png`.

```
A single hero 3D object: a thick glass coin standing on its edge, slightly tilted, with a bold embossed
letter "N" on its face. Smoked violet glass with glowing neon-lilac rim light, a few small glass cubes and
sparkles orbiting it, soft violet glow underneath. Dramatic studio lighting. Transparent background,
square image, object centred with some empty space around it.
```

---

## 4. "Three steps" images (3)

Request: **landscape**, then crop to 4:3 (800×600). Files go in `steps/`.

```
step-1.png:
A 3D render of a modern smartphone floating at a slight angle on a deep violet background. The screen
shows a clean dark sign-up screen with a glowing fingerprint/face-scan circle in the middle (no readable
text, only abstract UI shapes). Neon-lilac rim light on the phone edges, soft reflections below.

step-2.png:
A 3D render of glowing glass coins flowing in an arc into a small smoked-glass vault box with neon-lilac
edges, on a deep violet background. Sense of motion, soft particles, no text, no real coin logos.

step-3.png:
A 3D render of a sleek metal payment card hovering just above a minimal contactless payment terminal,
with soft lilac contactless waves between them, deep violet background, cinematic lighting. No logos,
no readable text.
```

---

## 5. Product screenshots (6) — showcase tabs, products pages

**Best option: use real screenshots of your apps.** AI-generated interfaces get the text wrong. Until you have
them, these make good "hero renders". Request: **landscape**, then crop to 16:10 (1600×1000).
Files go in `products/`.

```
A cinematic 3D render of a [DEVICE] floating at a gentle angle over a deep violet background, showing a
dark, elegant [SCREEN] in violet and lilac tones. Use abstract UI shapes, charts and cards instead of
readable words. Soft neon-lilac reflections, subtle glow under the device, premium product-photography
lighting. Landscape.
```

| File           | [DEVICE]                        | [SCREEN]                                                         |
| -------------- | ------------------------------- | ---------------------------------------------------------------- |
| `wallet.png`   | smartphone                      | crypto wallet home screen with a balance card and an asset list  |
| `card.png`     | smartphone next to a metal card | card management screen showing a virtual card and spending rings |
| `exchange.png` | laptop                          | trading dashboard with a candlestick chart and an order book     |
| `pay.png`      | tablet on a café counter        | merchant checkout screen with a large "paid" checkmark           |
| `custody.png`  | large desktop monitor           | security console with approval steps, keys and a shield icon     |
| `api.png`      | laptop                          | developer console with code blocks and a live request graph      |

---

## 6. Gallery (8) — "Nowcoin, wherever money moves"

Request: **landscape** (1536×1024 is already the right 3:2 shape). Save as **JPG** in `gallery/`.
Keep them cinematic and real-world, with violet accent lighting.

```
gallery-1.jpg — Card payments:
Close-up of a hand tapping a sleek dark metal card on a café payment terminal, warm evening light mixed
with violet neon accents, shallow depth of field, photorealistic. No logos or readable text.

gallery-2.jpg — Cross-border transfers:
A glowing violet globe made of dots with thin light arcs connecting cities, floating above a dark
reflective floor, cinematic.

gallery-3.jpg — Merchant checkout:
A modern boutique counter with a tablet showing a payment-success screen (abstract UI, no words),
soft violet lighting, photorealistic, shallow depth of field.

gallery-4.jpg — Portfolio view:
A person's hands holding a smartphone showing a dark portfolio chart in violet tones, night city bokeh
in the background, photorealistic. Face not visible.

gallery-5.jpg — Treasury approvals:
A sleek dark office desk with two monitors showing an approval dashboard (abstract UI), a hardware
security key glowing lilac on the desk, moody lighting.

gallery-6.jpg — Earn dashboard:
Floating 3D glass coins rising in steps like a growth chart, neon-lilac glow, deep violet background.

gallery-7.jpg — Developer console:
A developer's laptop on a dark desk at night, screen glowing with code in violet and white (no readable
code needed), soft keyboard backlight, cozy mood.

gallery-8.jpg — Metal card:
Studio product shot of a brushed dark-titanium payment card standing on its edge on black glass, a
neon-lilac light line reflected along its edge. No logos, no numbers.
```

---

## 7. Download section — app on phones

Request: **square, transparent background**. File: `cta/app-phones.png`.

```
Two modern smartphones floating side by side, one slightly in front and tilted, both showing a dark,
elegant crypto app in violet and lilac tones (balance card, small chart, payment button — abstract UI,
no readable text). Neon-lilac rim lights on the edges, soft violet glow beneath. Transparent background,
square image.
```

---

## 8. Company page banner

Request: **landscape**, then crop to 16:9 (1600×900). Save as **JPG**: `company/office.jpg`.

```
A modern, airy fintech office at dusk: long wooden desks, large windows with a city skyline, plants,
soft warm light mixed with subtle violet accent lighting on the walls. No people, no logos, no readable
text. Photorealistic, wide-angle, calm and premium.
```

---

## Images you should NOT generate with AI

| Slot                                  | Why, and what to use instead                                                                                                                                                                                                                                                                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `team/*.jpg` (team photos)            | They are presented as your real people. Use **real headshots**. For a matching look, you can upload a real photo to ChatGPT and ask: _"Keep this person exactly as they are; replace only the background with a smooth dark-violet studio gradient and add a soft lilac rim light. Portrait 4:5."_ |
| `avatars/*.jpg` (testimonial avatars) | Faces next to quotes look like real customers. Use **real customers' photos with their permission**, or leave them empty (the site shows a neutral placeholder).                                                                                                                                   |
| `chains/*.png` (Ethereum, Bitcoin…)   | AI distorts trademarked logos. Download the **official logos** from each project's brand or press kit.                                                                                                                                                                                             |
| `partners/*.svg` (partner logos)      | Only show **real partners**, using the logos they give you.                                                                                                                                                                                                                                        |
| `certifications/*.png` (SOC 2, ISO…)  | Only show badges the company **actually holds**, using the official artwork from the auditor or certifying body.                                                                                                                                                                                   |
