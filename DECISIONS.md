# Decisions

## 2026-11-09 - Portfolio site: Astro, adopt core, build quiz

**Need:** static, SEO-friendly portfolio with a custom lime/navy brand and a small recruiter quiz that reorders sections; works without JS; Cloudflare Pages free tier.

**Options considered (signals read from GitHub on 2026-11-09):**
- Astro core (MIT): 63.8k stars, commits daily, 19 open issues, official `@astrojs/sitemap` in the same monorepo, official Cloudflare Pages static guide (docs updated Apr 2026). Adopt.
- Astro themes (AstroPaper, MIT: 5.2k stars, 3 open issues; Astro Theme Pure, Apache-2.0: 1.1k stars): healthy, but both are blog/docs themes with their own design system and Tailwind/UnoCSS; they would fight the custom brand. Skip.
- Quiz/stepper libs: Shoelace is archived (now Web Awesome); petite-vue is stale (107 commits, effectively unmaintained); Alpine.js (MIT, active) and Shepherd (commercial licence) add a runtime or licence cost for what is a few hundred lines of logic. Skip.

**Choice:** Astro + `@astrojs/sitemap`, deployed as static output to Cloudflare Pages. Build the quiz as about 150 lines of vanilla TypeScript, progressively enhancing server-rendered HTML so the page works without JS.

**Why:** no suitable theme or quiz component fits the brand without overriding most of it, and a framework runtime for this little logic costs more than it saves.
