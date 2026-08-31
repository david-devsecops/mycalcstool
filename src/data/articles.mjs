export const articles = [
  {
    slug: 'base-rate-loan-interest-impact',
    language: 'ko',
    status: 'published',
    noIndex: false,
    category: '금융',
    categoryKey: 'finance',
    title: '기준금리가 바뀌면 내 대출 이자는 얼마나 달라질까?',
    description: '기준금리 변화가 대출 이자에 어떤 식으로 연결되는지, 1억원 대출 예시와 대출 이자 계산기로 확인합니다.',
    publishedDate: '2026-08-31',
    updatedDate: '2026-08-31',
    readTime: '6분',
    summary: [
      '기준금리는 한국은행이 금융기관과 거래할 때 기준이 되는 정책금리입니다.',
      '대출금리는 기준금리와 같지는 않지만 시장금리와 은행 조달비용을 통해 영향을 받을 수 있습니다.',
      '내 대출 영향은 잔액, 금리 종류, 금리 조정 주기, 가산금리에 따라 달라집니다.',
    ],
    sections: [
      {
        heading: '무엇을 먼저 확인해야 하나요?',
        paragraphs: [
          '기준금리 뉴스가 나왔을 때 가장 먼저 볼 것은 내 대출이 변동금리인지, 고정금리인지입니다. 변동금리라도 바로 같은 폭으로 움직이는 것은 아니며, 기준이 되는 시장금리와 은행별 가산금리, 조정 주기에 따라 실제 적용 시점이 달라질 수 있습니다.',
          '한국은행 기준금리 추이 페이지에서 발표일과 기준금리 수준을 확인한 뒤, 실제 대출 약정서의 금리 산정 방식을 함께 확인해야 합니다.',
        ],
      },
      {
        heading: '1억원 대출에서 0.25%p는 어느 정도인가요?',
        paragraphs: [
          '단순 계산으로 보면 대출 잔액 1억원에 연 0.25%p 차이는 1년 기준 약 25만원입니다. 월 단순 이자 차이로 나누면 약 2만833원입니다.',
          '다만 원리금균등상환처럼 매월 원금이 줄어드는 구조에서는 실제 차이가 단순 이자 계산과 다를 수 있습니다. 그래서 잔액, 기간, 상환방식을 넣어 다시 계산해야 합니다.',
        ],
      },
      {
        heading: '내 조건에서는 어떻게 계산하나요?',
        paragraphs: [
          '대출 잔액, 남은 기간, 현재 금리, 예상 금리 차이를 입력해 월 납입액과 총 이자 차이를 비교하세요. 기준금리 변화폭만 보지 말고 내 대출의 실제 적용금리 기준을 확인하는 것이 핵심입니다.',
        ],
      },
    ],
    calculatorCtas: [
      {
        calculatorId: 'loan',
        href: '/loan/',
        label: '대출 이자 직접 계산하기',
        description: '대출 잔액, 기간, 금리, 상환방식을 입력해 월 납입액과 총 이자를 계산합니다.',
      },
    ],
    officialSources: [
      {
        name: '한국은행 기준금리 추이',
        url: 'https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643',
      },
      {
        name: '한국은행 기준금리 설명',
        url: 'https://www.bok.or.kr/portal/singl/baseRate/progress.do?dataSeCd=01&menuNo=200656',
      },
    ],
    disclaimerType: 'finance',
  },
  {
    slug: 'year-end-tax-refund-paycheck-impact',
    language: 'ko',
    status: 'published',
    noIndex: false,
    category: '세금',
    categoryKey: 'tax',
    title: '연말정산 환급액은 왜 월급 실수령액과 다르게 느껴질까?',
    description: '연말정산은 매월 원천징수한 세금과 확정 세액을 비교하는 과정입니다. 환급 또는 추가 납부가 생기는 이유를 계산기와 함께 확인합니다.',
    publishedDate: '2026-08-31',
    updatedDate: '2026-08-31',
    readTime: '7분',
    summary: [
      '연말정산은 1년 동안 낸 세금과 최종 부담해야 할 세금을 다시 맞추는 절차입니다.',
      '환급액은 월급이 늘어난 것이 아니라 이미 낸 세금 중 돌려받을 금액일 수 있습니다.',
      '실수령액, 공제 항목, 원천징수액을 함께 봐야 실제 현금흐름을 이해할 수 있습니다.',
    ],
    sections: [
      {
        heading: '연말정산은 무엇을 다시 계산하나요?',
        paragraphs: [
          '근로자는 매월 급여를 받을 때 간이세액표에 따라 소득세를 미리 냅니다. 연말정산에서는 1년 전체 소득과 공제 자료를 반영해 최종 세액을 다시 계산합니다.',
          '최종 세액보다 미리 낸 세금이 많으면 환급이 생기고, 반대로 부족하면 추가 납부가 생길 수 있습니다.',
        ],
      },
      {
        heading: '월급 실수령액과 환급액을 같이 봐야 하는 이유',
        paragraphs: [
          '매월 실수령액은 4대보험, 소득세, 지방소득세 등이 빠진 뒤 받은 금액입니다. 연말정산 환급액은 그중 세금 부분을 1년 단위로 다시 맞춘 결과입니다.',
          '따라서 환급액만 보고 유리하다고 판단하기보다, 월별 원천징수와 공제 가능 항목을 함께 보는 편이 더 정확합니다.',
        ],
      },
      {
        heading: '내 경우에는 어떻게 확인하나요?',
        paragraphs: [
          '연봉 실수령액 계산기로 월 현금흐름을 먼저 확인한 뒤, 연말정산 환급 계산기로 공제 항목에 따른 환급 가능성을 따로 비교하세요. 두 계산 결과를 함께 보면 매월 받는 돈과 연말에 정산되는 돈을 분리해서 볼 수 있습니다.',
        ],
      },
    ],
    calculatorCtas: [
      {
        calculatorId: 'tax-refund',
        href: '/tax-refund/',
        label: '연말정산 환급액 계산하기',
        description: '급여와 주요 공제 항목을 기준으로 예상 환급액을 계산합니다.',
      },
      {
        calculatorId: 'salary',
        href: '/salary/',
        label: '연봉 실수령액 계산하기',
        description: '세전 연봉에서 공제 후 월 실수령액을 확인합니다.',
      },
    ],
    officialSources: [
      {
        name: '국세청 연말정산 세액계산방법',
        url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7870&mi=6434',
      },
      {
        name: '국세청 연말정산 종합 안내',
        url: 'https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=238938&mi=2304',
      },
    ],
    disclaimerType: 'tax',
  },
  {
    slug: 'openai-api-price-change-cost-planning',
    language: 'ko',
    status: 'published',
    noIndex: false,
    category: 'AI',
    categoryKey: 'ai',
    title: 'OpenAI API 가격이 바뀌면 월 사용료는 어떻게 달라질까?',
    description: 'AI API 비용은 입력 토큰, 출력 토큰, 요청 수, 모델 단가가 함께 결정합니다. 가격 변경 시 어떤 값을 다시 계산해야 하는지 정리합니다.',
    publishedDate: '2026-08-31',
    updatedDate: '2026-08-31',
    readTime: '6분',
    summary: [
      'AI API 비용은 보통 입력 토큰 비용과 출력 토큰 비용을 나눠 봐야 합니다.',
      '모델 단가가 바뀌면 같은 요청 수라도 월 비용이 크게 달라질 수 있습니다.',
      '공식 가격표에서 최신 단가를 확인한 뒤 계산기에 직접 입력하는 방식이 가장 안전합니다.',
    ],
    sections: [
      {
        heading: 'API 비용은 어떤 값으로 결정되나요?',
        paragraphs: [
          'AI API 비용은 단순히 요청 횟수만으로 정해지지 않습니다. 한 요청에 들어가는 입력 토큰, 모델이 생성하는 출력 토큰, 월 요청 수, 모델별 단가를 함께 계산해야 합니다.',
          '같은 기능이라도 프롬프트가 길어지거나 응답 길이가 늘어나면 비용이 달라집니다. 그래서 가격표만 보는 것보다 실제 사용량 가정을 넣어 계산하는 편이 좋습니다.',
        ],
      },
      {
        heading: '가격 변경이 생기면 무엇을 다시 봐야 하나요?',
        paragraphs: [
          '먼저 공식 가격 페이지에서 입력 토큰과 출력 토큰 단가를 확인합니다. 그다음 현재 서비스의 평균 입력 토큰, 평균 출력 토큰, 월 요청 수를 업데이트합니다.',
          '캐시, 배치, 이미지, 음성, 검색, 도구 호출처럼 별도 과금 구조가 있는 기능은 기본 토큰 계산과 분리해서 확인해야 합니다.',
        ],
      },
      {
        heading: '내 서비스 월 비용은 어떻게 계산하나요?',
        paragraphs: [
          '예상 월 요청 수와 요청당 평균 토큰 수를 정한 뒤, 공식 가격표의 최신 단가를 계산기에 입력하세요. 운영 전에는 낮은 사용량, 예상 사용량, 높은 사용량 세 가지 시나리오를 나눠 보는 것이 좋습니다.',
        ],
      },
    ],
    calculatorCtas: [
      {
        calculatorId: 'chatgpt-api-cost-calculator',
        href: '/chatgpt-api-cost-calculator/',
        label: 'ChatGPT API 비용 계산하기',
        description: '입력 토큰, 출력 토큰, 요청 수, 단가를 넣어 월 비용을 계산합니다.',
      },
      {
        calculatorId: 'ai-model-cost-comparison',
        href: '/ai-model-cost-comparison/',
        label: 'AI 모델 비용 비교하기',
        description: '같은 사용량을 여러 모델 단가로 비교합니다.',
      },
    ],
    officialSources: [
      {
        name: 'OpenAI API Pricing',
        url: 'https://openai.com/api/pricing/',
      },
    ],
    disclaimerType: 'ai',
  },
];

export function getPublishedArticles(language = 'ko') {
  return articles.filter((article) => article.language === language && article.status === 'published' && article.noIndex !== true);
}

export function getArticleBySlug(slug, language = 'ko') {
  return getPublishedArticles(language).find((article) => article.slug === slug);
}

export function getRelatedArticles(currentSlug, categoryKey, limit = 3) {
  return getPublishedArticles()
    .filter((article) => article.slug !== currentSlug && article.categoryKey === categoryKey)
    .slice(0, limit);
}

