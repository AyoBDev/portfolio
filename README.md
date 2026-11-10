# Ayomikun Ayobami: portfolio

A fast, static portfolio site built with [Astro](https://astro.build). It opens with a short quiz that puts the most relevant sections first, and it works fully without JavaScript.

## Run it locally

You need Node 22 (`.nvmrc` is set, so `nvm use` picks it).

```sh
npm install
npm run dev        # http://localhost:4321
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the site into `dist/` |
| `npm run preview` | Serves the built site |
| `npm run check` | Type-checks the project |
| `npm test` | Unit tests |
| `npm run test:e2e` | Browser tests (run `npx playwright install chromium` once first) |
| `npm run lhci` | Lighthouse check (needs a build; all four scores must be at least 95) |

## Where to edit things

- **Text:** all wording lives in `src/content/copy.ts`.
- **Data:** projects, experience, certifications, skills and articles are in the other files in `src/content/`.
- **Name, email, links:** `src/config/site.ts`.
- **Share image:** `public/og.png` is generated from `scripts/og.html`. Open that file in a browser at 1200x630 and take a screenshot to refresh it.

## Adding images

- **Bitmoji poses:** drop PNGs into `src/assets/mascot/`, named after the pose: `wave.png`, `thinking.png`, `pointing.png`, `celebrating.png`, `contact.png`. Any pose without a PNG falls back to the placeholder. No code change is needed.
- **Badge images:** put the files in `public/badges/` and set each certification's `badgeImage` (for example `/badges/aws-sap.png`) in `src/content/certifications.ts`. The field exists in the data, but the page does not display badge images yet; showing them needs a small change in `src/components/sections/Certifications.astro`.

## Changing the domain

The site address is read from the `PUBLIC_SITE_URL` environment variable and defaults to `https://ayomikun-ayobami.pages.dev`. It feeds the canonical link, share tags, sitemap and `robots.txt`. To use a custom domain, set `PUBLIC_SITE_URL` (for example `https://example.com`) and rebuild.

## Deploying to Cloudflare Pages

This is done once by Ayomikun in the Cloudflare dashboard. No credentials are stored in this repository.

1. In Cloudflare, go to **Workers & Pages**, then **Create**, then **Pages**, then **Connect to Git**, and choose this GitHub repository.
2. Set the framework preset to **Astro**.
3. Build command: `npm run build`. Build output directory: `dist`.
4. Under environment variables add `NODE_VERSION` = `22`, and optionally `PUBLIC_SITE_URL` if you use a custom domain.
5. Save and deploy. Every push to the production branch redeploys automatically.

GitHub Actions (`.github/workflows/ci.yml`) only runs checks and tests. It does not deploy.
