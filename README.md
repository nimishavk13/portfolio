# Nimisha Vk – UI/UX Portfolio

Built from the Figma file *Nimisha VK_UI-UX Portfolio_Project 1*. Static site (Astro), hosted on Vercel.

## Editing content

| What | Where |
| --- | --- |
| Homepage hero (frame 1) | `src/components/Hero.astro`, motion in `src/scripts/hero.ts` |
| Intro / About / Process | `src/components/Intro.astro`, `About.astro`, `Process.astro` |
| Selected work cards | `src/data/projects.ts` (titles, one-liners, images) |
| Contact details / ending | `src/components/CaseEnding.astro` |
| Case-study text | `src/data/cases/<project>.json` – each frame's `lines` (desktop) and `paras` (phones) |
| Images | `public/img/…` |

Edit a file on GitHub (pencil icon → *Commit changes*) and Vercel redeploys in about a minute.

When a case study changes a lot in Figma, regenerate it instead of hand-editing:
export the portfolio page from Figma as PDF, then run `tools/build_cases.py` (see the notes at the top of that file).

## Local preview

```
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in dist/
```
