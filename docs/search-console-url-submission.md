# Google Search Console URL 제출 목록

기준일: 2026-04-25

## 1. Sitemap 제출

Search Console의 `Sitemaps` 메뉴에는 아래 1개만 제출합니다.

- `https://mycalcstool.com/sitemap-index.xml`

빌드 검증 기준 sitemap에는 76개 URL이 포함됩니다. 아래 legacy redirect URL은 sitemap에서 제외했습니다.

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
