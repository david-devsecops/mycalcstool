# MyCalcsTool Cloudflare Phase 2 Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` before implementing this design. This document is a Phase 2 design, not authorization to add Workers, D1, Queues, Cron, or public admin routes now.

**Goal:** Move the proven local `Issue -> Information -> Calculator -> Revenue` pipeline to Cloudflare runtime only after Search Console and calculator-click data show that the article layer creates useful traffic.

**Current decision:** Do not add Cloudflare runtime infrastructure during Phase 1. Keep the public site as Astro static output on Cloudflare Pages.

**References checked on 2026-08-31:**

- Cloudflare Workers Cron Triggers: https://developers.cloudflare.com/workers/configuration/cron-triggers/
- Cloudflare Workers scheduled handler: https://developers.cloudflare.com/workers/runtime-apis/handlers/scheduled/
- Cloudflare Queues overview: https://developers.cloudflare.com/queues/
- Cloudflare Queues getting started: https://developers.cloudflare.com/queues/get-started/
- Cloudflare Workers local data / Miniflare: https://developers.cloudflare.com/workers/local-development/local-data/

## Phase 2 Entry Criteria

Start Phase 2 only when all conditions below are true for at least 30 days.

- Search Console shows article impressions growing week over week.
- At least one article reaches `GROWING` or `WINNER` in the local report.
- Article-to-calculator CTA events are visible in GA4.
- Published articles have no source, duplicate-topic, or public-copy quality incidents.
- Local `data/insights/reports/latest.md` is too manual or too slow for the operating cadence.
- The owner accepts Cloudflare runtime cost and operational complexity.

Do not start Phase 2 just because automation is technically possible.

## Runtime Boundary

Cloudflare runtime should collect, analyze, validate, queue, and report candidates. It should not render public article pages dynamically in Phase 2.

Keep public serving path:

1. Astro static site builds `dist`.
2. Cloudflare Pages serves static calculators and published articles.
3. Only approved article data is committed to `src/data/articles.mjs`.

Add runtime path:

1. Cron-triggered Worker collects issue signals.
2. Worker writes raw issues and automation runs to D1.
3. Queue consumer batches analysis and source validation.
4. Candidate records stay in D1 until reviewed or exported.
5. Publishing still goes through Git-backed static build unless a later phase explicitly changes that.

## Worker Layout

Recommended files when Phase 2 starts:

- `workers/insights/wrangler.toml`
- `workers/insights/src/index.mjs`
- `workers/insights/src/collector.mjs`
- `workers/insights/src/analyzer.mjs`
- `workers/insights/src/source-validator.mjs`
- `workers/insights/src/report.mjs`
- `workers/insights/migrations/0001_insights.sql`

Keep worker modules close to the existing local modules. Port rules from `src/lib/insights/*` instead of inventing a second policy model.

## Bindings

Planned bindings:

- `DB`: D1 database for issues, sources, candidates, backlog, metrics, and run logs.
- `ISSUE_QUEUE`: Queue for collected issue batches.
- `AUTOMATION_ENABLED`: plain variable, default `false`.
- `ENABLE_ISSUE_COLLECTOR`: plain variable, default `false` until live tests pass.
- `ENABLE_ARTICLE_GENERATION`: plain variable, default `false`.
- `ENABLE_AUTO_PUBLISH`: plain variable, default `false`.
- `ENABLE_SOURCE_REACHABILITY`: plain variable, default `true`.
- `MAX_ARTICLES_PER_DAY`: plain variable, default `1`, hard cap `2`.

Secrets:

- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `OPENAI_API_KEY`, only if LLM drafting is explicitly added later
- `ANTHROPIC_API_KEY`, only if LLM drafting is explicitly added later
- `GOOGLE_SEARCH_CONSOLE_CLIENT_EMAIL`, only if Search Console API replaces CSV import later
- `GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY`, only if Search Console API replaces CSV import later

Never commit secret values or put them in Pages public environment variables.

## D1 Schema

The D1 schema should mirror current JSONL shapes so local data can migrate without rewriting the product model.

```sql
CREATE TABLE issues (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  canonical_topic TEXT NOT NULL,
  category TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'ko',
  source_count INTEGER NOT NULL DEFAULT 1,
  trend_score INTEGER NOT NULL DEFAULT 0,
  relevance_score INTEGER NOT NULL DEFAULT 0,
  intent_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL,
  first_detected_at TEXT,
  latest_detected_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_issues_language_topic
  ON issues(language, canonical_topic);

CREATE TABLE issue_sources (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source_name TEXT,
  published_at TEXT,
  is_official INTEGER NOT NULL DEFAULT 0,
  collected_at TEXT NOT NULL,
  FOREIGN KEY (issue_id) REFERENCES issues(id)
);

CREATE UNIQUE INDEX idx_issue_sources_url
  ON issue_sources(url);

CREATE TABLE article_candidates (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'ko',
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  summary_json TEXT NOT NULL DEFAULT '[]',
  body_json TEXT NOT NULL DEFAULT '[]',
  category TEXT NOT NULL,
  quality_score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  scheduled_at TEXT,
  published_at TEXT,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (issue_id) REFERENCES issues(id)
);

CREATE UNIQUE INDEX idx_article_candidates_language_slug
  ON article_candidates(language, slug);

CREATE TABLE article_sources (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  checked_at TEXT NOT NULL,
  FOREIGN KEY (article_id) REFERENCES article_candidates(id)
);

CREATE TABLE article_calculators (
  id TEXT PRIMARY KEY,
  article_id TEXT NOT NULL,
  calculator_id TEXT NOT NULL,
  calculator_path TEXT NOT NULL,
  relevance_score INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (article_id) REFERENCES article_candidates(id)
);

CREATE TABLE calculator_backlog (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  reason TEXT NOT NULL,
  category TEXT NOT NULL,
  related_issue_id TEXT,
  estimated_demand INTEGER NOT NULL DEFAULT 0,
  priority INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE content_metrics (
  id TEXT PRIMARY KEY,
  article_slug TEXT NOT NULL,
  date TEXT NOT NULL,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  ctr REAL NOT NULL DEFAULT 0,
  average_position REAL NOT NULL DEFAULT 0,
  pageviews INTEGER NOT NULL DEFAULT 0,
  calculator_clicks INTEGER NOT NULL DEFAULT 0,
  adsense_revenue REAL NOT NULL DEFAULT 0,
  affiliate_revenue REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_content_metrics_article_date
  ON content_metrics(article_slug, date);

CREATE TABLE automation_runs (
  id TEXT PRIMARY KEY,
  job_name TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT,
  status TEXT NOT NULL,
  items_processed INTEGER NOT NULL DEFAULT 0,
  items_failed INTEGER NOT NULL DEFAULT 0,
  estimated_cost REAL NOT NULL DEFAULT 0,
  error_message TEXT
);
```

