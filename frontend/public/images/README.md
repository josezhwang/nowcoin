# Site images

Drop files here using the exact paths below — the site picks them up automatically (no code changes).
Until a file exists, its slot shows a dashed placeholder; in `npm run dev` the placeholder also prints the
expected path and size. All paths are defined in `src/config/images.ts`.

Need artwork? `PROMPTS.md` in this folder has ready-to-paste ChatGPT prompts for every slot.

Tips: export at 2× the listed size for sharp screens is fine; use **PNG/WebP with transparency** for icons,
logos and 3D renders, and **JPG/WebP** for photos and screenshots.

| Path                                                        | Size (px) | Where it appears                                                     |
| ----------------------------------------------------------- | --------- | -------------------------------------------------------------------- |
| `features/security.png`                                     | 160×160   | Features dome node — Robust Security                                 |
| `features/fast.png`                                         | 160×160   | Features dome node — Lightning Fast                                  |
| `features/support.png`                                      | 160×160   | Features dome node — Always Helpful                                  |
| `features/global.png`                                       | 160×160   | Features dome node — Complete Transparency                           |
| `products/{wallet,card,exchange,pay,custody,api}.png`       | 1600×1000 | Product screenshots (showcase tabs, Products page, product pages)    |
| `products/icons/{wallet,card,exchange,pay,custody,api}.png` | 128×128   | Product icons (Products menu, Products page)                         |
| `chains/{ethereum,bitcoin,solana,polygon,base}.png`         | 128×128   | Blockchain tiles on the gateway diagram (round, transparent)         |
| `highlights/float.png`                                      | 640×640   | 3D render floating over the three highlight cards (transparent PNG)  |
| `steps/step-1.png` … `step-3.png`                           | 800×600   | Screenshots in the "three steps" cards                               |
| `gallery/gallery-1.jpg` … `gallery-8.jpg`                   | 1200×800  | Scrolling gallery ("Nowcoin, wherever money moves")                  |
| `partners/partner-1.svg` … `partner-6.svg`                  | 240×80    | Partner logo row under the hero                                      |
| `certifications/{soc2,iso27001,pci-dss,mica}.png`           | 200×200   | Certification badges in the footer                                   |
| `cta/app-phones.png`                                        | 1000×1000 | Download section (app on phones)                                     |
| `company/office.jpg`                                        | 1600×900  | Company page banner                                                  |
| `team/<member-slug>.jpg`                                    | 800×1000  | Team portraits (slugs come from `/api/team`, e.g. `elena-marsh.jpg`) |
| `avatars/<name-slug>.jpg`                                   | 160×160   | Testimonial and hero avatars (e.g. `amara-okafor.jpg`)               |

Current team slugs: `elena-marsh`, `daniel-okoye`, `mei-tanaka`, `lucas-ferreira`, `aisha-rahman`, `jonas-berg`,
`sofia-alvarez`, `kwame-mensah`. Avatar slugs: `amara-okafor`, `jonas-weber`, `priya-raman`, `leo-martins`,
`sofia-chen`.
