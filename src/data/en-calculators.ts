export type EnglishCalculatorSlug =
  | 'age-calculator'
  | 'ai-model-cost-comparison'
  | 'ai-token-calculator'
  | 'bmi-calculator'
  | 'calorie-calculator'
  | 'chatgpt-api-cost-calculator'
  | 'compound-interest-calculator'
  | 'days-calculator'
  | 'dividend-calculator'
  | 'dividend-yield-calculator'
  | 'due-date-calculator'
  | 'etf-investment-calculator'
  | 'foreign-stock-return-calculator'
  | 'mortgage-calculator'
  | 'percentage-calculator'
  | 'salary-calculator'
  | 'stock-average-calculator'
  | 'stock-averaging-down-calculator'
  | 'stock-return-calculator'
  | 'tdee-calculator'
  | 'tip-calculator'
  | 'unit-converter';

export interface EnglishCalculatorMeta {
  slug: EnglishCalculatorSlug;
  href: string;
  title: string;
  description: string;
  icon: string;
  category: 'Finance' | 'Health' | 'Math & Utility' | 'AI';
}

export const englishCalculators: Record<EnglishCalculatorSlug, EnglishCalculatorMeta> = {
  'ai-model-cost-comparison': {
    slug: 'ai-model-cost-comparison',
    href: '/en/ai-model-cost-comparison',
    title: 'AI Model Cost Comparison',
    description: 'Compare GPT, Claude, and Gemini API costs for the same token workload.',
    icon: '⚖️',
    category: 'AI',
  },
  'ai-token-calculator': {
    slug: 'ai-token-calculator',
    href: '/en/ai-token-calculator',
    title: 'AI Token Calculator',
    description: 'Estimate AI input and output tokens before calculating API costs.',
    icon: '🤖',
    category: 'AI',
  },
  'calorie-calculator': {
    slug: 'calorie-calculator',
    href: '/en/calorie-calculator',
    title: 'Calorie Calculator',
    description: 'Calculate daily calorie needs, BMR, TDEE, and macro targets for your goal.',
    icon: '🔥',
    category: 'Health',
  },
  'chatgpt-api-cost-calculator': {
    slug: 'chatgpt-api-cost-calculator',
    href: '/en/chatgpt-api-cost-calculator',
    title: 'ChatGPT API Cost Calculator',
    description: 'Estimate API cost from input tokens, output tokens, calls, and pricing.',
    icon: '💬',
    category: 'AI',
  },
  'days-calculator': {
    slug: 'days-calculator',
    href: '/en/days-calculator',
    title: 'Days Between Dates',
    description: 'Count days, weeks, and months between any two dates or until an event.',
    icon: '📅',
    category: 'Math & Utility',
  },
  'age-calculator': {
    slug: 'age-calculator',
    href: '/en/age-calculator',
    title: 'Age Calculator',
    description: 'Calculate your exact age in years, months, days, and total days lived.',
    icon: '🎂',
    category: 'Math & Utility',
  },
  'bmi-calculator': {
    slug: 'bmi-calculator',
    href: '/en/bmi-calculator',
    title: 'BMI Calculator',
    description: 'Check your body mass index, weight category, and healthy weight range.',
    icon: '⚖️',
    category: 'Health',
  },
  'compound-interest-calculator': {
    slug: 'compound-interest-calculator',
    href: '/en/compound-interest-calculator',
    title: 'Compound Interest Calculator',
    description: 'Estimate future savings growth with recurring contributions and compounding.',
    icon: '📈',
    category: 'Finance',
  },
  'dividend-calculator': {
    slug: 'dividend-calculator',
    href: '/en/dividend-calculator',
    title: 'Dividend Calculator',
    description: 'Estimate annual, after-tax, and monthly average dividend income.',
    icon: '💵',
    category: 'Finance',
  },
  'dividend-yield-calculator': {
    slug: 'dividend-yield-calculator',
    href: '/en/dividend-yield-calculator',
    title: 'Dividend Yield Calculator',
    description: 'Calculate dividend yield from share price and annual dividend.',
    icon: '🏦',
    category: 'Finance',
  },
  'due-date-calculator': {
    slug: 'due-date-calculator',
    href: '/en/due-date-calculator',
    title: 'Due Date Calculator',
    description: 'Estimate pregnancy due date and track milestones by week.',
    icon: '👶',
    category: 'Health',
  },
  'etf-investment-calculator': {
    slug: 'etf-investment-calculator',
    href: '/en/etf-investment-calculator',
    title: 'ETF Recurring Investment',
    description: 'Estimate ETF future value from monthly contributions and return assumptions.',
    icon: '📈',
    category: 'Finance',
  },
  'foreign-stock-return-calculator': {
    slug: 'foreign-stock-return-calculator',
    href: '/en/foreign-stock-return-calculator',
    title: 'Foreign Stock FX Return',
    description: 'Calculate local-currency stock return including exchange rate changes.',
    icon: '🌎',
    category: 'Finance',
  },
  'mortgage-calculator': {
    slug: 'mortgage-calculator',
    href: '/en/mortgage-calculator',
    title: 'Mortgage Calculator',
    description: 'Estimate monthly payments with taxes, insurance, and PMI.',
    icon: '🏠',
    category: 'Finance',
  },
  'percentage-calculator': {
    slug: 'percentage-calculator',
    href: '/en/percentage-calculator',
    title: 'Percentage Calculator',
    description: 'Work out percentages, percentage change, and percent of a number.',
    icon: '💯',
    category: 'Math & Utility',
  },
  'salary-calculator': {
    slug: 'salary-calculator',
    href: '/en/salary-calculator',
    title: 'Salary Calculator',
    description: 'Estimate take-home pay after federal, state, and payroll taxes.',
    icon: '💵',
    category: 'Finance',
  },
  'stock-average-calculator': {
    slug: 'stock-average-calculator',
    href: '/en/stock-average-calculator',
    title: 'Stock Average Cost',
    description: 'Calculate new average share cost after buying more stock.',
    icon: '📊',
    category: 'Finance',
  },
  'stock-averaging-down-calculator': {
    slug: 'stock-averaging-down-calculator',
    href: '/en/stock-averaging-down-calculator',
    title: 'Stock Averaging Down',
    description: 'Estimate new average cost and rebound needed to break even.',
    icon: '📉',
    category: 'Finance',
  },
  'stock-return-calculator': {
    slug: 'stock-return-calculator',
    href: '/en/stock-return-calculator',
    title: 'Stock Return Calculator',
    description: 'Calculate stock profit, loss, and percentage return after costs.',
    icon: '💹',
    category: 'Finance',
  },
  'tdee-calculator': {
    slug: 'tdee-calculator',
    href: '/en/tdee-calculator',
    title: 'TDEE Calculator',
    description: 'Estimate daily calorie needs, BMR, and maintenance calories.',
    icon: '🔥',
    category: 'Health',
  },
  'tip-calculator': {
    slug: 'tip-calculator',
    href: '/en/tip-calculator',
    title: 'Tip Calculator',
    description: 'Calculate gratuity, total bill, and split amount per person.',
    icon: '🍽️',
    category: 'Math & Utility',
  },
  'unit-converter': {
    slug: 'unit-converter',
    href: '/en/unit-converter',
    title: 'Unit Converter',
    description: 'Convert length, weight, temperature, volume, and speed units.',
    icon: '📐',
    category: 'Math & Utility',
  },
};

