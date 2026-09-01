# MyCalcsTool Insight Automation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement future tasks. This document is the current-state analysis and Phase 1 implementation plan for applying the brief to the existing MyCalcsTool repository.

**Goal:** Add an `Issue -> Information -> Calculator -> Revenue` layer while preserving existing calculators, existing SEO URLs, static Cloudflare Pages deployment, and user-facing trust.

**Architecture:** Keep the current Astro static site as the production surface. Use local file-based insight automation first, with strict gates and manual publishing controls. Move to Cloudflare Workers/D1/Cron only after the local pipeline proves useful through Search Console and calculator-click data.

**Tech Stack:** Astro 5 static output, Tailwind CSS, npm scripts, JSON/JSONL data files, Node built-in test runner, GA4 click events, Cloudflare Pages static hosting.

**Spec:** User-provided "MyCalcsTool finance, life, AI issue-based content automation and monetization expansion project", reviewed against the repository on 2026-09-02.

**Current-state companion doc:** `docs/mycalcstool-insight-current-state.md`

## Global Constraints

- Do not delete existing calculators.
- Do not change existing calculator URLs without redirect, canonical, sitemap, and Search Console impact review.
- Do not turn the site into a generic news rewrite site.
- Treat news/search APIs as issue-discovery inputs, not final factual sources.
- Require official sources for finance, tax, salary, investing, support, and AI pricing facts.
- Do not publish articles that guarantee returns, loan approval, tax outcomes, or investment performance.
- Do not store personal calculator inputs server-side.
- Keep production auto-publish disabled until quality and search data justify it.
- Do not add affiliate automation in Phase 1.
- Do not automatically translate Korean policy content into English.
- Keep the implementation small: static pages and local scripts before Workers/D1/Cron.

---

## Phase 0 Decision

This repository can support the requested `Issue -> Information -> Calculator -> Revenue` direction, but it should not be implemented as a generic automated news site.

Keep:

- Existing calculator routes and calculation behavior.
- Existing Korean/English route split.
- Static Cloudflare Pages deployment.
- `/articles/` as the issue-content namespace.
- Local scripts as the first automation layer.

Do not change yet:

- Do not add Cloudflare Workers, D1, KV, Queues, or Cron for Phase 1 coding.
- Do not enable automatic production publishing.
- Do not add affiliate/CPA automation.
- Do not add LLM drafting until source gates, duplicate gates, and rendered article checks remain stable under real operation.

The next production-code phase should be limited to small hardening tasks that improve trust, measurement, and review safety. Runtime automation belongs in Phase 2 after Search Console impressions, organic clicks, and article-to-calculator click data show traction.

## Current State

Repository analyzed: `D:\02_Dev\03_Web\website\mycalcstool`

The project is an Astro static site. `astro.config.mjs` sets:

- `site: 'https://mycalcstool.com'`
- `trailingSlash: 'always'`
- `output: 'static'`
- `build.format: 'directory'`
- `@astrojs/sitemap` integration with noindex filtering
- Tailwind integration

Package manager is npm. Dependencies are intentionally small:

- `astro`
- `@astrojs/sitemap`
- `@astrojs/tailwind`
- `tailwindcss`

No repository-level backend runtime was found:

- No `wrangler.toml`
- No Cloudflare Worker source
- No D1 migrations
- No KV/R2/Queue bindings
- No Cron trigger config
- No ORM
- No API routes
- No `.github` workflows
- No `.openai/hosting.json`

The current production model is:

1. Astro builds static HTML into `dist`.
2. Cloudflare Pages serves the static output.
3. Calculators run client-side.
4. GA4 tracks page and click events through existing frontend scripts.
5. Ad scripts are controlled by public environment variables and remain optional.
6. Insight automation runs as local npm scripts, not as production cron jobs.

This is a good fit for the first stage because it protects speed, privacy, and existing calculator routes. It is not yet a complete fully automated production issue collector.

## Current Route Map

### Korean Core

- `/`
- `/about/`
- `/contact/`
- `/methodology/`
- `/privacy/`
- `/terms/`

### Korean Calculators

