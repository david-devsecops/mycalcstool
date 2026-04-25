import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

const excludedSitemapPaths = new Set([
  '/en/blog/age-calculator-guide-how-old-am-i/',
  '/en/blog/bmi-calculator-guide/',
  '/en/blog/calorie-deficit-guide-using-tdee/',
]);

export default defineConfig({
  site: 'https://mycalcstool.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
      filter: (page) => {
        const pathname = new URL(page).pathname;
        return !excludedSitemapPaths.has(pathname);
      },
    }),
    tailwind(),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
});
