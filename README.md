# Ayomikun Ayobami: portfolio

My portfolio site: **[portfolio.ayomikun939.workers.dev](https://portfolio.ayomikun939.workers.dev)**

I'm a Systems & Cloud Engineer. The site opens with a 30-second quiz that asks what you're hiring for and what would convince you, then puts the most relevant work first. You can skip it at any time, and the full page works without JavaScript.

## Built with

- [Astro](https://astro.build), static output, no client framework
- Under 300 lines of vanilla TypeScript for the quiz, layered on server-rendered HTML
- Hosted on Cloudflare Workers as static assets

## Quality checks

Every push runs these in GitHub Actions:

- Type checking (`astro check`)
- Unit tests (Vitest) for the quiz logic and content
- Browser tests (Playwright), including keyboard use, reduced motion, a no-JavaScript run, and no sideways scrolling at 320px
- Accessibility scans with axe on every quiz step and the full page
- Lighthouse, with all four scores required to be at least 95

## Run it locally

You need Node 22 (`.nvmrc` is set, so `nvm use` picks it).

```sh
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the site into `dist/` |
| `npm run preview` | Serves the built site |
| `npm run check` | Type-checks the project |
| `npm test` | Unit tests |
| `npm run test:e2e` | Browser tests (run `npx playwright install chromium` once first) |
| `npm run lhci` | Lighthouse check (needs a build) |