- `/loan/`
- `/salary/`
- `/tax-refund/`
- `/compound/`
- `/severance/`
- `/bmi/`
- `/calorie/`
- `/tdee/`
- `/due-date/`
- `/dday/`
- `/age-calculator/`
- `/percentage-calculator/`
- `/unit-converter/`
- `/tip-calculator/`
- `/moving-cost-calculator/`
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

### Korean Guides

- `/blog/`
- `/blog/loan-repayment-method-guide/`
- `/blog/fixed-vs-variable-rate-guide/`
- `/blog/prepayment-fee-break-even-guide/`
- `/blog/salary-take-home-pay-guide/`
- `/blog/gross-vs-net-salary-guide/`
- `/blog/year-end-tax-refund-guide/`
- `/blog/card-deduction-guide/`
- `/blog/severance-pay-guide/`
- `/blog/compound-interest-guide/`
- `/blog/age-calculator-guide/`
- `/blog/bmi-calculator-guide/`
- `/blog/percentage-calculator-guide/`
- `/blog/unit-converter-guide/`

### Issue Article Routes

- `/articles/`
- `/articles/base-rate-loan-interest-impact/`
- `/articles/year-end-tax-refund-paycheck-impact/`
- `/articles/openai-api-price-change-cost-planning/`

### English Core And Calculators

- `/en/`
- `/en/about/`
- `/en/contact/`
- `/en/methodology/`
- `/en/privacy/`
- `/en/terms/`
- `/en/mortgage-calculator/`
- `/en/salary-calculator/`
- `/en/compound-interest-calculator/`
- `/en/bmi-calculator/`
- `/en/calorie-calculator/`
- `/en/tdee-calculator/`
- `/en/age-calculator/`
- `/en/days-calculator/`
- `/en/due-date-calculator/`
- `/en/percentage-calculator/`
- `/en/tip-calculator/`
- `/en/unit-converter/`
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

### English Guides

English guide pages exist under `/en/blog/`. They are useful content assets, but many are intentionally excluded from the focused indexing surface through `src/data/approval-noindex-paths.mjs`.

## Calculator Inventory

The active matching inventory is already normalized in `src/data/calculator-metadata.mjs`.

Korean high-priority calculators:

- `loan` -> `/loan/`
- `salary` -> `/salary/`
- `tax-refund` -> `/tax-refund/`
- `compound` -> `/compound/`
- `severance` -> `/severance/`
- `stock-return-calculator` -> `/stock-return-calculator/`
- `stock-average-calculator` -> `/stock-average-calculator/`
- `stock-averaging-down-calculator` -> `/stock-averaging-down-calculator/`
- `dividend-calculator` -> `/dividend-calculator/`
- `dividend-yield-calculator` -> `/dividend-yield-calculator/`
- `foreign-stock-return-calculator` -> `/foreign-stock-return-calculator/`
- `etf-investment-calculator` -> `/etf-investment-calculator/`
- `ai-token-calculator` -> `/ai-token-calculator/`
- `chatgpt-api-cost-calculator` -> `/chatgpt-api-cost-calculator/`
- `ai-model-cost-comparison` -> `/ai-model-cost-comparison/`
- `moving-cost-calculator` -> `/moving-cost-calculator/`

Supporting Korean utility/health calculators:

- `bmi` -> `/bmi/`
- `calorie` -> `/calorie/`
- `tdee` -> `/tdee/`
- `due-date` -> `/due-date/`
- `dday` -> `/dday/`
- `age-calculator` -> `/age-calculator/`
- `percentage-calculator` -> `/percentage-calculator/`
- `unit-converter` -> `/unit-converter/`
- `tip-calculator` -> `/tip-calculator/`

English calculator metadata also exists for mortgage, salary, compound interest, investing, AI cost, health, dates, percentage, tip, and unit conversion.

Implementation rule: keep `calculator-metadata.mjs` as the current matcher layer, but continue checking it against `site-config.json`, `growth-calculators.ts`, and `en-calculators.ts` so route truth does not drift.

## Existing SEO

SEO is centralized through:

- `src/components/SEOHead.astro`
- `src/layouts/BaseLayout.astro`
- `src/layouts/BlogLayout.astro`
- `astro.config.mjs`
- `src/data/approval-noindex-paths.mjs`

Implemented SEO features:

