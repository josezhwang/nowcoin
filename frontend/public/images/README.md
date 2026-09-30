# Site images

Drop files here using the exact paths below — the site picks them up automatically (no code changes).
Until a file exists, its slot shows a dashed placeholder; in `npm run dev` the placeholder also prints the
expected path and size. All paths are defined in `src/config/images.ts`.

Tips: export at 2× the listed size for sharp screens is fine; use **PNG/WebP with transparency** for icons,
logos and 3D renders, and **JPG/WebP** for photos and screenshots.

| Path                                                        | Size (px) | Where it appears                                                     |
| ----------------------------------------------------------- | --------- | -------------------------------------------------------------------- |
| `hero/hero-art.png`                                         | 1800×1000 | 3D render behind the hero dashboard (bottom of the hero frame)       |
| `features/centerpiece.png`                                  | 900×900   | Centre of the "Why Nowcoin" section (3D object)                      |
| `features/security.png`                                     | 160×160   | Feature icon — Bank-grade security                                   |
| `features/fast.png`                                         | 160×160   | Feature icon — Lightning fast                                        |
| `features/support.png`                                      | 160×160   | Feature icon — Always helpful                                        |
| `features/global.png`                                       | 160×160   | Feature icon — Global by default                                     |
| `features/fees.png`                                         | 160×160   | Feature icon — Transparent fees                                      |
| `features/compliance.png`                                   | 160×160   | Feature icon — Fully regulated                                       |
| `products/{wallet,card,exchange,pay,custody,api}.png`       | 1600×1000 | Product screenshots (showcase tabs, Products page, product pages)    |
| `products/icons/{wallet,card,exchange,pay,custody,api}.png` | 128×128   | Product icons (Products menu, Products page)                         |
| `partners/partner-1.svg` … `partner-6.svg`                  | 240×80    | Partner logo row under the hero                                      |
| `certifications/{soc2,iso27001,pci-dss,mica}.png`           | 200×200   | Certification badges in the Security section                         |
| `steps/step-1.png` … `step-3.png`                           | 800×600   | "Three steps" cards                                                  |
| `security/security-visual.png`                              | 1200×1000 | Security section visual                                              |
| `cta/app-phones.png`                                        | 1000×1000 | Download section (app on phones)                                     |
| `company/office.jpg`                                        | 1600×900  | Company page banner                                                  |
| `team/<member-slug>.jpg`                                    | 800×1000  | Team portraits (slugs come from `/api/team`, e.g. `elena-marsh.jpg`) |
| `avatars/<name-slug>.jpg`                                   | 160×160   | Testimonial and hero avatars (e.g. `amara-okafor.jpg`)               |

Current team slugs: `elena-marsh`, `daniel-okoye`, `mei-tanaka`, `lucas-ferreira`, `aisha-rahman`, `jonas-berg`,
`sofia-alvarez`, `kwame-mensah`. Avatar slugs: `amara-okafor`, `jonas-weber`, `priya-raman`, `leo-martins`,
`sofia-chen`.
