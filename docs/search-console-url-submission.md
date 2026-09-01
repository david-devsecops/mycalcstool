# Google Search Console URL 제출 목록

기준일: 2026-08-31

## 1. Sitemap 제출

Search Console의 `Sitemaps` 메뉴에는 아래 1개만 제출합니다.

- `https://mycalcstool.com/sitemap-index.xml`

배포 전 로컬에서는 아래 순서로 sitemap을 검증합니다.

```powershell
npm run build
npm run insights:verify:sitemap
```

전체 배포 전 검증은 아래 한 줄로 실행할 수 있습니다.

```powershell
npm run verify:release
```

빌드 검증 기준 sitemap에는 51개 indexable URL이 포함됩니다. 아래 legacy redirect URL은 sitemap에서 제외했습니다.

- `https://mycalcstool.com/en/blog/age-calculator-guide-how-old-am-i/`
- `https://mycalcstool.com/en/blog/bmi-calculator-guide/`
- `https://mycalcstool.com/en/blog/calorie-deficit-guide-using-tdee/`

## 2. 수동 색인 요청 우선순위

Search Console의 `URL 검사`에서 아래 URL을 먼저 검사하고 색인 요청합니다. 한 번에 너무 많이 요청하지 말고 핵심 페이지부터 진행합니다.

### 승인 신뢰 페이지

- `https://mycalcstool.com/`
- `https://mycalcstool.com/about/`
- `https://mycalcstool.com/contact/`
- `https://mycalcstool.com/methodology/`
- `https://mycalcstool.com/privacy/`
- `https://mycalcstool.com/terms/`

### 한국어 핵심 금융 계산기

- `https://mycalcstool.com/loan/`
- `https://mycalcstool.com/salary/`
- `https://mycalcstool.com/tax-refund/`
- `https://mycalcstool.com/compound/`
- `https://mycalcstool.com/severance/`

### 한국어 금융 가이드

- `https://mycalcstool.com/articles/`
- `https://mycalcstool.com/articles/base-rate-loan-interest-impact/`
- `https://mycalcstool.com/articles/year-end-tax-refund-paycheck-impact/`
- `https://mycalcstool.com/articles/openai-api-price-change-cost-planning/`
- `https://mycalcstool.com/blog/`
- `https://mycalcstool.com/blog/loan-repayment-method-guide/`
- `https://mycalcstool.com/blog/fixed-vs-variable-rate-guide/`
- `https://mycalcstool.com/blog/prepayment-fee-break-even-guide/`
- `https://mycalcstool.com/blog/salary-take-home-pay-guide/`
- `https://mycalcstool.com/blog/gross-vs-net-salary-guide/`
- `https://mycalcstool.com/blog/year-end-tax-refund-guide/`
- `https://mycalcstool.com/blog/card-deduction-guide/`
- `https://mycalcstool.com/blog/severance-pay-guide/`
- `https://mycalcstool.com/blog/compound-interest-guide/`

### 영어 핵심 페이지

- `https://mycalcstool.com/en/`
- `https://mycalcstool.com/en/about/`
- `https://mycalcstool.com/en/contact/`
- `https://mycalcstool.com/en/methodology/`
- `https://mycalcstool.com/en/privacy/`
- `https://mycalcstool.com/en/terms/`
- `https://mycalcstool.com/en/mortgage-calculator/`
- `https://mycalcstool.com/en/salary-calculator/`
- `https://mycalcstool.com/en/compound-interest-calculator/`

### 영어 금융 가이드

- `https://mycalcstool.com/en/blog/`
- `https://mycalcstool.com/en/blog/how-much-house-can-i-afford-guide/`
- `https://mycalcstool.com/en/blog/30-year-vs-15-year-mortgage-guide/`
- `https://mycalcstool.com/en/blog/extra-mortgage-payments-guide/`
- `https://mycalcstool.com/en/blog/pmi-guide-how-private-mortgage-insurance-works/`
- `https://mycalcstool.com/en/blog/first-time-homebuyer-guide/`
- `https://mycalcstool.com/en/blog/salary-calculator-guide-gross-vs-net-pay/`
- `https://mycalcstool.com/en/blog/what-is-a-good-salary-in-the-us/`
- `https://mycalcstool.com/en/blog/biweekly-vs-semi-monthly-pay-guide/`
- `https://mycalcstool.com/en/blog/simple-vs-compound-interest-guide/`

## 3. 당장 수동 요청하지 않아도 되는 URL