- Per-page title and description
- Canonical URL with trailing slash
- Open Graph metadata
- Twitter card metadata
- `hreflang` support for Korean/English pairs
- Organization JSON-LD
- Calculator and article JSON-LD where pages supply it
- `robots` meta using explicit props and noindex path set
- `@astrojs/sitemap` generation
- Sitemap filtering for noindexed paths
- Static `robots.txt`
- Static `_redirects` for trailing slash and legacy URL preservation

Current issue article SEO:

- `/articles/` renders a `CollectionPage` JSON-LD object.
- `/articles/[slug]/` renders `Article` and `BreadcrumbList` JSON-LD.
- Article pages include official source links, published date, updated date, category, summary, disclaimer, and calculator CTA.
- Article pages are generated only from `getPublishedArticles('ko')`.

SEO risks to continue managing:

- Do not publish thin issue pages.
- Do not create many near-duplicate pages around only changed amounts.
- Do not mix internal operator copy into public pages.
- Do not route low-quality drafts into the sitemap.
- Do not use FAQ schema unless the visible page actually contains matching FAQ content.

## Existing Cloudflare Architecture

Confirmed in repository:

- Cloudflare Pages-compatible static output
- `public/_headers`
- `public/_redirects`
- `public/robots.txt`
- `public/ads.txt`
- Naver ownership verification file

Not present:

- Workers
- D1
- KV
- R2
- Queues
- Cron
- Wrangler config

Recommended decision: do not add Cloudflare runtime services in the next coding slice. Use local scripts and static output until the article model, source gate, calculator CTA, and Search Console feedback loop prove useful.

## Existing Database

There is no production database.

Current data is file-based:

- `src/data/articles.mjs`
- `src/data/calculator-metadata.mjs`
- `src/data/official-source-allowlist.mjs`
- `src/data/site-config.json`
- `src/data/growth-calculators.ts`
- `src/data/en-calculators.ts`
- `src/data/ko-finance-guides.ts`
- `src/data/en-blog-posts.ts`
- rate/tax JSON files under `src/data/`
- local insight queue/report files under `data/insights/`, ignored from Git except `.gitkeep`

This matches the safe MVP direction. Future D1 tables should map from the current JSONL shape, not force a rewrite now.

## Existing Insight Automation

Implemented modules:

- `src/lib/insights/naver-collector.mjs`
- `src/lib/insights/retry.mjs`
- `src/lib/insights/jsonl-store.mjs`
- `src/lib/insights/issue-analyzer.mjs`
- `src/lib/insights/source-validator.mjs`
- `src/lib/insights/calculator-matcher.mjs`
- `src/lib/insights/issue-candidate-builder.mjs`
- `src/lib/insights/article-candidate-builder.mjs`
- `src/lib/insights/quality-gate.mjs`
- `src/lib/insights/publish-queue.mjs`
- `src/lib/insights/publish-plan-builder.mjs`
- `src/lib/insights/article-data-writer.mjs`
- `src/lib/insights/calculator-backlog-builder.mjs`
- `src/lib/insights/search-console-metrics.mjs`
- `src/lib/insights/report-builder.mjs`
- `src/lib/insights/automation-runner.mjs`
- `src/lib/insights/pipeline-runner.mjs`

Implemented scripts:

- `npm run insights:test`
- `npm run insights:collect:naver`
- `npm run insights:analyze`
- `npm run insights:pipeline`
- `npm run insights:generate:articles`
- `npm run insights:generate:calculator-backlog`
- `npm run insights:publish:plan`
- `npm run insights:publish:articles`
- `npm run insights:metrics:import`
- `npm run insights:report`

Implemented controls:

- `AUTOMATION_ENABLED=false` skips automation jobs.
- `ENABLE_ISSUE_COLLECTOR=true` is required for Naver collection.
- `ENABLE_ARTICLE_GENERATION=false` disables article candidate generation in the local pipeline.
- `ENABLE_AUTO_PUBLISH=true` is required for automatic publish planning.
- `MAX_ARTICLES_PER_DAY` controls daily publish volume.
- `ENABLE_SOURCE_CONTENT_MATCH=true` verifies reachable official-source page text against topic keywords during issue analysis.

Implemented article candidate templates:

- Base-rate loan impact
- Year-end tax refund impact
- Salary/take-home pay impact
- AI API cost impact
- Exchange-rate foreign stock return impact

