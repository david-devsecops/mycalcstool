# MyCalcsTool Insight Automation Current State

Analysis date: 2026-09-02

Repository: `D:\02_Dev\03_Web\website\mycalcstool`

Production URL: `https://mycalcstool.com/`

## Executive Summary

MyCalcsTool is currently an Astro static site deployed in a Cloudflare Pages-compatible shape. The existing calculator routes are client-side/static and should remain the core asset. The repository already contains a local Insight Automation MVP layer: article routes, calculator metadata, source validation, article candidate generation, quality gates, publishing limits, Search Console CSV import, GA4 article-interaction CSV import, and local report generation.

The current architecture is suitable for the first validation phase because it protects existing SEO, avoids server-side storage of sensitive calculator inputs, and keeps operating cost close to zero. The next major Cloudflare pieces, such as Workers, D1, KV, Queues, and Cron, are not present in the repository and should remain deferred until Search Console and calculator-click data show enough demand.

Phase 0 review result: do not rebuild the site around a new news system. The safer path is to preserve the static calculator site, keep `/articles/` as the issue-to-calculator bridge, and operate the automation pipeline locally until search and click data justify Cloudflare runtime automation.

## 1. Framework

- Framework: Astro 5
- Styling: Tailwind CSS
- Rendering mode: static output
- Site URL: `https://mycalcstool.com`
- Trailing slash policy: enabled through Astro config and `_redirects`
- Build format: directory output

Relevant files:

- `astro.config.mjs`
- `package.json`
- `tailwind.config.mjs`
- `src/styles/global.css`

## 2. Runtime

Production runtime is static HTML, CSS, and browser JavaScript. There is no repository-owned backend runtime, API server, Worker, or database runtime in the current codebase.

Calculator behavior is client-side. This matches the privacy requirement because user-entered financial, salary, health, or investment values are not sent to an application server by default.

## 3. Directory Structure

Primary structure:

- `src/pages/`: Astro routes
- `src/components/`: shared UI, SEO, CTA, monetization, related content
- `src/layouts/`: page layouts
- `src/data/`: calculator metadata, articles, SEO/noindex controls, site config, tax/rate JSON
- `src/lib/insights/`: local insight automation modules
- `scripts/insights/`: local collection, generation, publishing, report, and test scripts
- `public/`: static Cloudflare Pages files such as `_headers`, `_redirects`, `robots.txt`, `ads.txt`
- `docs/`: strategy and implementation documents
- `data/insights/`: local runtime queue/report data, Git-tracked only through `.gitkeep`

## 4. Package Manager And Build System

Package manager: npm

Important npm scripts:

- `npm run build`: production Astro build
- `npm run update:ads-txt`: prebuild ads.txt generation
- `npm run insights:test`: insight automation test suite
- `npm run insights:collect:naver`: Naver issue collection
- `npm run insights:pipeline`: local end-to-end insight pipeline
- `npm run insights:generate:articles`: article candidate generation
- `npm run insights:publish:plan`: publication planning
- `npm run insights:publish:articles`: manual approved article write
- `npm run insights:metrics:import`: Search Console CSV import
- `npm run insights:metrics:import:ga4`: GA4 article interaction CSV import
- `npm run insights:report`: local insight report generation
- `npm run insights:verify:sitemap`: built sitemap verification

Dependencies are intentionally small:

- `astro`
- `@astrojs/sitemap`
- `@astrojs/tailwind`
- `tailwindcss`

## 5. Cloudflare Deployment

The repository matches Cloudflare Pages static deployment.

Present:

- `public/_headers`
- `public/_redirects`
- `public/robots.txt`
- `public/ads.txt`
- static ownership verification file for Naver

Not present:

- `wrangler.toml`
- Cloudflare Worker source
- D1 migrations
- KV binding config
- R2 binding config
- Queue binding config
- Cron trigger config
- `.openai/hosting.json`

Recommendation: keep Phase 1 as static build plus local scripts. Add Cloudflare Workers/D1/Cron only after 30 to 90 days of search and calculator-conversion data.

## 6. Current Routes

Core Korean routes:

- `/`
- `/about/`
- `/contact/`
- `/methodology/`
- `/privacy/`
- `/terms/`

Current issue article routes:

- `/articles/`
- `/articles/base-rate-loan-interest-impact/`
- `/articles/year-end-tax-refund-paycheck-impact/`
- `/articles/openai-api-price-change-cost-planning/`

Current blog routes:

- `/blog/`
- `/blog/*`

English routes:

- `/en/`
- `/en/about/`
- `/en/contact/`
- `/en/methodology/`
- `/en/privacy/`
- `/en/terms/`
- `/en/blog/*`

## 7. Calculator Routes

Korean high-priority calculators:

- `/loan/`
- `/salary/`
- `/tax-refund/`
- `/compound/`
- `/severance/`
- `/stock-average-calculator/`
- `/stock-averaging-down-calculator/`
- `/stock-return-calculator/`
- `/dividend-calculator/`
- `/dividend-yield-calculator/`
- `/foreign-stock-return-calculator/`
- `/etf-investment-calculator/`
- `/ai-token-calculator/`
- `/chatgpt-api-cost-calculator/`
- `/ai-model-cost-comparison/`
- `/moving-cost-calculator/`