아래는 sitemap에 포함되어 있으므로 크롤링을 기다려도 됩니다. Search Console에서 노출이 생기면 제목과 설명을 조정합니다.

- 건강 계산기: `/bmi/`, `/calorie/`, `/tdee/`, `/due-date/`
- 생활 계산기: `/dday/`, `/age-calculator/`, `/percentage-calculator/`, `/unit-converter/`, `/tip-calculator/`
- 영어 건강/생활 계산기: `/en/bmi-calculator/`, `/en/calorie-calculator/`, `/en/tdee-calculator/`, `/en/due-date-calculator/`, `/en/age-calculator/`, `/en/days-calculator/`, `/en/percentage-calculator/`, `/en/tip-calculator/`, `/en/unit-converter/`

## 4. 제출하지 말아야 할 URL

아래 URL은 301 리디렉션 대상이므로 Search Console 수동 색인 요청 대상에서 제외합니다.

- `https://mycalcstool.com/en/blog/age-calculator-guide-how-old-am-i/`
- `https://mycalcstool.com/en/blog/bmi-calculator-guide/`
- `https://mycalcstool.com/en/blog/calorie-deficit-guide-using-tdee/`

## 5. Search Console CSV 성과 수집

Search Console의 `실적` 메뉴에서 페이지 기준 CSV를 내려받은 뒤 로컬에서 아래 명령으로 가져옵니다.

```powershell
npm run insights:metrics:import -- path\to\search-console-pages.csv
npm run insights:report
```

CSV에서 `/articles/` URL만 `data/insights/content-metrics.jsonl`에 저장됩니다. 이후 `data/insights/reports/latest.md`의 `Content Metrics`, `Performance Classification`, `Published Article Audit` 섹션을 확인합니다.

지원 CSV 헤더:

- 영어: `Top pages`, `Clicks`, `Impressions`, `CTR`, `Position`
- 한국어: `상위 페이지`, `클릭수`, `노출수`, `CTR`, `게재순위`

성과 분류 기준:

- `NEW`: 발행 14일 이내라 판단 보류
- `WINNER`: 클릭 10 이상, 노출 100 이상, 평균 순위 10위 이내
- `GROWING`: 노출 50 이상이고 클릭이 발생한 성장 후보
- `UNDERPERFORM`: 노출은 있으나 클릭률 또는 평균 순위가 약한 개선 후보
- `DEAD`: 발행 후 45일 이상 지났고 노출이 없는 통합/개선 검토 후보
- `NORMAL`: 위 조건에 해당하지 않는 일반 관찰 대상

## 6. GA4 기사 상호작용 CSV 성과 수집

GA4에서는 기사 유입과 이동 흐름을 함께 확인합니다. CSV에 페이지 경로, 이벤트 이름, 이벤트 라벨, 이벤트 수가 포함되도록 내보낸 뒤 아래 명령으로 가져옵니다.

```powershell
npm run insights:metrics:import:ga4 -- path\to\ga4-article-interactions.csv
npm run insights:report
```

CSV에서 아래 이벤트만 `data/insights/content-metrics.jsonl`에 저장됩니다. 이벤트 라벨에는 계산기 ID나 article slug만 사용하며, 사용자가 입력한 금액·연봉·대출잔액 같은 값은 저장하지 않습니다.

- `article_calculator_click`: 기사에서 계산기로 이동
- `article_related_article_click`: 기사에서 다른 기사로 이동
- `article_index_article_click`: 기사 목록에서 기사로 이동
- `calculator_related_article_click`: 계산기에서 관련 기사로 이동

지원 CSV 헤더:

- 영어: `Page path and screen class`, `Event name`, `Event label`, `Event count`
- 한국어: `페이지 경로 및 화면 클래스`, `이벤트 이름`, `이벤트 라벨`, `이벤트 수`

리포트에서 봐야 할 기준:

- Search Console 클릭은 검색 유입입니다.
- GA4 계산기 클릭은 기사에서 실제 도구로 이동한 전환입니다.
- GA4 기사 이동 클릭은 내부 링크가 다음 글 탐색을 만드는지 보여줍니다.
- GA4 계산기에서 기사로 이동한 클릭은 계산기 방문자가 설명 콘텐츠도 필요로 하는지 보여줍니다.
- 노출은 있는데 검색 클릭이 낮으면 제목과 설명을 고칩니다.
- 검색 클릭은 있는데 계산기 클릭이 낮으면 본문 예제와 CTA 위치를 고칩니다.
- 둘 다 없으면 같은 주제 글을 늘리지 말고 통합, 보류, noindex 후보로 봅니다.
