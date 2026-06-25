# Stock and AI Calculators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 20 new Korean and English calculator pages for stock/investing and AI cost topics with AEO/SEO-friendly content.

**Architecture:** Use one shared data file for calculator definitions and one shared Astro page component. Generate Korean pages through a root dynamic route and English pages through an `/en/` dynamic route, avoiding 20 near-duplicate page files.

**Tech Stack:** Astro 5, TypeScript, existing Tailwind classes, existing `BaseLayout`, `AdSlot`, `FAQ`, and static build.

---

## File Structure

- Create: `src/data/growth-calculators.ts`
- Create: `src/components/GrowthCalculatorPage.astro`
- Create: `src/pages/[growthCalculator].astro`
- Create: `src/pages/en/[growthCalculator].astro`
- Modify: `src/data/site-config.json`
- Modify: `src/data/en-calculators.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

## Shared Slugs

Korean:

- `stock-average-calculator`
- `stock-averaging-down-calculator`
- `stock-return-calculator`
- `dividend-calculator`
- `dividend-yield-calculator`
- `foreign-stock-return-calculator`
- `etf-investment-calculator`
- `ai-token-calculator`
- `chatgpt-api-cost-calculator`
- `ai-model-cost-comparison`

English:

- Same slug names under `/en/`.

## Task 1: Add Calculator Definitions

**Files:**
- Create: `src/data/growth-calculators.ts`

- [ ] **Step 1: Define the data types**

```ts
export type GrowthCalculatorId =
  | 'stock-average'
  | 'stock-averaging-down'
  | 'stock-return'
  | 'dividend'
  | 'dividend-yield'
  | 'foreign-stock-return'
  | 'etf-investment'
  | 'ai-token'
  | 'chatgpt-api-cost'
  | 'ai-model-cost-comparison';

export type GrowthCalculatorLang = 'ko' | 'en';

export interface GrowthField {
  id: string;
  label: string;
  suffix: string;
  value: string;
  min?: string;
  max?: string;
  step?: string;
  type?: 'number' | 'textarea';
}

export interface GrowthCalculatorPageData {
  id: GrowthCalculatorId;
  lang: GrowthCalculatorLang;
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string;
  category: string;
  icon: string;
  answer: string;
  fields: GrowthField[];
  resultLabels: string[];
  formula: string;
  example: string;
  mistakes: string[];
  disclaimer: string;
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ href: string; label: string; desc: string }>;
  sourceLinks?: Array<{ href: string; label: string }>;
}
```

- [ ] **Step 2: Add 20 page definitions**

Create `growthCalculatorPages` with one object for each KO and EN page. Every page must include a direct `answer`, visible `formula`, readable `example`, 3 `mistakes`, 3 `faqs`, and related links.

- [ ] **Step 3: Add lookup helpers**

```ts
export const growthCalculatorPages: GrowthCalculatorPageData[] = [];

export function getGrowthPagesByLang(lang: GrowthCalculatorLang): GrowthCalculatorPageData[] {
  return growthCalculatorPages.filter((page) => page.lang === lang);
}