Implemented article writer safeguards:

- Published entries preserve `issueId`.
- Published entries preserve `canonicalTopic`.
- Published official sources always include `checkedAt`.

Implemented publishing safeguards:

- Publish planning defaults to 1 article per day.
- Publish planning has a hard MVP cap of 2 articles per day.
- Publish scripts count existing `publishedDate` entries before scheduling more articles for the same day.
- Publish scripts use the `Asia/Seoul` date key so Korean operating-day limits do not drift at UTC midnight.
- Applying article writes requires both `--apply` and `--manual-approval`.

Gap:

- There is no Cloudflare Cron trigger.
- There is no production queue.
- There is no authenticated admin dashboard.
- There is no LLM provider integration.
- Official source validation is category-aware, reachability-aware, and can run optional topic keyword content matching.

## Existing Analytics And Monetization

GA4:

- `src/data/site-meta.ts` defaults `PUBLIC_GA_MEASUREMENT_ID` to `G-DWJ06N3894`.
- `src/components/MonetizationHead.astro` loads GA.
- `src/components/MonetizationRuntime.astro` sends events for elements with `data-ga-event`.
- `ArticleCta.astro` emits `article_calculator_click` with the calculator id as label.

AdSense readiness:

- `src/data/site-meta.ts` supports `PUBLIC_AD_PROVIDER=adsense`.
- `PUBLIC_ADSENSE_CLIENT` defaults to `ca-pub-2898972256894696`.
- `AdSlot.astro` renders only when provider and slot id are configured.
- `scripts/update-ads-txt.mjs` manages `public/ads.txt`.
- `public/ads.txt` contains the Google publisher record.

Affiliate/CPA:

- Existing `/go/moving/` route is isolated and noindexed.
- Phase 1 should not expand CPA/affiliate automation.

## Proposed Architecture

### Phase 1A: Current Static MVP

This is the correct near-term shape:

1. Keep calculators static and client-side.
2. Keep `/articles/` as the issue-content namespace.
3. Keep issue pipeline as local scripts.
4. Store local queue/report data in `data/insights/*.jsonl`.
5. Publish only reviewed article data into `src/data/articles.mjs`.
6. Use source allowlist and quality gate before publishing.
7. Use GA4 article interaction events for early conversion and internal-navigation data.
8. Use manual Search Console export/import before adding API credentials.

### Phase 1B: Harden The Local Pipeline

Add the missing safety controls before production scheduling:

1. Wire `ENABLE_CALCULATOR_MATCHING`.
2. Add duplicate topic checks against already published article slugs and canonical topics.
3. Add official-source URL reachability checks.
4. Add rendered article checks for every published article.
5. Add report output that separates `source_verified`, `review_required`, `rejected`, `publish_candidate`, and `published`.
6. Add CSV import workflow for Search Console page/query performance.

### Phase 2: Cloudflare Runtime

Only after 30 to 90 days of data:

1. Add Cloudflare Worker collector.
2. Add Cron trigger.
3. Add D1 tables for issues, sources, article candidates, calculator backlog, automation runs, and metrics.
4. Keep auto-publish disabled until D1 records show stable source and quality behavior.
5. Add authenticated admin review surface only if local reports become too slow.

## New Components Status

Completed Phase 1 hardening:

- Calculator-matching feature flag wired through `issue-candidate-builder`, `pipeline-runner`, and scripts.
- Topic/slug duplicate check against published `articles.mjs`.
- Official source URL reachability check with timeout.
- Optional official source content matching against topic keywords.
- Official source category-to-domain matching for finance, tax, salary, support, investing, and AI.
- Rendered article test that validates every published article has source links and CTA links.
- Search Console CSV import workflow and owner-facing documentation.
- Local report file writer under `data/insights/reports/latest.md`.

Defer:

- LLM article writer integration.
- Cloudflare D1.
- Cloudflare Cron.
- Cloudflare Queues.
- Public/admin dashboard.
- Affiliate automation.
- English issue articles except global AI/investing topics.

Still useful before runtime automation:

- A 30 to 90 day operating log that proves article impressions, search clicks, and calculator clicks are repeatable.

## Data Model

Keep current in-repo records and map them to future D1 later.

Current and near-term record shapes:

