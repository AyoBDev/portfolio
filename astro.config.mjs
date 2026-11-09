// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE_URL } from './site-url.mjs';

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
});