export function getGrowthPageBySlug(lang: GrowthCalculatorLang, slug: string): GrowthCalculatorPageData | undefined {
  return growthCalculatorPages.find((page) => page.lang === lang && page.slug === slug);
}
```

## Task 2: Build Shared Page Renderer

**Files:**
- Create: `src/components/GrowthCalculatorPage.astro`

- [ ] **Step 1: Render SEO layout and visible content**

Use `BaseLayout` with `jsonLd` containing a `WebApplication` object. Render breadcrumb, H1, answer block, fields, result cards, formula, example, mistakes, source links, disclaimer, FAQ, and related links.

- [ ] **Step 2: Add client calculation script**

Add one script that reads `data-calculator-id`, input fields, and result elements. Implement a switch by calculator id:

```js
const calculators = {
  'stock-average': (v) => {
    const totalShares = v.currentShares + v.buyShares;
    const totalCost = v.currentShares * v.currentPrice + v.buyShares * v.buyPrice;
    const average = totalShares > 0 ? totalCost / totalShares : 0;
    return [average, totalShares, totalCost];
  },
};
```

Use `textContent`, not `innerHTML`, for dynamic output.

- [ ] **Step 3: Add safe formatting**

Use language-aware number formatting:

```js
function money(value, lang) {
  const currency = lang === 'ko' ? 'KRW' : 'USD';
  return new Intl.NumberFormat(lang === 'ko' ? 'ko-KR' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: lang === 'ko' ? 0 : 2,
  }).format(Number.isFinite(value) ? value : 0);
}
```

## Task 3: Add Dynamic Routes

**Files:**
- Create: `src/pages/[growthCalculator].astro`
- Create: `src/pages/en/[growthCalculator].astro`

- [ ] **Step 1: Korean route**

```astro
---
import GrowthCalculatorPage from '../components/GrowthCalculatorPage.astro';
import { getGrowthPagesByLang } from '../data/growth-calculators';

export function getStaticPaths() {
  return getGrowthPagesByLang('ko').map((page) => ({
    params: { growthCalculator: page.slug },
    props: { page },
  }));
}

const { page } = Astro.props;
---

<GrowthCalculatorPage page={page} />
```

- [ ] **Step 2: English route**

```astro
---
import GrowthCalculatorPage from '../../components/GrowthCalculatorPage.astro';
import { getGrowthPagesByLang } from '../../data/growth-calculators';

export function getStaticPaths() {
  return getGrowthPagesByLang('en').map((page) => ({
    params: { growthCalculator: page.slug },
    props: { page },
  }));
}

const { page } = Astro.props;
---

<GrowthCalculatorPage page={page} />
```

## Task 4: Register Metadata and Internal Links

**Files:**
- Modify: `src/data/site-config.json`
- Modify: `src/data/en-calculators.ts`
- Modify: `src/pages/index.astro`
- Modify: `src/pages/en/index.astro`

- [ ] **Step 1: Add Korean calculators to `site-config.json`**

Add all 10 Korean calculators in category `금융` or `AI`.

- [ ] **Step 2: Add English calculators to `en-calculators.ts`**

Extend `EnglishCalculatorSlug`, `englishCalculators`, and `relatedCalculatorKeys` for the 10 English pages.

- [ ] **Step 3: Add homepage discovery blocks**

Add concise sections on the Korean and English home pages for stock/investing and AI cost calculators. Keep these sections below primary finance calculators so the existing core remains intact.

## Task 5: Verify

**Files:**
- No direct file changes.

- [ ] **Step 1: Build**

Run:

```powershell
npm run build
```

Expected: exit code 0 and new static routes generated.

- [ ] **Step 2: Sitemap check**

Run:

```powershell
rg -n "stock-average-calculator|ai-token-calculator|ai-model-cost-comparison" dist\sitemap-*.xml dist\sitemap-index.xml
```

Expected: new URLs appear.

- [ ] **Step 3: HTML SEO check**

Run:

```powershell
rg -n "WebApplication|FAQPage|hreflang|평단가|AI Token" dist\stock-average-calculator\index.html dist\en\ai-token-calculator\index.html
```

Expected: all target terms appear.

- [ ] **Step 4: Browser DOM check**

Use installed Chrome headless to dump DOM for one KO page and one EN page. Confirm result cards contain computed non-empty values.

## Task 6: Commit and Push

**Files:**
- Commit all implementation files.

- [ ] **Step 1: Check status**

Run:

```powershell
git status --short
```

- [ ] **Step 2: Commit**

Run:

```powershell
git add src docs
git commit -m "feat: add stock and AI calculators"
```

- [ ] **Step 3: Push**

Run:

```powershell
git push origin master
```

- [ ] **Step 4: Live verification**

After Cloudflare Pages deploys, verify representative URLs:

- `https://mycalcstool.com/stock-average-calculator/`
- `https://mycalcstool.com/en/ai-token-calculator/`
