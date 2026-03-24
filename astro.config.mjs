import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mycalcstool.com',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date(),
      customPages: [
        'https://mycalcstool.com/loan',
        'https://mycalcstool.com/salary',
        'https://mycalcstool.com/bmi',
        'https://mycalcstool.com/compound',
        'https://mycalcstool.com/calorie',
        'https://mycalcstool.com/severance',
        'https://mycalcstool.com/due-date',
        'https://mycalcstool.com/tdee',
        'https://mycalcstool.com/dday',
        'https://mycalcstool.com/tax-refund',
      ],
    }),
    tailwind(),
  ],
  output: 'static',
  build: {
    format: 'directory',
  },
});