Supporting Korean calculators:

- `/bmi/`
- `/calorie/`
- `/tdee/`
- `/due-date/`
- `/dday/`
- `/age-calculator/`
- `/percentage-calculator/`
- `/unit-converter/`
- `/tip-calculator/`

English calculator routes:

- `/en/mortgage-calculator/`
- `/en/salary-calculator/`
- `/en/compound-interest-calculator/`
- `/en/stock-average-calculator/`
- `/en/stock-averaging-down-calculator/`
- `/en/stock-return-calculator/`
- `/en/dividend-calculator/`
- `/en/dividend-yield-calculator/`
- `/en/foreign-stock-return-calculator/`
- `/en/etf-investment-calculator/`
- `/en/ai-token-calculator/`
- `/en/chatgpt-api-cost-calculator/`
- `/en/ai-model-cost-comparison/`
- `/en/bmi-calculator/`
- `/en/calorie-calculator/`
- `/en/tdee-calculator/`
- `/en/age-calculator/`
- `/en/days-calculator/`
- `/en/due-date-calculator/`
- `/en/percentage-calculator/`
- `/en/tip-calculator/`
- `/en/unit-converter/`

Calculator inventory source:

- `src/data/calculator-metadata.mjs`

## 8. Korean / English Route Strategy

Korean content should remain focused on Korean finance, tax, salary, support, and policy topics when official Korean sources exist. English content should be limited to globally relevant calculators and topics such as AI API cost, SaaS pricing, mortgage, salary, investing, currency, and general calculator guides.

The current repository already separates Korean and English routes through `/en/`. It should not auto-translate Korea-specific policy articles into English.

## 9. Existing API

No Astro API routes or production backend APIs were found.

Local automation scripts act as operational tooling, not public APIs.

## 10. Database

No production database exists.

Current persistence model:

- Published article data: `src/data/articles.mjs`
- Calculator inventory: `src/data/calculator-metadata.mjs`
- Official source allowlist: `src/data/official-source-allowlist.mjs`
- Noindex policy: `src/data/approval-noindex-paths.mjs`
- Local queue/report files: `data/insights/*.jsonl` and generated reports

This is acceptable for MVP validation. Future D1 tables should mirror the current JSON/JSONL record shape rather than forcing a rewrite.

## 11. D1 / KV / R2 / Workers / Cron

Current status:

- D1: not implemented
- KV: not implemented
- R2: not implemented
- Workers: not implemented
- Queues: not implemented
- Cron: not implemented

Recommended future use:

- Worker Cron: issue collection and low-cost analysis
- D1: issues, sources, article candidates, metrics, automation runs
- Queues: retryable collector/generator jobs if volume grows
- KV: feature flags or small public cache only if needed
- R2: not needed for Phase 1

## 12. Environment Variables

Public/static env already supported:

- `PUBLIC_AD_PROVIDER`
- `PUBLIC_ADSENSE_CLIENT`
- `PUBLIC_GA_MEASUREMENT_ID`
- `PUBLIC_CONTACT_EMAIL`
- `PUBLIC_SITE_OWNER`
- `PUBLIC_ADSENSE_SLOT_TOP`
- `PUBLIC_ADSENSE_SLOT_RESULT`
- `PUBLIC_ADSENSE_SLOT_CONTENT`
- `PUBLIC_ADSENSE_SLOT_MID`
- `PUBLIC_ADSENSE_SLOT_MID2`

Automation env candidates:

- `AUTOMATION_ENABLED`
- `ENABLE_ISSUE_COLLECTOR`
- `ENABLE_ARTICLE_GENERATION`
- `ENABLE_AUTO_PUBLISH`
- `ENABLE_CALCULATOR_MATCHING`
- `MAX_ARTICLES_PER_DAY`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

Future secret candidates:

- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL`
- `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY`
- `CLOUDFLARE_API_TOKEN`

Rule: secrets must stay in local env or Cloudflare secrets. They must not be committed.

## 13. SEO

SEO is centralized and relatively safe.

Relevant files:

- `src/components/SEOHead.astro`
- `src/layouts/BaseLayout.astro`
- `src/layouts/BlogLayout.astro`
- `astro.config.mjs`
- `src/data/approval-noindex-paths.mjs`
- `public/robots.txt`
- `public/_redirects`

Implemented:

- Title and meta description
- Canonical URLs
- Open Graph metadata
- Twitter metadata
- `hreflang` support
- Organization JSON-LD
- Article JSON-LD
- Breadcrumb JSON-LD
- Static sitemap through `@astrojs/sitemap`
- Sitemap exclusion for noindex approval paths
- Explicit robots meta

Risk:

- Low-value issue pages can harm AdSense review and search quality.
- Financial/tax pages require official source discipline.
- Public pages must not include internal operator phrases about AdSense review, monetization, or site strategy.

## 14. Sitemap And Robots

Sitemap:

- Generated by `@astrojs/sitemap`
- Uses site URL from `astro.config.mjs`
- Filters out paths listed in `approvalNoIndexPathSet`

Robots:

- `public/robots.txt`
- Allows crawling
- References `https://mycalcstool.com/sitemap-index.xml`

