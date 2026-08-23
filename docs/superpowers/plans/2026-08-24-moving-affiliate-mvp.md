# Moving Affiliate MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a Korean moving cost calculator that routes users to the issued Adlix Daisa campaign link through a transparent affiliate handoff page.

**Architecture:** Keep the MVP static. The calculator runs in the browser, the handoff page is a normal Astro route, and the home page links to the calculator without changing the site's main finance/investing/AI positioning.

**Tech Stack:** Astro 5, TypeScript-in-Astro scripts, Tailwind utility classes, Cloudflare Pages static output.

**Spec:** `docs/superpowers/specs/2026-08-24-moving-affiliate-mvp-design.md`

## Global Constraints

- Do not embed Adlix iframe/input-form scripts.
- Do not collect names, phone numbers, moving addresses, or other lead data on mycalcstool.
- Do not add a database, click-log backend, admin panel, Cloudflare Function, KV, or campaign router engine.
- Do not alter the English site for this MVP.
- Do not add new dependencies.
- Use visible affiliate disclosure and `rel="sponsored noopener noreferrer"` on the outbound link.

---

### Task 1: Add Moving Cost Calculator Page

**Files:**
- Create: `src/pages/moving-cost-calculator.astro`

**Interfaces:**
- Consumes: `BaseLayout`, `AdSlot`, `FAQ`.
- Produces: route `/moving-cost-calculator/`.

- [x] **Step 1: Create page shell**

Use `BaseLayout` with Korean SEO title, description, keywords, JSON-LD `WebApplication`, and a top disclosure paragraph.

- [x] **Step 2: Add calculator form**

Add inputs with these IDs: `move-type`, `home-size`, `distance-km`, `floor-condition`, `packing-level`, `timing-level`, `calculate-moving`.

- [x] **Step 3: Add result and CTA sections**

Add output IDs: `moving-results`, `estimate-low`, `estimate-high`, `estimate-summary`, `factor-list`.

CTA must link to `/go/moving/`.

- [x] **Step 4: Add browser calculation script**

Implement a deterministic estimate:

```ts
const moveTypeBase = { small: 120000, oneroom: 250000, family: 550000 };
const sizeCost = pyeong * 12000;
const distanceCost = Math.max(0, distanceKm - 10) * 2500;
const floorExtra = { elevator: 0, stairsLow: 70000, stairsHigh: 150000 };
const packingMultiplier = { self: 1, half: 1.18, full: 1.35 };
const timingMultiplier = { weekday: 1, weekend: 1.12, peak: 1.25 };
const base = (moveTypeBase[type] + sizeCost + distanceCost + floorExtra[floor]) * packingMultiplier[packing] * timingMultiplier[timing];
const low = Math.round(base * 0.85 / 10000) * 10000;
const high = Math.round(base * 1.2 / 10000) * 10000;
```

- [x] **Step 5: Add SEO content**

Include methodology, quote variation reasons, multi-quote guidance, FAQ, related internal links, and final affiliate disclosure.

- [x] **Step 6: Verify page output**

Run: `npm run build`

Expected: build succeeds and includes `dist/moving-cost-calculator/index.html`.

---

### Task 2: Add Affiliate Handoff Page

**Files:**
- Create: `src/pages/go/moving.astro`

**Interfaces:**
- Consumes: issued Adlix URL `https://appu.kr/?i=12537659`.
- Produces: route `/go/moving/`.

- [x] **Step 1: Create handoff page**

Use `BaseLayout` with `noIndex={true}` because this is an outbound handoff page, not a search landing page.

- [x] **Step 2: Add disclosure and final button**

The final outbound anchor must be:

```html
<a href="https://appu.kr/?i=12537659" rel="sponsored noopener noreferrer" target="_blank">
```

- [x] **Step 3: Add safety copy**

State that mycalcstool provides the calculator only, the quote form is external, and users should review the external page's personal information terms before submitting.

- [x] **Step 4: Verify no iframe script**

Run: `rg -n "iframe|adwriteform|appu.kr/\\?i=12537659&t=" src/pages`

Expected: no iframe embed for the Adlix input form.

---

### Task 3: Link The Flow From Existing Navigation Surfaces

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `public/_redirects`

**Interfaces:**
- Consumes: `/moving-cost-calculator/` and `/go/moving/`.
- Produces: discoverable home card and trailing-slash redirects.

- [x] **Step 1: Add modest home section**

Add one "생활 비용 계산" section after AI tools and before "현재 집중 운영 범위". It should contain a single moving calculator card and mention that the main site focus remains finance/investing/AI.

- [x] **Step 2: Add redirects**

Add:

```text
/moving-cost-calculator /moving-cost-calculator/ 301
/go/moving /go/moving/ 301
```

- [x] **Step 3: Verify routes**

Run: `npm run build`

Expected: build succeeds and includes both new routes.

---

### Task 4: Final Verification And Commit

**Files:**
- Check: all changed files

**Interfaces:**
- Consumes: outputs from Tasks 1-3.
- Produces: committed implementation.

- [x] **Step 1: Run build**

Run: `npm run build`

Expected: PASS.

- [x] **Step 2: Check required strings**

Run:

```powershell
rg -n "sponsored noopener noreferrer|https://appu.kr/\\?i=12537659|moving-cost-calculator|go/moving" src public/_redirects
```

Expected: outbound link appears only on `/go/moving/`, calculator links to `/go/moving/`, and redirects exist.

- [x] **Step 3: Check prohibited embed**

Run:

```powershell
rg -n "adwriteform|appu.kr/\\?i=12537659&t=|<iframe" src/pages
```

Expected: no Adlix input-form iframe embed.

- [x] **Step 4: Commit**

Run:

```powershell
git add src/pages/moving-cost-calculator.astro src/pages/go/moving.astro src/pages/index.astro public/_redirects docs/superpowers/plans/2026-08-24-moving-affiliate-mvp.md
git commit -m "feat: add moving affiliate calculator flow"
```
