const unsupportedInvestmentPattern = /(매수\s*추천|매도\s*추천|무조건\s*(오른|내린|수익)|확정\s*수익|수익\s*보장|급등\s*보장)/i;
const promotionalPattern = /(임원\s*인사|조직개편|사회공헌|홍보|보도자료|행사)/i;

const topicRules = [
  {
    canonicalTopic: '기준금리 변화와 대출 이자 영향',
    category: 'finance',
    intent: ['POLICY_CHANGE', 'RATE', 'CALCULATOR'],
    keywords: ['기준금리', '대출금리', '금리 인하', '금리 인상', '주담대', '대출 이자'],
    sourceKeywords: ['기준금리'],
    score: 88,
  },
  {
    canonicalTopic: '연말정산과 환급액 영향',
    category: 'tax',
    intent: ['TAX', 'CALCULATOR', 'COST'],
    keywords: ['연말정산', '환급액', '소득공제', '세액공제', '원천징수'],
    sourceKeywords: ['연말정산'],
    score: 86,
  },
  {
    canonicalTopic: '월급과 연봉 실수령액 영향',
    category: 'salary',
    intent: ['SALARY', 'CALCULATOR', 'COST'],
    keywords: ['최저임금', '월급', '연봉', '실수령액', '4대보험'],
    sourceKeywords: ['최저임금', '실수령액'],
    score: 84,
  },
  {
    canonicalTopic: 'AI API 가격 변화와 월 사용료 영향',
    category: 'ai',
    intent: ['AI_COST', 'COMPARISON', 'COST'],
    keywords: ['openai', 'gpt', 'api', '토큰', 'token', '가격', '비용'],
    sourceKeywords: ['pricing', 'api', 'token'],
    score: 90,
  },
  {
    canonicalTopic: '환율 변화와 해외주식 원화 수익률 영향',
    category: 'investing',
    intent: ['INVESTMENT', 'RATE', 'CALCULATOR'],
    keywords: ['환율', '달러', '해외주식', '원화 수익률'],
    sourceKeywords: ['환율', 'exchange rate'],
    score: 82,
  },
];

function normalize(value) {
  return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

function pickRule(title) {
  const text = normalize(title);
  return topicRules.find((rule) => rule.keywords.some((keyword) => text.includes(normalize(keyword))));
}

function issueId(language, canonicalTopic) {
  return `${language}-${normalize(canonicalTopic).replace(/[^a-z0-9가-힣]+/g, '-').replace(/^-|-$/g, '')}`;
}

function rejectedIssue(raw, reason) {
  return {
    id: issueId(raw.language || 'ko', raw.title),
    canonicalTopic: raw.title,
    category: 'excluded',
    language: raw.language || 'ko',
    sourceCount: 1,
    relevanceScore: 10,
    intent: [],
    status: 'rejected',
    exclusionReasons: [reason],
    sources: [raw],
  };
}

export function analyzeIssues(rawIssues) {
  const clusters = new Map();
  const rejected = [];

  for (const raw of rawIssues) {
    const title = raw.title || '';

    if (unsupportedInvestmentPattern.test(title)) {
      rejected.push(rejectedIssue(raw, 'unsupported_investment_claim'));
      continue;
    }

    if (promotionalPattern.test(title)) {
      rejected.push(rejectedIssue(raw, 'promotional_or_irrelevant'));
      continue;
    }

    const rule = pickRule(title);
    if (!rule) {
      rejected.push({ ...rejectedIssue(raw, 'low_relevance'), relevanceScore: 25, status: 'review_required' });
      continue;
    }

    const language = raw.language || 'ko';
    const key = `${language}:${rule.canonicalTopic}`;
    const existing = clusters.get(key);

    if (existing) {
      existing.sources.push(raw);
      existing.sourceCount = existing.sources.length;
      existing.latestDetectedAt = raw.publishedAt || existing.latestDetectedAt;
      continue;
    }

    clusters.set(key, {
      id: issueId(language, rule.canonicalTopic),
      canonicalTopic: rule.canonicalTopic,
      category: rule.category,
      language,
      sourceCount: 1,
      relevanceScore: rule.score,
      intent: [...rule.intent],
      sourceKeywords: [...rule.sourceKeywords],
      status: 'analyzed',
      exclusionReasons: [],
      firstDetectedAt: raw.publishedAt,
      latestDetectedAt: raw.publishedAt,
      sources: [raw],
    });
  }

  return [...clusters.values(), ...rejected];
}