## Cron Jobs

Cron should call Workers scheduled handlers for background work only.

Initial schedules:

- Collector: every 60 minutes.
- Analyzer: every 60 minutes, offset from collector if configured separately.
- Report builder: daily at a low-traffic hour.

Rules:

- Cron must not publish directly to the public site.
- Cron must respect `AUTOMATION_ENABLED=false`.
- Cron must respect `ENABLE_AUTO_PUBLISH=false`.
- Cron must stop creating new candidates when daily budget flags are exceeded.
- Cron failure must write an `automation_runs` row.

## Queue Usage

Use Queues only when one Worker invocation starts doing too much work.

Good queue messages:

- Raw issue batch collected from Naver.
- Issue ids that need source validation.
- Article candidate ids that need quality review.
- Metrics import batches if Search Console API is added later.

Queue rules:

- Message payloads should contain ids and small metadata, not full article bodies.
- Consumers should be idempotent by issue id, source URL, and article slug.
- Failed validation messages should move to a dead-letter queue only after repeated failure.
- A transient official-source timeout should keep the issue in `review_required`, not permanently reject it.

## Quality Gates

Port the current local gates first:

- Duplicate slug gate.
- Duplicate canonical topic gate.
- Official source allowlist gate.
- Official source reachability gate.
- Numeric claim source gate.
- Calculator match gate.
- Banned claim gate.
- Daily publish cap gate.

Do not add an LLM quality reviewer until the rule-based Cloudflare version matches local reports.

## Publishing Model

Phase 2 should keep Git-backed publishing.

Approved flow:

1. Candidate reaches `publish_candidate`.
2. Owner reviews local or admin report.
3. Candidate is exported to an article data patch.
4. Patch updates `src/data/articles.mjs`.
5. `npm run insights:test` and `npm run build` pass.
6. Git push triggers Cloudflare Pages deployment.

Rejected flow:

- `rejected` stays in D1 for audit.
- Duplicate and source failures are not deleted automatically.
- `review_required` can be edited or rechecked.

## Emergency Stop

Primary emergency action:

- Set `AUTOMATION_ENABLED=false`.

Secondary controls:

- Set `ENABLE_ISSUE_COLLECTOR=false`.
- Set `ENABLE_ARTICLE_GENERATION=false`.
- Set `ENABLE_AUTO_PUBLISH=false`.
- Disable Cron triggers in the Worker configuration.
- Pause Queue consumers if repeated failures continue.

Existing calculators must keep serving because they remain static Pages output.

## Rollback

If runtime collection fails:

1. Set `AUTOMATION_ENABLED=false`.
2. Keep Cloudflare Pages serving the existing static site.
3. Inspect `automation_runs` and failed queue messages.
4. Fix runtime code in preview or local Miniflare.
5. Re-enable collector only after a clean dry run.

If a bad article is published:

1. Change its `status` away from `published` in `src/data/articles.mjs` or revert the article commit.
2. Run `npm run insights:test`.
3. Run `npm run build`.
4. Push rollback commit.
5. Use Search Console removal only if the page is harmful and urgent.

If D1 data is wrong:

1. Disable automation flags.
2. Export affected D1 rows for audit.
3. Apply a migration or corrective script.
4. Do not delete historical `automation_runs`.

## Local Development

Use local data before touching production bindings.

Required local checks before any Phase 2 deployment:

- `npx wrangler dev --test-scheduled` can trigger the scheduled handler locally.
- Local D1 migrations apply cleanly.
- Queue consumer handles duplicate messages idempotently.
- Source validation timeout path is tested.
- No secret is required for `npm run build`.

## Phase 2 Task Order

1. Create Worker shell with `AUTOMATION_ENABLED=false`.
2. Add D1 migration matching the schema above.
3. Port collector write path from JSONL to D1.
4. Port analyzer read/write path from JSONL to D1.
5. Add source validation worker path.
6. Add queue only if collector/analyzer cannot finish reliably inside scheduled runs.
7. Add report export from D1 to Markdown.
8. Add dry-run deployment to Cloudflare preview.
9. Run 7 days with collection only.
10. Enable article candidate generation, still no auto-publish.

## Non-Goals

- No public dynamic article rendering.
- No public admin dashboard until authentication and access control are designed.
- No automatic publication to production Pages.
- No affiliate or CPA automation.
- No LLM drafting until official-source and calculator matching data prove the topic pipeline is useful.
