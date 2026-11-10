// Single source of truth for the deployed origin. Imported by astro.config.mjs
// (canonical URLs, sitemap) and by src code (JSON-LD, robots.txt, og tags).
// Override with the PUBLIC_SITE_URL env var once a custom domain exists (SITE_URL also works).
const DEFAULT_SITE_URL = 'https://ayomikun-ayobami.pages.dev';
export const SITE_URL = process.env.PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL;
