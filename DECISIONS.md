# Decisions

## 2026-11-09 - Portfolio site: Astro, adopt core, build quiz

**Need:** static, SEO-friendly portfolio with a custom lime/navy brand and a small recruiter quiz that reorders sections; works without JS; Cloudflare Pages free tier.

**Options considered (signals read from GitHub on 2026-11-09):**
- Astro core (MIT): 63.8k stars, commits daily, 19 open issues, official `@astrojs/sitemap` in the same monorepo, official Cloudflare Pages static guide (docs updated Apr 2026). Adopt.
- Astro themes (AstroPaper, MIT: 5.2k stars, 3 open issues; Astro Theme Pure, Apache-2.0: 1.1k stars): healthy, but both are blog/docs themes with their own design system and Tailwind/UnoCSS; they would fight the custom brand. Skip.
- Quiz/stepper libs: Shoelace is archived (now Web Awesome); petite-vue is stale (107 commits, effectively unmaintained); Alpine.js (MIT, active) and Shepherd (commercial licence) add a runtime or licence cost for what is a few hundred lines of logic. Skip.

**Choice:** Astro + `@astrojs/sitemap`, deployed as static output to Cloudflare Pages. Build the quiz as about 150 lines of vanilla TypeScript, progressively enhancing server-rendered HTML so the page works without JS.

**Why:** no suitable theme or quiz component fits the brand without overriding most of it, and a framework runtime for this little logic costs more than it saves.

**Hosting note (Cloudflare Pages vs Workers static assets):** Pages is chosen because its Git integration deploys a static `dist` for free with no config. Cloudflare's docs now point new projects toward Workers static assets (not re-verified at the time of this note); revisit and migrate if Pages is deprecated.

## 2026-11-10 - Downloadable ATS-friendly CV: adopt PDFKit, build the CV from site data

**Need:** a prominent "Download CV" that applicant tracking systems parse cleanly (one column, real text, standard headings) and that can never drift from the site.

**Options considered (GitHub signals read on 2026-11-10):**
- PDFKit (MIT): 10.7k stars, pushed 2026-11-03, 318 open issues. Pure Node and writes real text with the standard PDF fonts, so it runs inside `astro build` on Cloudflare with no browser. Adopt.
- pdfmake (12.4k stars, active): declarative and built on PDFKit, but its licence field doesn't resolve on GitHub and the layout here is simple enough not to need it. Skip.
- jsPDF (MIT, 31.3k stars, active): aimed at the browser; text flow and page breaks are more manual than PDFKit. Skip.
- React-PDF (MIT, 16.9k stars): needs React and its renderer only for this. Skip.
- Print the page to PDF with Playwright (Apache-2.0, 99.8k stars): already a dev dependency, but needs Chromium during the Cloudflare build. Skip.
- pdf-lib (MIT, 8.7k stars): last pushed 2024-07. Skip.
- Publishing the existing resume PDF as-is: its dates and project names disagreed with the site. Skip.

**Choice:** `src/lib/cv/buildCvDocument.ts` turns the site content into a CV model, `renderCvPdf.ts` draws it with PDFKit, and `src/pages/Ayomikun-Ayobami-CV.pdf.ts` writes it to `dist/` on every build. Tests extract the PDF text with pdf.js, like an ATS would, and check order, page count and the privacy deny-list.

**Why:** one source of truth for the site and the CV, no extra runtime on the page, and nothing to remember to regenerate.
