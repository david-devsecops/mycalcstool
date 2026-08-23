# Moving Affiliate MVP Design

## Goal

Add the first CPA-ready monetization flow for mycalcstool without turning the site into a thin affiliate landing page.

The first campaign is Adlix's "다이사 이사 가격비교" campaign. The issued promotion URL is:

```text
https://appu.kr/?i=12537659
```

## Scope

Build a utility-first moving cost calculator and route the affiliate offer through a clear disclosure page.

In scope:

- Create `/moving-cost-calculator/` as a Korean moving cost estimate calculator.
- Create `/go/moving/` as an internal affiliate disclosure and outbound handoff page.
- Add the moving calculator to the Korean home page as a small "생활 비용 계산" card.
- Add trailing-slash redirects for the new pages.
- Use visible affiliate disclosure and `rel="sponsored noopener noreferrer"` on the outbound link.

Out of scope:

- Do not embed Adlix iframe/input-form scripts.
- Do not collect names, phone numbers, moving addresses, or other lead data on mycalcstool.
- Do not add a database, click-log backend, admin panel, Cloudflare Function, KV, or campaign router engine yet.
- Do not alter the English site for this MVP.
- Do not add new dependencies.

## User Flow

1. A visitor opens `/moving-cost-calculator/`.
2. The visitor enters moving type, home size, distance, floor/elevator conditions, packing option, and timing.
3. The calculator shows an estimated range and explains which inputs most affected the result.
4. A visible affiliate disclosure appears before the CTA.
5. The CTA links to `/go/moving/`.
6. `/go/moving/` explains that the visitor is leaving mycalcstool for an Adlix partner offer.
7. The final button opens `https://appu.kr/?i=12537659`.

## Calculator Model

The calculator should be simple, transparent, and editable in one file.

Inputs:

- Moving type: small move, one-room, apartment/family move.
- Home size: pyeong.
- Distance: km.
- Floor/elevator condition: elevator available, stairs low floor, stairs high floor.
- Packing: self-pack, half-pack, full-pack.
- Timing: weekday, weekend, peak season.

Output:

- Low estimate in KRW.
- High estimate in KRW.
- Short interpretation sentence.
- Cost factor list.

The formula is an estimate, not a quote. Copy must say that actual prices vary by date, volume, parking, ladder truck, region, and mover.

## Compliance

The moving calculator page must include a disclosure near the top and near the CTA:

```text
이 페이지에는 제휴 링크가 포함되어 있으며, 상담 신청 등 일정 조건이 충족되면 mycalcstool이 애드릭스 포인트 또는 커미션을 받을 수 있습니다.
```

The outbound Adlix link must use:

```html
rel="sponsored noopener noreferrer"
```

The page must not imply that mycalcstool is the moving company, Adlix, or Daisa. It should say that mycalcstool provides a calculator and sends visitors to an external partner page for quote comparison.

## SEO And AdSense Constraints

This page should be indexable because it contains a real calculator, original explanatory copy, methodology, FAQ, and limitations.

The page should not be a thin affiliate page. Required content:

- Calculator visible above the fold.
- Explanation of how the estimate is calculated.
- Common reasons actual quotes differ.
- When to compare multiple moving estimates.
- FAQ.
- Related internal links.

The home page link should be modest and contextual. Do not pivot the entire homepage away from the current finance/investing/AI focus.

## Files

Expected files:

- Create `src/pages/moving-cost-calculator.astro`.
- Create `src/pages/go/moving.astro`.
- Modify `src/pages/index.astro`.
- Modify `public/_redirects`.

No new package dependencies are needed.

## Verification

Minimum verification:

- `npm run build`
- Confirm generated routes include `/moving-cost-calculator/` and `/go/moving/`.
- Confirm outbound link has `rel="sponsored noopener noreferrer"`.
- Confirm Adlix iframe scripts are not embedded.

## Deferred Work

Add a real campaign router only after there are multiple CPA campaigns or enough traffic to justify click analytics.

Future route if needed:

- `src/data/affiliate-campaigns.ts`
- `functions/go/[slug].ts`
- Cloudflare Analytics/KV or another click event sink

Until then, static pages are enough.