- Issue: id, title, canonicalTopic, category, language, sourceCount, relevanceScore, intent, status, dates, sources.
- Issue source: title, url, sourceName, summary, publishedAt, language, collectedAt, official host if validated.
- Article candidate: issueId, slug, title, description, category, summary, sections, numericClaims, calculatorMatches, officialSources, disclaimerType, qualityScore, status.
- Published article: same public fields as `src/data/articles.mjs`, with `status: 'published'`.
- Calculator metadata: id, path, language, category, name, keywords.
- Calculator backlog: title, reason, category, relatedIssueId, estimatedDemand, priority, status.
- Content metrics: article slug/page, date, impressions, clicks, CTR, average position, pageviews if available, calculator clicks if available.
- Automation run: jobName, startedAt, finishedAt, status, itemsProcessed, itemsFailed, cost, errorMessage.

Future D1 tables can mirror these:

- `issues`
- `issue_sources`
- `articles`
- `calculators`
- `article_calculators`
- `calculator_backlog`
- `content_metrics`
- `automation_runs`

## External API Plan

Current:

- Naver News Search adapter exists and is gated behind `ENABLE_ISSUE_COLLECTOR=true`.

Next:

- Use Naver only for discovery.
- Store original source URL, Naver URL, title, summary, published date, and collection time.
- Do not treat Naver/news result summaries as final factual support.
- Add official source reachability validation for allowlisted URLs.
- Keep Search Console as manual CSV import first.

Later:

- Search Console API.
- Google Trends or compliant trend source.
- Official public/government data feeds.
- AI provider pricing monitors.

## LLM Architecture

No LLM provider integration exists yet. That is acceptable.

Rule-first stages already exist and should remain primary:

- Excluded-topic filtering
- Topic grouping by known rules
- Relevance scoring
- Intent labels
- Official domain allowlist
- Calculator matching
- Quality gate
- Publish queue limits

Future LLM use should be limited to:

- Borderline intent classification
- Draft outline
- Draft prose
- Final quality review

LLM must not be the source of truth for:

- Rates
- Taxes
- Effective dates
- Eligibility
- Support amounts
- API prices
- Loan limits
- Product terms

## Quality Gate

Current `quality-gate.mjs` checks:

- Duplicate slug
- Required metadata
- Official source requirement by category
- Numeric claims tied to official source URLs
- Calculator match requirement
- Short article warning
- Banned claims such as guaranteed returns or buy/sell recommendations

Required additions:

- Detect duplicate canonical topic, not only duplicate slug.
- Check source URL reachability.
- Check that official source host and category make sense.
- Check article rendered output contains official source section.
- Check article rendered output contains at least one CTA for matched calculator.
- Add stricter public-copy checks so internal operation language never appears in rendered pages.

Status: completed for the local static MVP. Full semantic page-content verification remains Phase 2 or later.

## SEO Impact

Low-risk choices already made:

- `/articles/` is separate from `/blog/`.
- Calculator routes are unchanged.
- Article routes use static generation.
- Sitemap generation remains centralized.
- Article pages have canonical and structured data.
- Existing noindex surface remains centralized.

Risks:

- Publishing too many similar articles can reduce perceived quality.
- Publishing source-thin financial/tax pages can harm trust.
- Using stale source information can create YMYL quality issues.
- English expansion of Korea-only policy topics would be low value.

Mitigation:

- Maximum 1 to 2 articles per day.
- Require official sources.
- Keep topic clusters focused on calculator usefulness.
- Use Search Console data to update, merge, or pause weak article topics.
- Do not index drafts or review-required candidates.

## Cost

Current added infrastructure cost is near zero:

- Static Cloudflare Pages
- Local scripts
- No D1
- No Worker runtime
- No LLM calls

Potential cost sources later:

- Naver API usage
- LLM provider usage
- Search Console API integration work
- Cloudflare D1/Worker usage at scale

Controls:

- Collect many, publish few.
- Rule-based rejection before LLM.
- Strong model only for final article drafting/review if needed.
- `MAX_ARTICLES_PER_DAY`
- `DAILY_LLM_BUDGET`
- `MONTHLY_LLM_BUDGET`
- `MAX_SOURCE_LOOKUPS_PER_ARTICLE`

## Security

Do not commit secrets.

Secret candidates:

- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `OPENAI_API_KEY`
- `ANTHROPIC_API_KEY`
- `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL`
- `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY`
- `CLOUDFLARE_API_TOKEN`

Public build-time env candidates:

- `PUBLIC_AD_PROVIDER`
- `PUBLIC_GA_MEASUREMENT_ID`
- `PUBLIC_CONTACT_EMAIL`
- `PUBLIC_SITE_OWNER`
- `PUBLIC_ADSENSE_CLIENT`
- `PUBLIC_ADSENSE_SLOT_TOP`
- `PUBLIC_ADSENSE_SLOT_RESULT`
- `PUBLIC_ADSENSE_SLOT_CONTENT`
- `PUBLIC_ADSENSE_SLOT_MID`
- `PUBLIC_ADSENSE_SLOT_MID2`

Privacy rule:

- Track article CTA clicks, not user-entered salary, loan amount, investment amount, or API usage details.

## Testing

Existing test surface:

- `npm run insights:test`
- `node scripts/check-growth-homepage.mjs`
- `npm run build`
- `npm run insights:verify:calculator-routes`
- `npm run insights:verify:sitemap`
- `npm run verify:release`

Existing insight tests cover:

- article candidate builder
- article data writer
- automation runner
- calculator backlog builder
- calculator matcher
- JSONL store
- issue analyzer
- issue candidate builder
- Naver collector
- pipeline runner
- publish plan builder
- publish queue
- quality gate
- rendered articles
- report builder
- retry
- Search Console metrics
- source validator

Completed Phase 1 tests:

- `ENABLE_CALCULATOR_MATCHING=false` keeps issue analysis but skips calculator matching, article candidate generation, and backlog noise.
- Duplicate canonical topic rejection.
- Official source URL reachability with timeout and failure states.
- Optional official source topic keyword matching.
- Published article render checks for all published articles.
- Public copy checks for internal operator wording.
- GA4 article interaction import maps article CTA, article-to-article, article-index, and calculator-to-article click exports to article slugs.
- Report recommendations map each performance class to a concrete next action.
- Sitemap includes published article URLs and excludes noindex routes.
- Manual review checklist covers source-backed article candidates before publishing.
- Topic-cluster decisions can be derived from imported Search Console and GA4 metrics.

Required next tests:

- Article FAQ engagement tracking can be measured without storing private calculator inputs.
- Cloudflare runtime automation can be added without changing public calculator routes or storing calculator inputs.
- Cloudflare runtime automation can be disabled with `AUTOMATION_ENABLED=false` and `ENABLE_AUTO_PUBLISH=false`.

## Deployment

Current deployment should remain:

- Build command: `npm run build`
- Output directory: `dist`
- Cloudflare Pages deploys from Git

Safe rollout procedure:

1. Keep implementation on Git with small commits.
2. Run targeted tests.
3. Run `npm run insights:test`.
4. Run `node scripts/check-growth-homepage.mjs`.
5. Run `npm run build`.
6. Confirm `public/ads.txt` was not accidentally changed.
7. Push to `origin/master`.
8. Wait for Cloudflare Pages propagation.
9. Verify production article and calculator URLs.
10. Submit only approved URLs in Search Console.

## Rollback

Static rollback is simple:

- Revert the commit that introduced bad article data or route changes.
- Or set article `status` away from `published` and rebuild.
- Or remove homepage/article index links while leaving calculators live.
- Existing calculators should continue because article routes are isolated.

If Cloudflare runtime is added later:

- Set `AUTOMATION_ENABLED=false`.
- Set `ENABLE_AUTO_PUBLISH=false`.
- Disable Cron trigger.
- Keep D1 records for audit.
- Roll back static site commit if rendered public pages are wrong.

## Phase 1 Implementation Order

### TASK-001: Baseline Verification

Purpose: confirm current static build and route surface before new changes.

Files:

- Read: `package.json`
- Read: `astro.config.mjs`
- Read: `src/pages/**`
- Read: `src/components/SEOHead.astro`
- Read: `src/data/approval-noindex-paths.mjs`
- Read: `public/_redirects`
- Read: `public/robots.txt`

Test:

- `git status --short --branch`
- `npm run build`

Acceptance criteria:

