import { readFileSync } from 'node:fs';

const files = {
  home: readFileSync('src/pages/index.astro', 'utf8'),
  monetizationHead: readFileSync('src/components/MonetizationHead.astro', 'utf8'),
  moving: readFileSync('src/pages/moving-cost-calculator.astro', 'utf8'),
};

const checks = [
  ['home headline frames the site as a money and cost decision hub', files.home.includes('생활비·금융·AI 비용 계산기 허브')],
  ['home prioritizes moving-cost calculator above long-tail utility lists', files.home.indexOf('/moving-cost-calculator/') < files.home.indexOf('주식·ETF 계산기')],
  ['home keeps weak health/general utility categories out of the front page data model', !files.home.includes("'건강'")],
  ['home has a primary moving CTA event', files.home.includes('data-ga-event="home_primary_moving_click"')],
  ['home has a primary finance CTA event', files.home.includes('data-ga-event="home_primary_finance_click"')],
  ['home has a primary AI CTA event', files.home.includes('data-ga-event="home_primary_ai_click"')],
  ['global GA click listener sends data-ga-event clicks', files.monetizationHead.includes('data-ga-event') && files.monetizationHead.includes("gtag('event'")],
  ['moving calculator tracks estimate clicks', files.moving.includes('data-ga-event="moving_estimate_calculated"')],
  ['moving affiliate CTA tracks sponsored handoff clicks', files.moving.includes('data-ga-event="moving_affiliate_click"')],
];

const failed = checks.filter(([, passed]) => !passed);

if (failed.length) {
  console.error('Growth homepage checks failed:');
  for (const [name] of failed) console.error(`- ${name}`);
  process.exit(1);
}

console.log(`Growth homepage checks passed (${checks.length}/${checks.length})`);