const relatedCalculatorKeys: Record<EnglishCalculatorSlug, EnglishCalculatorSlug[]> = {
  'age-calculator': ['due-date-calculator', 'bmi-calculator', 'percentage-calculator'],
  'ai-model-cost-comparison': ['chatgpt-api-cost-calculator', 'ai-token-calculator', 'compound-interest-calculator'],
  'ai-token-calculator': ['chatgpt-api-cost-calculator', 'ai-model-cost-comparison', 'compound-interest-calculator'],
  'bmi-calculator': ['tdee-calculator', 'due-date-calculator', 'age-calculator'],
  'calorie-calculator': ['tdee-calculator', 'bmi-calculator', 'days-calculator'],
  'chatgpt-api-cost-calculator': ['ai-token-calculator', 'ai-model-cost-comparison', 'compound-interest-calculator'],
  'compound-interest-calculator': ['mortgage-calculator', 'salary-calculator', 'etf-investment-calculator'],
  'days-calculator': ['age-calculator', 'due-date-calculator', 'percentage-calculator'],
  'dividend-calculator': ['dividend-yield-calculator', 'stock-average-calculator', 'stock-return-calculator'],
  'dividend-yield-calculator': ['dividend-calculator', 'stock-return-calculator', 'etf-investment-calculator'],
  'due-date-calculator': ['age-calculator', 'bmi-calculator', 'tdee-calculator'],
  'etf-investment-calculator': ['compound-interest-calculator', 'dividend-yield-calculator', 'stock-return-calculator'],
  'foreign-stock-return-calculator': ['stock-return-calculator', 'stock-average-calculator', 'dividend-calculator'],
  'mortgage-calculator': ['salary-calculator', 'compound-interest-calculator', 'etf-investment-calculator'],
  'percentage-calculator': ['tip-calculator', 'age-calculator', 'compound-interest-calculator'],
  'salary-calculator': ['mortgage-calculator', 'compound-interest-calculator', 'stock-average-calculator'],
  'stock-average-calculator': ['stock-averaging-down-calculator', 'stock-return-calculator', 'dividend-yield-calculator'],
  'stock-averaging-down-calculator': ['stock-average-calculator', 'stock-return-calculator', 'foreign-stock-return-calculator'],
  'stock-return-calculator': ['stock-average-calculator', 'dividend-calculator', 'foreign-stock-return-calculator'],
  'tdee-calculator': ['bmi-calculator', 'calorie-calculator', 'due-date-calculator'],
  'tip-calculator': ['percentage-calculator', 'salary-calculator', 'age-calculator'],
  'unit-converter': ['percentage-calculator', 'bmi-calculator', 'age-calculator'],
};

export function getRelatedEnglishCalculators(slug: EnglishCalculatorSlug): EnglishCalculatorMeta[] {
  return relatedCalculatorKeys[slug].map((key) => englishCalculators[key]);
}