- Working tree is understood before edits.
- Existing calculator URLs remain unchanged.
- Build passes before implementation.

Status: completed for this analysis.

### TASK-002: Calculator Matching Flag

Purpose: allow issue collection/source review while pausing calculator matching cleanly.

Files:

- Modify: `src/lib/insights/issue-candidate-builder.mjs`
- Modify: `src/lib/insights/pipeline-runner.mjs`
- Modify: `scripts/insights/analyze-issues.mjs`
- Modify: `scripts/insights/run-local-pipeline.mjs`
- Test: `scripts/insights/issue-candidate-builder.test.mjs`
- Test: `scripts/insights/pipeline-runner.test.mjs`

Acceptance criteria:

- `ENABLE_CALCULATOR_MATCHING=false` returns source-verified issue candidates with empty matches.
- Pipeline skips article candidate and calculator backlog output when matching is disabled.
- Existing default behavior does not change.

Risk:

- If disabled matching still creates backlog records, it can generate false calculator candidates. Avoid that.

### TASK-003: Duplicate Topic Gate

Purpose: block same-topic issue articles even when slugs differ.

Files:

- Modify: `src/lib/insights/quality-gate.mjs`
- Modify: `src/lib/insights/article-candidate-builder.mjs`
- Test: `scripts/insights/quality-gate.test.mjs`
- Test: `scripts/insights/article-candidate-builder.test.mjs`

Acceptance criteria:

- Existing published slugs block duplicate slugs.
- Existing published canonical topics block duplicate issue pages.
- Related but distinct topics are not blocked.

Risk:

- Over-blocking can prevent legitimate updates. Prefer `review_required` for close matches.

### TASK-004: Official Source Reachability

Purpose: make source validation stronger than domain allowlist.

Files:

- Modify: `src/lib/insights/source-validator.mjs`
- Test: `scripts/insights/source-validator.test.mjs`

Acceptance criteria:

- Invalid URLs fail.
- Non-allowlisted URLs fail for source-required categories.
- Allowlisted but unreachable URLs become `review_required`, not published.
- Fetch timeout is enforced.

Risk:

- Official sites can intermittently fail. Do not permanently reject on one transient failure.

### TASK-005: Rendered Article Quality Check

Purpose: prevent public pages from missing required trust elements.

Files:

- Modify: `scripts/insights/rendered-articles.test.mjs`
- Read: `src/pages/articles/[slug].astro`
- Read: `src/data/articles.mjs`

Acceptance criteria:

- Every published article has title, description, summary, official source, disclaimer, and CTA.
- Every CTA path resolves to a known calculator route.
- Public output contains no internal operation copy.

Risk:

- Data-only articles can pass module tests but fail rendered UX. This test closes that gap.

### TASK-006: Local Report File Output

Purpose: make review easier without building an admin dashboard.

Files:

- Modify: `src/lib/insights/report-builder.mjs`
- Modify: `scripts/insights/report.mjs`
- Test: `scripts/insights/report-builder.test.mjs`

Acceptance criteria:

- Report includes collected, source verified, review required, rejected, publish candidates, scheduled, published, backlog, and metrics summary.
- Report can be written to `data/insights/reports/latest.md`.
- Generated report path remains ignored from Git.

Risk:

- A public admin dashboard would require authentication. Keep this local.

### TASK-007: Search Console CSV Workflow

Purpose: use real search data before adding API credentials.

Files:

- Modify: `src/lib/insights/search-console-metrics.mjs`
- Modify: `scripts/insights/import-search-console-csv.mjs`
- Test: `scripts/insights/search-console-metrics.test.mjs`
- Create or update: `docs/search-console-url-submission.md`

Acceptance criteria:

- CSV import maps page URL to article slug.
- Metrics include impressions, clicks, CTR, and average position.
- Report groups article performance into new/growing/winner/underperform/dead candidates.

Risk:

- Search Console exports can change column names. Support the current Korean/English export headers used by the owner.

### TASK-008: Article Data Hardening

Purpose: make existing published article records safer and easier to audit.

Files:

- Modify: `src/data/articles.mjs`
- Test: `scripts/insights/rendered-articles.test.mjs`

Acceptance criteria:

- Every published article has `issueId` or equivalent trace field.
- Every article has official source checked date.
- Every article has matched calculator ids.
- Dates are ISO `YYYY-MM-DD`.

