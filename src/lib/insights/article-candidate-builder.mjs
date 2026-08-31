import { evaluateArticleCandidate } from './quality-gate.mjs';

const categoryLabels = {
  finance: '금융',
  tax: '세금',
  salary: '급여',
  support: '정부지원',
  investing: '투자',
  ai: 'AI',
};

const articleTemplates = {
  '기준금리 변화와 대출 이자 영향': {
    slug: 'base-rate-loan-interest-impact',
    title: '기준금리가 바뀌면 내 대출 이자는 얼마나 달라질까?',
    description: '기준금리 변화가 대출 이자와 월 납입액에 어떤 식으로 연결되는지 계산기와 함께 확인합니다.',
    summary: [
      '기준금리는 대출금리와 같지는 않지만 시장금리와 은행 조달비용을 통해 영향을 줄 수 있습니다.',
      '실제 영향은 변동금리 여부, 금리 조정 주기, 대출 잔액에 따라 달라집니다.',
      '대출 잔액과 금리 차이를 넣어 월 납입액과 총 이자 변화를 직접 계산해야 합니다.',
    ],
    sections: [
      {
        heading: '무엇이 달라졌는지 먼저 확인하세요',
        body: '기준금리 이슈는 발표 내용만 보고 판단하지 말고 내 대출의 금리 산정 방식과 조정 주기를 함께 확인해야 합니다.',
      },
      {
        heading: '내 대출에 영향을 주는 조건',
        body: '변동금리 대출은 시장금리 변화를 반영할 수 있지만 고정금리 대출은 약정 기간 동안 영향이 제한적일 수 있습니다.',
      },
      {
        heading: '내 조건으로 계산하는 방법',
        body: '대출 잔액, 남은 기간, 현재 금리, 예상 금리 차이를 입력해 월 납입액과 총 이자 차이를 비교하세요.',
      },
    ],
  },
  'AI API 가격 변화와 월 사용료 영향': {
    slug: 'openai-api-price-change-cost-planning',
    title: 'AI API 가격이 바뀌면 월 사용료는 어떻게 달라질까?',
    description: 'AI API 비용은 입력 토큰, 출력 토큰, 요청 수, 모델 단가가 함께 결정합니다.',
    summary: [
      'API 비용은 요청 수만이 아니라 입력 토큰과 출력 토큰 단가를 나눠 봐야 합니다.',
      '모델별 단가가 바뀌면 같은 사용량에서도 월 비용이 달라질 수 있습니다.',
      '공식 가격표의 최신 단가를 확인한 뒤 계산기에 직접 입력하는 방식이 안전합니다.',
    ],
    sections: [
      {
        heading: 'API 비용을 구성하는 값',
        body: '월 요청 수, 요청당 입력 토큰, 요청당 출력 토큰, 모델별 단가가 합쳐져 월 사용료가 됩니다.',
      },
      {
        heading: '가격 변경 시 확인할 항목',
        body: '입력 토큰 단가, 출력 토큰 단가, 캐시나 배치 같은 별도 과금 구조가 있는지 확인해야 합니다.',
      },
      {
        heading: '내 사용량으로 계산하는 방법',
        body: '평균 토큰 수와 월 요청 수를 정한 뒤 공식 가격표의 단가를 계산기에 넣어 시나리오별 비용을 비교하세요.',
      },
    ],
  },
};

function fallbackTemplate(issue) {
  return {
    slug: issue.id,
    title: `${issue.canonicalTopic}: 내 금액에는 어떤 영향이 있을까?`,
    description: `${issue.canonicalTopic} 이슈가 실제 비용, 수령액, 계산 조건에 어떤 영향을 줄 수 있는지 확인합니다.`,
    summary: [
      '공식 출처의 적용 내용과 날짜를 먼저 확인해야 합니다.',
      '사용자에게 미치는 영향은 개인 조건과 기관별 기준에 따라 달라질 수 있습니다.',
      '관련 계산기에 내 조건을 입력해 직접 비교하는 것이 안전합니다.',
    ],
    sections: [
      { heading: '무엇을 확인해야 하나요?', body: '공식 출처의 변경 내용, 적용일, 대상 조건을 먼저 확인해야 합니다.' },
      { heading: '내 경우에는 무엇이 달라지나요?', body: '소득, 대출 잔액, 투자 금액, 사용량처럼 개인 조건에 따라 결과가 달라질 수 있습니다.' },
      { heading: '어떻게 계산하나요?', body: '관련 계산기에 내 조건을 입력해 변경 전후 금액을 비교하세요.' },
    ],
  };
}

function toArticleCandidate(issue, now) {
  const template = articleTemplates[issue.canonicalTopic] || fallbackTemplate(issue);
  const primarySource = issue.officialSources[0];

  return {
    id: `article-${issue.id}`,
    issueId: issue.id,
    canonicalTopic: issue.canonicalTopic,
    language: issue.language,
    slug: template.slug,
    title: template.title,
    description: template.description,
    category: issue.category,
    categoryLabel: categoryLabels[issue.category] || issue.category,
    summary: template.summary,
    sections: template.sections,
    numericClaims: primarySource ? [{ claim: '공식 출처 확인 필요 수치', sourceUrl: primarySource.url }] : [],
    calculatorMatches: issue.calculatorMatches || [],
    officialSources: issue.officialSources || [],
    disclaimerType: issue.category,
    updatedAt: now,
  };
}

export function buildArticleCandidates(issueCandidates, options = {}) {
  const now = options.now || new Date().toISOString();

  return issueCandidates
    .filter((issue) => issue.status === 'source_verified')
    .map((issue) => {
      const candidate = toArticleCandidate(issue, now);
      const quality = evaluateArticleCandidate(candidate, {
        existingSlugs: options.existingSlugs || [],
        existingCanonicalTopics: options.existingCanonicalTopics || [],
      });

      return {
        ...candidate,
        qualityScore: quality.score,
        status: quality.status,
        qualityErrors: quality.errors,
        qualityWarnings: quality.warnings,
      };
    });
}
