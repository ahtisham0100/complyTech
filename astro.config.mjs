import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// @astrojs/sitemap is incompatible with astro@4.16.18 (crashes on build:done hook).
// Sitemap is maintained as a static file at /public/sitemap.xml — Astro copies it
// to /dist automatically on every build. Update /public/sitemap.xml when adding pages.
export default defineConfig({
  integrations: [react()],
  site: 'https://adacomplianceservices.tech',
  build: {
    inlineStylesheets: 'always',
  },
});
