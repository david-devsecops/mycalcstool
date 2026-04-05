export type EnglishCalculatorSlug =
  | 'age-calculator'
  | 'bmi-calculator'
  | 'calorie-calculator'
  | 'compound-interest-calculator'
  | 'days-calculator'
  | 'due-date-calculator'
  | 'mortgage-calculator'
  | 'percentage-calculator'
  | 'salary-calculator'
  | 'tdee-calculator'
  | 'tip-calculator'
  | 'unit-converter';

export interface EnglishCalculatorMeta {
  slug: EnglishCalculatorSlug;
  href: string;
  title: string;
  description: string;
  icon: string;
  category: 'Finance' | 'Health' | 'Math & Utility';
}

export const englishCalculators: Record<EnglishCalculatorSlug, EnglishCalculatorMeta> = {
  'calorie-calculator': {
    slug: 'calorie-calculator',
    href: '/en/calorie-calculator',
    title: 'Calorie Calculator',
    description: 'Calculate daily calorie needs, BMR, TDEE, and macro targets for your goal.',
    icon: '🔥',
    category: 'Health',
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
  'due-date-calculator': {
    slug: 'due-date-calculator',
    href: '/en/due-date-calculator',
    title: 'Due Date Calculator',
    description: 'Estimate pregnancy due date and track milestones by week.',
    icon: '👶',
    category: 'Health',
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
  'age-calculator': ['due-date-calculator', 'days-calculator', 'percentage-calculator'],
  'bmi-calculator': ['calorie-calculator', 'tdee-calculator', 'unit-converter'],
  'calorie-calculator': ['tdee-calculator', 'bmi-calculator', 'unit-converter'],
  'compound-interest-calculator': ['mortgage-calculator', 'salary-calculator', 'percentage-calculator'],
  'days-calculator': ['age-calculator', 'due-date-calculator', 'percentage-calculator'],
  'due-date-calculator': ['age-calculator', 'days-calculator', 'bmi-calculator'],
  'mortgage-calculator': ['salary-calculator', 'compound-interest-calculator', 'percentage-calculator'],
  'percentage-calculator': ['tip-calculator', 'compound-interest-calculator', 'salary-calculator'],
  'salary-calculator': ['mortgage-calculator', 'compound-interest-calculator', 'percentage-calculator'],
  'tdee-calculator': ['calorie-calculator', 'bmi-calculator', 'unit-converter'],
  'tip-calculator': ['percentage-calculator', 'salary-calculator', 'unit-converter'],
  'unit-converter': ['calorie-calculator', 'bmi-calculator', 'percentage-calculator'],
};

export function getRelatedEnglishCalculators(slug: EnglishCalculatorSlug): EnglishCalculatorMeta[] {
  return relatedCalculatorKeys[slug].map((key) => englishCalculators[key]);
}
