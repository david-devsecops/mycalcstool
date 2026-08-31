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
    faqs: [
      {
        question: '기준금리가 바뀌면 내 대출금리도 바로 바뀌나요?',
        answer: '바로 같은 폭으로 바뀌지는 않습니다. 변동금리 여부, 기준금리 반영 주기, 은행의 가산금리와 우대금리 조건을 함께 확인해야 합니다.',
      },
      {
        question: '금리 변화폭만 알면 이자 차이를 계산할 수 있나요?',
        answer: '대출 잔액, 남은 기간, 상환 방식이 함께 필요합니다. 같은 금리 차이라도 원금이 줄어드는 속도에 따라 총 이자 차이가 달라질 수 있습니다.',
      },
    ],
  },
  '연말정산과 환급액 영향': {
    slug: 'year-end-tax-refund-paycheck-impact',
    title: '연말정산 기준이 바뀌면 내 환급액은 얼마나 달라질까?',
    description: '연말정산 변경 사항이 공제, 결정세액, 환급액에 어떤 영향을 줄 수 있는지 계산기와 함께 확인합니다.',
    summary: [
      '연말정산 결과는 소득, 원천징수액, 공제 항목, 세액공제 적용 여부에 따라 달라집니다.',
      '제도 변경이 있어도 모든 근로자의 환급액이 같은 방향으로 바뀌지는 않습니다.',
      '공식 안내를 확인한 뒤 내 급여와 공제 조건으로 환급 가능성을 직접 계산해야 합니다.',
    ],
    sections: [
      {
        heading: '무엇이 달라졌는지 확인하세요',
        body: '공제 항목, 적용 대상, 적용 연도, 제출 서류가 바뀌었는지 공식 안내에서 먼저 확인해야 합니다.',
      },
      {
        heading: '환급액에 영향을 주는 조건',
        body: '총급여, 이미 낸 세금, 인적공제, 카드 사용액, 보험료, 의료비처럼 개인별 입력값에 따라 결과가 달라집니다.',
      },
      {
        heading: '내 조건으로 계산하는 방법',
        body: '급여와 공제 항목을 정리한 뒤 연말정산 계산기에 입력해 추가 납부 또는 환급 가능성을 비교하세요.',
      },
    ],
    faqs: [
      {
        question: '연말정산 환급액은 월급이 오른 것인가요?',
        answer: '아닙니다. 매월 미리 낸 세금과 최종 세액을 비교한 결과 이미 낸 세금 일부를 돌려받는 경우가 많습니다.',
      },
      {
        question: '환급액이 크면 항상 좋은 건가요?',
        answer: '반드시 그렇지는 않습니다. 월별 원천징수액과 공제 적용 결과이므로 연간 현금흐름을 함께 확인해야 합니다.',
      },
    ],
  },
  '월급과 연봉 실수령액 영향': {
    slug: 'salary-take-home-pay-impact',
    title: '월급이나 최저임금이 바뀌면 내 실수령액은 얼마나 달라질까?',
    description: '월급, 연봉, 최저임금 변화가 4대보험과 세후 실수령액에 미치는 영향을 계산기와 함께 확인합니다.',
    summary: [
      '세전 급여가 올라도 국민연금, 건강보험, 고용보험, 소득세 반영 후 실수령액은 다르게 증가할 수 있습니다.',
      '최저임금 이슈는 월 환산액과 실제 근로시간, 수당 조건을 함께 확인해야 합니다.',
      '연봉 또는 월급을 입력해 세후 실수령액 차이를 직접 비교하는 방식이 가장 안전합니다.',
    ],
    sections: [
      {
        heading: '무엇이 바뀌었는지 확인하세요',
        body: '최저임금, 급여 기준, 4대보험 요율, 소득세 간이세액표처럼 실수령액에 영향을 주는 항목을 구분해야 합니다.',
      },
      {
        heading: '실수령액에 영향을 주는 조건',
        body: '부양가족 수, 비과세 급여, 보험료 기준, 회사 공제 방식에 따라 같은 연봉이어도 월 수령액은 달라질 수 있습니다.',
      },
      {
        heading: '내 조건으로 계산하는 방법',
        body: '연봉 또는 월급, 비과세 항목, 부양가족 조건을 넣어 세전 금액과 세후 금액의 차이를 확인하세요.',
      },
    ],
    faqs: [
      {
        question: '세전 월급이 오르면 실수령액도 같은 비율로 오르나요?',
        answer: '아닙니다. 국민연금, 건강보험, 고용보험, 소득세 등이 함께 반영되기 때문에 세후 증가율은 다를 수 있습니다.',
      },
      {
        question: '최저임금만 알면 월급을 바로 알 수 있나요?',
        answer: '근로시간, 주휴수당, 비과세 항목, 공제 조건을 함께 봐야 실제 월급과 실수령액을 계산할 수 있습니다.',
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
    faqs: [
      {
        question: 'AI API 비용은 요청 수만 알면 계산할 수 있나요?',
        answer: '아닙니다. 입력 토큰, 출력 토큰, 모델 단가, 캐시나 배치 같은 별도 과금 구조를 함께 봐야 합니다.',
      },
      {
        question: '공식 가격표는 언제 다시 확인해야 하나요?',
        answer: '모델을 바꾸거나 사용량이 늘기 전, 그리고 가격 공지가 나온 뒤에는 공식 가격표를 다시 확인해야 합니다.',
      },
    ],
  },
  '환율 변화와 해외주식 원화 수익률 영향': {
    slug: 'exchange-rate-foreign-stock-return-impact',
    title: '환율이 바뀌면 해외주식 원화 수익률은 얼마나 달라질까?',
    description: '달러 환율 변화가 해외주식의 원화 기준 수익률과 실제 평가금액에 미치는 영향을 계산기와 함께 확인합니다.',
    summary: [
      '해외주식 수익률은 주가 변화뿐 아니라 매수·매도 시점의 환율 차이도 함께 반영됩니다.',
      '달러 기준 수익이 나도 원화 환산 결과는 환율에 따라 달라질 수 있습니다.',
      '매수 환율, 매도 환율, 주가 변화를 함께 넣어 원화 수익률을 직접 계산해야 합니다.',
    ],
    sections: [
      {
        heading: '무엇이 달라졌는지 확인하세요',
        body: '원·달러 환율 변화 폭과 적용 환율 기준을 확인하고, 단순 환율 등락과 실제 환전 비용을 구분해야 합니다.',
      },
      {
        heading: '원화 수익률에 영향을 주는 조건',
        body: '매수 가격, 매도 가격, 매수 환율, 매도 환율, 수수료와 세금 여부에 따라 최종 원화 수익률이 달라집니다.',
      },
      {
        heading: '내 조건으로 계산하는 방법',
        body: '해외주식 매수·매도 가격과 환율을 입력해 달러 기준 수익률과 원화 기준 수익률을 나눠 비교하세요.',
      },
    ],
    faqs: [
      {
        question: '달러 수익률이 플러스면 원화 수익률도 항상 플러스인가요?',
        answer: '아닙니다. 매수 환율과 매도 환율 차이, 환전 수수료, 세금에 따라 원화 기준 결과는 달라질 수 있습니다.',
      },
      {
        question: '환율 영향은 언제 계산해야 하나요?',
        answer: '해외주식을 매수하기 전, 매도하기 전, 환전 시점을 정하기 전에 달러 기준 수익률과 원화 기준 수익률을 나눠 계산하는 것이 좋습니다.',
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
    faqs: [
      {
        question: '이 이슈가 내 금액에 바로 적용되나요?',
        answer: '공식 적용일, 대상 조건, 개인 상황에 따라 달라질 수 있습니다. 먼저 공식 출처를 확인한 뒤 관련 계산기에 내 조건을 입력해야 합니다.',
      },
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
    faqs: template.faqs,
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
