import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import { approvalNoIndexPathSet, withTrailingSlash } from './src/data/approval-noindex-paths.mjs';

export default defineConfig({
  site: 'https://mycalcstool.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
      filter: (page) => {
        const pathname = withTrailingSlash(new URL(page).pathname);
        return !approvalNoIndexPathSet.has(pathname);
      },
    }),
    tailwind(),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
});
