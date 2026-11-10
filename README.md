# Nimisha Vk – UI/UX Portfolio

Static site built with Astro + GSAP, hosted on Vercel. Content comes from the portfolio PDF / Figma file.

## Where things live

| What | Where |
| --- | --- |
| Homepage sections (hero, work, process, about, contact) | `src/components/home/` |
| Homepage scroll animation | `src/scripts/home.ts` |
| Project cards, colours, cover text | `src/data/projects.ts` |
| Case-study text (one file per project) | `src/data/cases/<project>.ts` |
| Case-study layouts | `src/components/case/` and `src/styles/case.css` |
| Colours, fonts, spacing | `src/styles/tokens.css` |
| Images | `public/img/v2/` and `public/img/home/` |

To fix wording, edit the sentence in `src/data/cases/<project>.ts` on GitHub (pencil icon → Commit changes). Vercel redeploys in about a minute.
`**bold**` and `==highlight==` work inside case-study text.

Animations respect the visitor's "reduce motion" setting: everything still shows, it just doesn't move.

## Local preview

```
npm install
npm run dev      # http://localhost:4321
npm run build    # production build in dist/
```
