import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://mycalcstool.com',
  trailingSlash: 'always',

  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
    }),
    tailwind(),
  ],

  output: 'static',

  build: {
    format: 'directory',
  },

  adapter: cloudflare()
});