Risk:

- Do not bulk rewrite public article copy unless the rendered test or source audit requires it.

Status: completed for current published data and new article writer output.

### TASK-009: Source-Backed Article Candidate Templates

Purpose: keep generated drafts useful instead of generic.

Files:

- Modify: `src/lib/insights/article-candidate-builder.mjs`
- Test: `scripts/insights/article-candidate-builder.test.mjs`

Acceptance criteria:

- Base-rate, tax, salary, exchange-rate, and AI-cost topics produce user-question titles.
- Drafts include official source URLs.
- Drafts include calculator CTAs.
- Drafts fail quality gate if source or calculator match is missing.

Risk:

- Template sprawl can become maintenance cost. Add templates only for topics that connect to calculators.

Status: completed for the five current rule-supported topics.

### TASK-010: Controlled Publishing

Purpose: keep publishing small, reviewable, and reversible.

Files:

- Modify: `src/lib/insights/publish-queue.mjs`
- Modify: `scripts/insights/publish-candidates.mjs`
- Modify: `scripts/insights/publish-articles.mjs`
- Test: `scripts/insights/publish-queue.test.mjs`
- Test: `scripts/insights/article-data-writer.test.mjs`

Acceptance criteria:

- Default max publish count is 1.
- Hard cap remains 2 for MVP unless explicitly changed.
- Auto-publish requires `ENABLE_AUTO_PUBLISH=true`.
- Manual publish writes deterministic diffs to `src/data/articles.mjs`.

Risk:

- A malformed article data write can break the build. Always run build after publish.

Status: completed for local static publishing controls.

### TASK-011: Cloudflare Phase 2 Design

Purpose: prepare runtime automation without implementing it too early.

Files:

- Create: `docs/mycalcstool-cloudflare-phase2-design.md`

Acceptance criteria:

- D1 schema maps from current JSONL fields.
- Worker Cron only runs collector/analyzer, not public page rendering.
- Emergency flags are listed.
- Rollback procedure is listed.

Risk:

- Premature Workers/D1 work can distract from the actual question: do articles produce search traffic and calculator use?

Status: completed in `docs/mycalcstool-cloudflare-phase2-design.md`.

## Implementation Recommendation

The next coding slice should not start Cloudflare runtime automation yet. The current repository already has the safer static/local MVP pieces in place.

Reason:

- The site already has articles and a local pipeline.
- The biggest near-term risk is not missing infrastructure; it is publishing content that does not create search traffic or calculator movement.
- Search Console and GA4 calculator-click data should decide whether the article layer is worth scaling.

Recommended next implementation sequence:

1. Keep Cloudflare Worker/D1/Cron disabled until local reports show repeatable traction.
2. Add Cloudflare runtime only when manual reports become too slow or too frequent.
3. Start Cloudflare implementation with D1 schema and read-only collector persistence, not auto-publish.
4. Only then consider Cloudflare Worker/D1/Cron design implementation.

Do not start with:

- Cloudflare D1
- Cron
- LLM generation
- affiliate automation
- public admin dashboard

These are Phase 2 or Phase 3 items unless the local workflow becomes operationally painful.

Add those only after Search Console shows that the article layer creates real impressions, clicks, and calculator movement.

## Current Decision Points For User Review

- Keep `/articles/` as the issue-content namespace.
- Keep Phase 1 static and local-script based.
- Treat the already implemented safety hardening as the baseline before adding more content generation.
- Leave auto-publish disabled by default.
- Use Search Console CSV import before Search Console API.
- Defer Cloudflare Workers/D1/Cron until measurable traction exists.

## Phase 0 Review Output

This document is the reviewable implementation plan requested before additional production-code changes. The companion current-state file is `docs/mycalcstool-insight-current-state.md`.

Verification snapshot from the 2026-09-02 repository review:

- `npm run insights:test`: 102 tests passed.
- `node scripts/check-growth-homepage.mjs`: 13 checks passed.

Recommended user approval gate before coding:

- Approve keeping Phase 1 on the static/local-script architecture.
- Approve deferring Cloudflare Workers/D1/Cron until real traffic data supports the extra runtime.
- Approve using `/articles/` for issue content and preserving all existing calculator URLs.
