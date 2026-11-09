// Single source of truth for the deployed origin. Imported by astro.config.mjs
// (canonical URLs, sitemap) and by src code (JSON-LD, robots.txt, og tags).
// Override with the SITE_URL env var once a custom domain exists.
export const SITE_URL = process.env.SITE_URL ?? 'https://ayomikun-ayobami.pages.dev';
