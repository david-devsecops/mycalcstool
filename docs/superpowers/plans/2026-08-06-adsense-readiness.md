# AdSense Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve AdSense approval readiness without adding dependencies or changing the site's deployment model.

**Architecture:** Reuse the current Astro layouts, homepages, trust pages, and shared growth calculator template. The work is content and configuration focused, with one monetization default change.

**Tech Stack:** Astro 5, TypeScript, Tailwind CSS, static Cloudflare Pages output.

## Global Constraints

- Keep all calculations client-side.
- Do not add third-party packages.
- Do not remove existing calculator URLs.
- Keep health and utility calculators available, but position them as supporting tools.
- Keep copy factual and non-promotional.

---

### Task 1: Monetization Default

**Files:**
- Modify: `src/data/site-meta.ts`

**Interfaces:**
- Consumes: `PUBLIC_AD_PROVIDER`, `PUBLIC_ADSENSE_CLIENT`
- Produces: `adProvider`

- [ ] Change `adProvider` so it returns `adsense` only when `PUBLIC_AD_PROVIDER` is exactly `adsense` and a client ID exists.
- [ ] Build and inspect generated HTML for absence of the AdSense script in the default environment.

### Task 2: Homepage Positioning

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

**Interfaces:**
- Consumes: existing calculator arrays and `siteMeta`
- Produces: stronger finance-first homepage copy and internal links

- [ ] Update titles/descriptions toward finance-first calculator positioning.
- [ ] Add trust/review sections above the tool grids.
- [ ] Keep all existing calculator links intact.

### Task 3: Calculator Page Depth

**Files:**
- Modify: `src/components/GrowthCalculatorPage.astro`

**Interfaces:**
- Consumes: `page.fields`, `page.resultLabels`, `page.category`, `page.sourceLinks`
- Produces: generated checklist, interpretation, and review sections

- [ ] Add localized labels for input checklist, result interpretation, and review policy.
- [ ] Render field-specific input checks and result-label-specific interpretation steps.
- [ ] Render a review note dated August 6, 2026.

### Task 4: Trust Pages

**Files:**
- Modify: `src/pages/about.astro`
- Modify: `src/pages/en/about.astro`
- Modify: `src/pages/methodology.astro`
- Modify: `src/pages/en/methodology.astro`
- Modify: `src/pages/contact.astro`

**Interfaces:**
- Consumes: `siteMeta.contactEmail`
- Produces: stronger editorial scope, correction process, and methodology disclosure

- [ ] Expand About pages with what the site does and does not do.
- [ ] Expand Methodology pages with investing and AI cost assumptions.
- [ ] Expand Contact page with correction workflow expectations.

### Task 5: Verification and Release

**Files:**
- Inspect generated `dist`

**Interfaces:**
- Consumes: built static site
- Produces: verified build and git commit

- [ ] Run `npm run build`.
- [ ] Check generated homepage and representative calculator HTML markers.
- [ ] Commit implementation.
- [ ] Push `master` if the user still wants live deployment.