Note: noindexed pages may still be accessible to users but are excluded from the approval-focused sitemap surface.

## 15. Structured Data

Implemented structured data:

- Organization schema in `SEOHead.astro`
- CollectionPage schema on `/articles/`
- Article schema on `/articles/[slug]/`
- BreadcrumbList schema on article pages

Guideline:

- Do not add fake FAQ schema.
- Do not add schema that claims functionality or content not visible on the page.

## 16. Analytics

GA4 is configured through `src/components/MonetizationHead.astro`.

Default measurement ID source:

- `src/data/site-meta.ts`

CTA click tracking:

- `src/components/ArticleCta.astro`
- GA event: `article_calculator_click`

Current limitation:

- Search Console import exists for article search performance.
- GA4 article interaction metrics are tracked in the browser and can be imported from CSV into the local insight report.

## 17. AdSense

AdSense is supported but gated.

Relevant files:

- `src/data/site-meta.ts`
- `src/components/MonetizationHead.astro`
- `src/components/AdSlot.astro`
- `scripts/update-ads-txt.mjs`
- `public/ads.txt`

Current publisher record:

- `google.com, pub-2898972256894696, DIRECT, f08c47fec0942fa0`

Recommendation:

- Keep AdSense code disabled unless `PUBLIC_AD_PROVIDER=adsense`.
- Keep improving content quality and internal utility before aggressively adding ad slots.

## 18. Test Framework

Test framework: Node built-in test runner.

Insight test command:

- `npm run insights:test`

Additional verification:

- `node scripts/check-growth-homepage.mjs`
- `npm run build`
- `node --test scripts/insights/rendered-articles.test.mjs`
- `npm run insights:verify:calculator-routes`
- `npm run insights:verify:sitemap`
- `npm run verify:release`

Covered areas:

- collector
- retry
- JSONL store
- issue analysis
- source validation
- calculator matching
- article candidate generation
- quality gate
- publishing queue
- article data writer
- rendered article checks
- Search Console metrics
- reports
- pipeline runner

## 19. CI / CD

No `.github` workflow was found.

Deployment appears to depend on Cloudflare Pages Git integration. This is acceptable for the current scale.

Suggested future improvement:

- Add a lightweight CI workflow only if repository ownership and branch flow are stable.
- Minimum checks: `npm run insights:test`, `node scripts/check-growth-homepage.mjs`, `npm run build`.

## 20. Security And Privacy

Current strengths:

- No application server stores calculator inputs.
- Secrets are not required for normal static build.
- CSP and security headers exist in `public/_headers`.
- Public article pages include official source links and disclaimers.

Current risks:

- Local automation secrets for Naver or future LLM/Search Console integration must be managed outside Git.
- Future Cloudflare Worker/D1 migration must avoid storing user-entered calculator values.
- Public content must avoid investment advice, loan approval guarantees, return guarantees, and unsupported numeric claims.

## 21. Existing Insight Automation Status

Implemented:

- Naver issue collection adapter
- Retry helper
- JSONL local persistence
- Rule-based issue analyzer
- Category-aware official source validation
- Official source reachability check
- Calculator matcher
- Article candidate builder
- Quality gate
- Publish queue with daily cap
- Seoul-date publishing count
- Manual approval requirement for article writes
- Calculator backlog candidate builder
- Search Console CSV import
- GA4 article interaction CSV import
- Local insight report builder
- Report-level recommended actions from article performance class
- Manual review checklist for article candidates before publishing
- Built sitemap verification for published article inclusion and noindex exclusion
- Topic-cluster decisions from imported Search Console and GA4 metrics
- Rendered article quality tests

Not implemented:

- Production Cron
- D1 database
- Authenticated admin dashboard
- LLM provider integration
- Semantic official-page content verification
- AdSense revenue import
- Affiliate/CPA automation

## 22. Recommended Next Implementation Order

Do next:

- Keep auto-publish disabled until review quality and search data are stable.
- Defer Cloudflare Worker/D1/Cron until local reports show repeatable traction or manual operation becomes too frequent.

Do not do next:

- Do not add Cloudflare D1 before the local workflow proves useful.
- Do not add Cron before source validation and quality gates are trusted.
- Do not add LLM generation before rule-based rejection and official source validation are stable.
- Do not add affiliate/CPA automation while AdSense review and traffic acquisition are still primary.

## 23. Fit Against The User Brief

The current repository can support the requested direction, but the safe version is incremental:

Issue discovery should feed calculator-linked articles, not a generic news feed. Existing calculators and indexed URLs should stay untouched. The local Insight Automation layer is the right Phase 1 base. Cloudflare runtime automation, LLM drafting, and monetization expansion should be Phase 2 or Phase 3 work after measurable search traffic and article-to-calculator conversion exist.

## 24. Phase 0 Verification Snapshot

Commands run during this review:

- `npm run insights:test`: 102 tests passed.
- `node scripts/check-growth-homepage.mjs`: 13 checks passed.

No production source file changes are required for this Phase 0 review. Documentation updates only.
