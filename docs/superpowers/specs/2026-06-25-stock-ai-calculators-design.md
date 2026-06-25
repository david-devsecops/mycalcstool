# Stock and AI Calculator Expansion Design

## Goal

Add 10 high-intent traffic topics in Korean and English/global form, producing 20 new calculator pages that fit mycalcstool's existing calculator-first positioning.

## Approved Topics

1. 주식 평단가 계산기 / Stock Average Cost Calculator
2. 주식 물타기 계산기 / Stock Averaging Down Calculator
3. 주식 수익률 계산기 / Stock Return Calculator
4. 배당금 계산기 / Dividend Calculator
5. 배당수익률 계산기 / Dividend Yield Calculator
6. 해외주식 환율 수익률 계산기 / Foreign Stock FX Return Calculator
7. ETF 적립식 투자 계산기 / ETF Recurring Investment Calculator
8. AI 토큰 계산기 / AI Token Calculator
9. ChatGPT API 비용 계산기 / ChatGPT API Cost Calculator
10. GPT vs Claude vs Gemini 비용 비교 계산기 / AI Model Cost Comparison Calculator

## Scope

Each topic gets one Korean calculator page under `/` and one English page under `/en/`.

Do not add separate blog posts in this phase. Each calculator page includes a readable guide section so the site gains useful content without creating thin duplicate pages.

Do not provide stock picks, buy/sell signals, target prices, financial advice, or model recommendations. Pages only calculate user-provided scenarios.

## Page Pattern

Each page must include:

- A concise H1 that matches the calculator intent.
- A short answer block near the top explaining what the page calculates.
- Input fields with safe default values.
- Result cards with the main output.
- Formula section.
- Practical example.
- Common mistakes section.
- FAQ component.
- Related calculator links.
- Clear disclaimer for investment or AI pricing assumptions.

## AEO and SEO Requirements

Follow Google's current guidance that AEO/GEO work for Google Search is still foundational SEO, not separate hacks. Pages should focus on useful, crawlable, non-commodity content rather than special AI-only files.

Implementation requirements:

- Use indexable HTML content, not content hidden behind client-only rendering.
- Use question-style H2/H3 headings where they match real user intent.
- Put a direct answer in the first 1-2 paragraphs.
- Include visible formulas and examples, not only JavaScript output.
- Add `WebApplication` JSON-LD for each calculator.
- Use the existing `FAQ` component for visible FAQs and FAQPage JSON-LD.
- Use canonical URLs and KO/EN hreflang pairs.
- Keep URL slugs short and descriptive.
- Add new pages to existing calculator metadata so internal links and sitemap discovery improve.
- Keep page copy original and specific to the tool; avoid boilerplate topic rewrites.

Reference guidance:

- Google generative AI search guidance: foundational SEO still applies, special AEO/GEO hacks are not required.
- Google structured data guidance: structured data should describe visible page content.
- Google helpful content guidance: financial pages need trustworthy, people-first content.

## UX and Readability Requirements

- Keep paragraphs short.
- Use result cards and tables for scanning.
- Prefer plain language over jargon.
- On mobile, inputs stack cleanly and results remain readable.
- Use existing styles: `BaseLayout`, `AdSlot`, `FAQ`, `card`, `section-title`, `input-field`, and `btn-primary`.
- Do not add new dependencies.

## Calculation Requirements

Stock pages:

- Average cost: combine current shares/cost with new buy shares/price and show new average cost and total invested.
- Averaging down: calculate new average cost, total shares, required rebound to break even, and investment increase.
- Stock return: calculate total return amount and return percentage after fees/taxes if provided.
- Dividend: calculate expected annual/monthly dividends from shares and dividend per share.
- Dividend yield: calculate yield from annual dividend and stock price.
- Foreign stock FX return: calculate local-currency return including buy/sell FX rates.
- ETF recurring investment: calculate estimated future value from initial amount, monthly contribution, annual return, and years.

AI pages:

- AI token: estimate tokens from text length using a simple visible approximation, and allow manual input/output token values.
- ChatGPT API cost: calculate cost from input tokens, output tokens, request count, and selected price preset.
- AI model comparison: compare GPT, Claude, and Gemini using editable per-million token prices.

AI price defaults must be easy to edit in page scripts. Pages must state that users should confirm current prices on official provider pricing pages.

## Data and Navigation

Update:

- `src/data/site-config.json` for Korean calculators.
- `src/data/en-calculators.ts` for English calculators.
- Korean and English home/category surfaces if needed so the new calculators are discoverable.
- Related calculator arrays so stock tools link to stock tools and AI tools link to AI tools.

## Verification

Before completion:

- Run `npm run build`.
- Check generated sitemap includes the new pages.
- Check representative KO and EN pages contain expected title, formula copy, FAQ schema, and hreflang.
- Run a lightweight browser/DOM check for one stock page and one AI page to ensure default calculations render.

## Rollout

Create pages and metadata in one implementation branch/commit sequence. Push to `master` only after local build passes.
