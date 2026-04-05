export interface EnglishBlogPostMeta {
  slug: string;
  href: string;
  title: string;
  description: string;
  date: string;
  category: 'Health' | 'Money & Finance' | 'Math & Utility';
  readTime: string;
  tags: string[];
}

export const englishBlogPosts: EnglishBlogPostMeta[] = [
  {
    slug: 'due-date-guide',
    href: '/en/blog/due-date-guide',
    title: 'How to Calculate Your Due Date — Pregnancy Due Date Methods Explained',
    description: 'Learn how pregnancy due dates are calculated using Naegele\'s Rule, ultrasound dating, and IVF methods. Understand the 40-week timeline and why only 5% of babies arrive on the exact due date.',
    date: '2026-04-05',
    category: 'Health',
    readTime: '8 min read',
    tags: ['pregnancy', 'due-date', 'ivf', 'lmp', 'health'],
  },
  {
    slug: 'pmi-guide-how-private-mortgage-insurance-works',
    href: '/en/blog/pmi-guide-how-private-mortgage-insurance-works',
    title: 'PMI Guide: What Private Mortgage Insurance Costs and When It Ends',
    description: 'Learn what PMI is, how private mortgage insurance affects your monthly payment, and when borrowers can usually remove it.',
    date: '2026-04-02',
    category: 'Money & Finance',
    readTime: '8 min read',
    tags: ['mortgage', 'pmi', 'home-buying', 'monthly-payment', 'finance'],
  },
  {
    slug: 'biweekly-vs-semi-monthly-pay-guide',
    href: '/en/blog/biweekly-vs-semi-monthly-pay-guide',
    title: 'Biweekly vs Semi-Monthly Pay: Why Your Paycheck Amount Changes',
    description: 'Understand the difference between biweekly and semi-monthly pay, why paycheck amounts differ, and how to budget around your real pay schedule.',
    date: '2026-04-02',
    category: 'Money & Finance',
    readTime: '7 min read',
    tags: ['salary', 'paycheck', 'pay-frequency', 'budgeting', 'finance'],
  },
  {
    slug: 'simple-vs-compound-interest-guide',
    href: '/en/blog/simple-vs-compound-interest-guide',
    title: 'Simple vs Compound Interest: Why Time Changes the Outcome',
    description: 'See the difference between simple and compound interest, compare the formulas, and understand why compounding matters over time.',
    date: '2026-04-02',
    category: 'Money & Finance',
    readTime: '7 min read',
    tags: ['interest', 'compound-interest', 'savings', 'investing', 'finance'],
  },
  {
    slug: 'percentage-increase-calculator-guide',
    href: '/en/blog/percentage-increase-calculator-guide',
    title: 'Percentage Increase Calculator: Formula, Examples, and Common Mistakes',
    description: 'Learn how to calculate percentage increase step by step, see real examples, avoid common mistakes, and use a free percentage increase calculator online.',
    date: '2026-04-01',
    category: 'Math & Utility',
    readTime: '7 min read',
    tags: ['percentage', 'percentage-increase', 'math', 'formula', 'utility'],
  },
  {
    slug: 'percentage-change-vs-percentage-increase',
    href: '/en/blog/percentage-change-vs-percentage-increase',
    title: 'Percentage Change vs Percentage Increase: What Is the Difference?',
    description: 'Understand the difference between percentage change, percentage increase, and percentage decrease with simple formulas and examples.',
    date: '2026-03-31',
    category: 'Math & Utility',
    readTime: '6 min read',
    tags: ['percentage', 'percentage-change', 'percentage-increase', 'math', 'utility'],
  },
  {
    slug: 'salary-calculator-guide-gross-vs-net-pay',
    href: '/en/blog/salary-calculator-guide-gross-vs-net-pay',
    title: 'Salary Calculator Guide: Gross Pay vs Net Pay Explained',
    description: 'Learn the difference between gross pay and net pay, what gets deducted from a paycheck, and how to estimate take-home income.',
    date: '2026-03-30',
    category: 'Money & Finance',
    readTime: '8 min read',
    tags: ['salary', 'gross-pay', 'net-pay', 'paycheck', 'finance'],
  },
  {
    slug: 'how-much-house-can-i-afford-guide',
    href: '/en/blog/how-much-house-can-i-afford-guide',
    title: 'How Much House Can I Afford? A Practical Mortgage Guide',
    description: 'Estimate how much house you can afford based on income, debt, down payment, and monthly payment.',
    date: '2026-03-29',
    category: 'Money & Finance',
    readTime: '9 min read',
    tags: ['mortgage', 'affordability', 'home-buying', 'salary', 'finance'],
  },
  {
    slug: '30-year-vs-15-year-mortgage-guide',
    href: '/en/blog/30-year-vs-15-year-mortgage-guide',
    title: '30-Year vs 15-Year Mortgage: Monthly Payment vs Total Interest',
    description: 'Compare 30-year and 15-year mortgages, including monthly payment, total interest, and long-term tradeoffs.',
    date: '2026-03-28',
    category: 'Money & Finance',
    readTime: '7 min read',
    tags: ['mortgage', 'loan-term', 'interest', 'monthly-payment', 'finance'],
  },
  {
    slug: 'extra-mortgage-payments-guide',
    href: '/en/blog/extra-mortgage-payments-guide',
    title: 'How Extra Mortgage Payments Can Reduce Interest and Loan Time',
    description: 'See how extra mortgage payments work, why they reduce interest, and when paying extra principal makes sense.',
    date: '2026-03-27',
    category: 'Money & Finance',
    readTime: '6 min read',
    tags: ['mortgage', 'extra-payments', 'principal', 'interest', 'finance'],
  },
  {
    slug: 'how-to-calculate-exact-age',
    href: '/en/blog/how-to-calculate-exact-age',
    title: 'How to Calculate Exact Age in Years, Months, and Days',
    description: 'Learn how to calculate exact age from date of birth, including years, months, days, total days lived, and next birthday logic.',
    date: '2026-04-05',
    category: 'Math & Utility',
    readTime: '7 min read',
    tags: ['age', 'date-calculation', 'birthday', 'days-lived', 'utility'],
  },
  {
    slug: 'due-date-calculator-guide',
    href: '/en/blog/due-date-calculator-guide',
    title: 'Due Date Calculator Guide: LMP vs Conception vs IVF',
    description: 'Learn how estimated due dates are calculated using LMP, conception date, or IVF transfer date.',
    date: '2026-03-25',
    category: 'Health',
    readTime: '7 min read',
    tags: ['pregnancy', 'due-date', 'conception', 'ivf', 'health'],
  },
  {
    slug: 'tip-calculator-split-bill-guide',
    href: '/en/blog/tip-calculator-split-bill-guide',
    title: 'Tip Calculator Guide: How to Split a Bill Fairly',
    description: 'Learn how to calculate a tip, split a bill fairly, and avoid common mistakes when dining with friends or large groups.',
    date: '2026-03-24',
    category: 'Math & Utility',
    readTime: '6 min read',
    tags: ['tip', 'split-bill', 'restaurant', 'percentage', 'utility'],
  },
  {
    slug: 'how-many-calories-should-i-eat-per-day',
    href: '/en/blog/how-many-calories-should-i-eat-per-day',
    title: 'How Many Calories Should I Eat Per Day? TDEE, Goals, and a Practical Starting Point',
    description: 'Learn how many calories to eat per day for maintenance, fat loss, or muscle gain using TDEE, activity level, and practical adjustment rules.',
    date: '2026-04-05',
    category: 'Health',
    readTime: '8 min read',
    tags: ['tdee', 'calories', 'weight-loss', 'nutrition', 'health'],
  },
  {
    slug: 'bmi-guide',
    href: '/en/blog/bmi-guide',
    title: 'What Is a Healthy BMI? How to Check and What Your Number Actually Means',
    description: 'Learn how BMI is calculated, what the categories mean, where body mass index is useful, and where it falls short as a health screening tool.',
    date: '2026-04-05',
    category: 'Health',
    readTime: '8 min read',
    tags: ['bmi', 'body-mass-index', 'weight', 'health', 'screening'],
  },
  {
    slug: 'tariffs-household-cost',
    href: '/en/blog/tariffs-household-cost',
    title: 'How Much Are Tariffs Costing You in 2026? A Household Breakdown',
    description: 'The average American household is paying $600–$1,800 more per year due to 2026 tariffs. See which products cost more, who gets hit hardest, and how to estimate your own burden.',
    date: '2026-04-01',
    category: 'Money & Finance',
    readTime: '7 min read',
    tags: ['tariffs', 'inflation', 'budget', 'household-cost', 'finance'],
  },
  {
    slug: 'tipping-guide',
    href: '/en/blog/tipping-guide',
    title: 'How Much to Tip in 2026 — The Complete US Tipping Guide',
    description: 'Confused about tipping in America? This guide covers restaurants, bars, hotels, rideshare, delivery, and more — with a free tip calculator.',
    date: '2026-03-31',
    category: 'Money & Finance',
    readTime: '6 min read',
    tags: ['tip', 'tipping', 'restaurant', 'money', 'etiquette'],
  },
  {
    slug: 'calorie-calculator-guide',
    href: '/en/blog/calorie-calculator-guide',
    title: 'Calorie Calculator Guide: How to Find Your Daily Calorie Target',
    description: 'A step-by-step guide to using a calorie calculator to find your BMR, TDEE, and personalized calorie target for weight loss, maintenance, or muscle gain.',
    date: '2026-04-05',
    category: 'Health',
    readTime: '8 min read',
    tags: ['calories', 'bmr', 'tdee', 'weight-loss', 'nutrition', 'health'],
  },
  {
    slug: 'days-between-dates-guide',
    href: '/en/blog/days-between-dates-guide',
    title: 'How to Calculate Days Between Dates — Date Math Explained',
    description: 'Learn how to calculate the exact number of days between two dates, count business days, and plan ahead with date difference tools.',
    date: '2026-04-05',
    category: 'Math & Utility',
    readTime: '6 min read',
    tags: ['date-calculator', 'days-between', 'business-days', 'countdown', 'utility'],
  },
  {
    slug: 'unit-converter-guide',
    href: '/en/blog/unit-converter-guide',
    title: 'Unit Conversion Guide: Length, Weight, Temperature & More',
    description: 'Master the most common unit conversions — miles to km, lbs to kg, Fahrenheit to Celsius, and more — with formulas and a free online converter.',
    date: '2026-04-05',
    category: 'Math & Utility',
    readTime: '7 min read',
    tags: ['unit-converter', 'metric', 'imperial', 'conversion', 'utility'],
  },
  {
    slug: 'how-to-lose-weight-with-calorie-deficit',
    href: '/en/blog/how-to-lose-weight-with-calorie-deficit',
    title: 'How to Lose Weight Safely Using a Calorie Deficit',
    description: 'Understand how a calorie deficit causes weight loss, how large it should be, and practical tips to maintain it without feeling deprived.',
    date: '2026-04-05',
    category: 'Health',
    readTime: '9 min read',
    tags: ['calorie-deficit', 'weight-loss', 'calories', 'diet', 'health'],
  },
  {
    slug: 'what-is-a-good-salary-in-the-us',
    href: '/en/blog/what-is-a-good-salary-in-the-us',
    title: 'What Is a Good Salary in the US? A State-by-State Breakdown',
    description: 'Explore what counts as a good salary in the United States by state, household size, and cost of living — with take-home pay estimates.',
    date: '2026-04-05',
    category: 'Money & Finance',
    readTime: '9 min read',
    tags: ['salary', 'income', 'take-home-pay', 'cost-of-living', 'finance'],
  },
  {
    slug: 'first-time-homebuyer-guide',
    href: '/en/blog/first-time-homebuyer-guide',
    title: 'First-Time Homebuyer\'s Guide: How Much House Can You Afford in 2026?',
    description: 'Everything first-time homebuyers need to know: down payment, mortgage math, credit score requirements, and how to estimate your buying power.',
    date: '2026-04-05',
    category: 'Money & Finance',
    readTime: '10 min read',
    tags: ['mortgage', 'first-time-homebuyer', 'home-buying', 'down-payment', 'finance'],
  },
  {
    slug: 'bmi-calculator-guide',
    href: '/en/blog/bmi-calculator-guide',
    title: 'BMI Calculator Guide: How to Check and Interpret Your BMI',
    description: 'Learn how to use a BMI calculator, what BMI categories mean, and what steps to take based on your result.',
    date: '2026-04-04',
    category: 'Health',
    readTime: '7 min read',
    tags: ['bmi', 'body-mass-index', 'health', 'weight', 'calculator-guide'],
  },
  {
    slug: 'age-calculator-guide-how-old-am-i',
    href: '/en/blog/age-calculator-guide-how-old-am-i',
    title: 'Age Calculator Guide: How Old Am I Exactly?',
    description: 'Find out how to calculate your exact age in years, months, and days — and what an age calculator can tell you beyond just the year.',
    date: '2026-04-04',
    category: 'Math & Utility',
    readTime: '5 min read',
    tags: ['age', 'birthday', 'date-calculation', 'how-old', 'utility'],
  },
];

export function getEnglishBlogPostBySlug(slug: string): EnglishBlogPostMeta | undefined {
  return englishBlogPosts.find((post) => post.slug === slug);
}

export function getRelatedEnglishBlogPosts(slug: string, limit = 3): EnglishBlogPostMeta[] {
  const current = getEnglishBlogPostBySlug(slug);
  if (!current) {
    return [];
  }

  return englishBlogPosts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const overlap = post.tags.filter((tag) => current.tags.includes(tag)).length;
      const score = overlap * 10 + (post.category === current.category ? 4 : 0);

      return { post, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .slice(0, limit)
    .map(({ post }) => post);
}
