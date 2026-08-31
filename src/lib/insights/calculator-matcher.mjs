import { calculatorMetadata } from '../../data/calculator-metadata.mjs';

const intentBoosts = {
  CALCULATOR: 16,
  COST: 10,
  RATE: 8,
  POLICY_CHANGE: 8,
  TAX: 10,
  SALARY: 10,
  INVESTMENT: 10,
  AI_COST: 16,
  COMPARISON: 8,
};

function normalize(value) {
  return String(value || '').toLowerCase();
}

function keywordScore(text, keywords) {
  return keywords.reduce((score, keyword) => {
    return text.includes(normalize(keyword)) ? score + 22 : score;
  }, 0);
}

export function matchCalculators(issue, options = {}) {
  const threshold = options.threshold ?? 60;
  const text = normalize([issue.title, issue.category, ...(issue.intent || [])].join(' '));
  const intents = new Set(issue.intent || []);

  return calculatorMetadata
    .filter((calculator) => !issue.language || calculator.language === issue.language)
    .map((calculator) => {
      const categoryBoost = calculator.category === issue.category ? 12 : 0;
      const matchedKeywordScore = keywordScore(text, calculator.keywords);
      const matchedIntentScore = [...intents].reduce((score, intent) => score + (intentBoosts[intent] || 0), 0);
      const score = Math.min(100, matchedKeywordScore + categoryBoost + matchedIntentScore);

      return {
        id: calculator.id,
        path: calculator.path,
        name: calculator.name,
        score,
      };
    })
    .filter((match) => match.score >= threshold)
    .sort((left, right) => right.score - left.score)
    .slice(0, options.limit ?? 3);
}

