export type GrowthCalculatorId =
  | 'stock-average'
  | 'stock-averaging-down'
  | 'stock-return'
  | 'dividend'
  | 'dividend-yield'
  | 'foreign-stock-return'
  | 'etf-investment'
  | 'ai-token'
  | 'chatgpt-api-cost'
  | 'ai-model-cost-comparison';

export type GrowthCalculatorLang = 'ko' | 'en';

export interface GrowthField {
  id: string;
  label: string;
  suffix: string;
  value: string;
  min?: string;
  max?: string;
  step?: string;
  type?: 'number' | 'textarea';
}

export interface GrowthCalculatorPageData {
  id: GrowthCalculatorId;
  lang: GrowthCalculatorLang;
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string;
  category: string;
  icon: string;
  answer: string;
  fields: GrowthField[];
  resultLabels: string[];
  formula: string;
  example: string;
  mistakes: string[];
  disclaimer: string;
  faqs: Array<{ question: string; answer: string }>;
  related: Array<{ href: string; label: string; desc: string }>;
  sourceLinks?: Array<{ href: string; label: string }>;
}

const stockRelatedKo = [
  { href: '/stock-average-calculator/', label: '주식 평단가', desc: '추가 매수 후 평균 단가 계산' },
  { href: '/stock-return-calculator/', label: '주식 수익률', desc: '매수·매도 기준 손익률 계산' },
  { href: '/dividend-yield-calculator/', label: '배당수익률', desc: '주가 대비 연 배당률 계산' },
];

const stockRelatedEn = [
  { href: '/en/stock-average-calculator/', label: 'Stock Average Cost', desc: 'Average cost after an additional purchase' },
  { href: '/en/stock-return-calculator/', label: 'Stock Return', desc: 'Profit, loss, and return percentage' },
  { href: '/en/dividend-yield-calculator/', label: 'Dividend Yield', desc: 'Annual dividend yield from price and dividend' },
];

const aiRelatedKo = [
  { href: '/ai-token-calculator/', label: 'AI 토큰 계산기', desc: '텍스트 길이로 토큰 수 추정' },
  { href: '/chatgpt-api-cost-calculator/', label: 'ChatGPT API 비용', desc: '토큰과 호출 수로 비용 계산' },
  { href: '/ai-model-cost-comparison/', label: 'AI 모델 비용 비교', desc: 'GPT·Claude·Gemini 비용 비교' },
];

const aiRelatedEn = [
  { href: '/en/ai-token-calculator/', label: 'AI Token Calculator', desc: 'Estimate tokens from text length' },
  { href: '/en/chatgpt-api-cost-calculator/', label: 'ChatGPT API Cost', desc: 'Estimate cost from tokens and calls' },
  { href: '/en/ai-model-cost-comparison/', label: 'AI Model Cost Comparison', desc: 'Compare GPT, Claude, and Gemini costs' },
];

const aiSources = [
  { href: 'https://openai.com/api/pricing/', label: 'OpenAI API pricing' },
  { href: 'https://platform.claude.com/docs/en/about-claude/pricing', label: 'Anthropic Claude pricing' },
  { href: 'https://ai.google.dev/gemini-api/docs/pricing', label: 'Google Gemini API pricing' },
];

const koPages: GrowthCalculatorPageData[] = [
  {
    id: 'stock-average',
    lang: 'ko',
    slug: 'stock-average-calculator',
    title: '주식 평단가 계산기 - 추가 매수 후 평균 단가 계산',
    h1: '주식 평단가 계산기',
    description: '보유 주식 수량과 단가, 추가 매수 수량과 단가를 입력하면 새 평균 매입 단가, 총 보유 수량, 총 투자금을 계산합니다.',
    keywords: '주식 평단가 계산기, 평균단가 계산, 주식 평균 매입가, 추가매수 평단가',
    category: '투자',
    icon: '📊',
    answer: '주식 평단가는 총 투자금을 총 보유 수량으로 나눈 값입니다. 추가 매수 후 평균 단가가 낮아졌는지, 총 투자금이 얼마나 늘었는지 함께 확인하는 것이 핵심입니다.',
    fields: [
      { id: 'currentShares', label: '현재 보유 수량', suffix: '주', value: '20', min: '0', step: '1' },
      { id: 'currentPrice', label: '현재 평균 단가', suffix: '원', value: '50000', min: '0', step: '100' },
      { id: 'buyShares', label: '추가 매수 수량', suffix: '주', value: '10', min: '0', step: '1' },
      { id: 'buyPrice', label: '추가 매수 단가', suffix: '원', value: '40000', min: '0', step: '100' },
    ],
    resultLabels: ['새 평균 단가', '총 보유 수량', '총 투자금'],
    formula: '새 평단가 = (기존 수량 × 기존 평단가 + 추가 수량 × 추가 단가) ÷ (기존 수량 + 추가 수량)',
    example: '예를 들어 50,000원에 20주를 보유하고 40,000원에 10주를 추가 매수하면 총 투자금은 1,400,000원, 총 수량은 30주, 새 평단가는 약 46,667원입니다.',
    mistakes: ['현재 주가와 평균 매입 단가를 혼동하는 것', '수수료와 세금을 포함하지 않고 실제 손익으로 오해하는 것', '평단가만 낮추고 총 투자금 증가 위험을 보지 않는 것'],
    disclaimer: '이 계산기는 입력값 기반의 단순 산식입니다. 특정 종목의 매수·매도 판단이나 투자 수익을 보장하지 않습니다.',
    faqs: [
      { question: '평단가가 낮아지면 무조건 좋은가요?', answer: '아닙니다. 평균 단가는 낮아질 수 있지만 총 투자금과 특정 종목 비중도 함께 늘어납니다.' },
      { question: '수수료도 반영해야 하나요?', answer: '정확한 실제 평단가를 보려면 매매 수수료와 세금을 총 투자금에 포함하는 편이 좋습니다.' },
      { question: '현재 주가를 입력해야 하나요?', answer: '이 계산기는 추가 매수 후 평균 단가를 계산하므로 현재 평가 주가가 아니라 매수 단가를 입력합니다.' },
    ],
    related: stockRelatedKo,
  },
  {
    id: 'stock-averaging-down',
    lang: 'ko',
    slug: 'stock-averaging-down-calculator',
    title: '주식 물타기 계산기 - 추가 매수 후 손익분기점 계산',
    h1: '주식 물타기 계산기',
    description: '하락한 주식을 추가 매수했을 때 새 평단가, 총 투자금, 손익분기까지 필요한 상승률을 계산합니다.',
    keywords: '물타기 계산기, 주식 물타기, 손익분기 주가, 평균단가 낮추기',
    category: '투자',
    icon: '📉',
    answer: '물타기는 낮은 가격에 추가 매수해 평균 단가를 낮추는 방식입니다. 계산 결과는 새 평단가와 함께 손익분기까지 얼마나 상승해야 하는지를 보여줍니다.',
    fields: [
      { id: 'currentShares', label: '현재 보유 수량', suffix: '주', value: '20', min: '0', step: '1' },
      { id: 'currentPrice', label: '현재 평균 단가', suffix: '원', value: '60000', min: '0', step: '100' },
      { id: 'buyShares', label: '추가 매수 수량', suffix: '주', value: '20', min: '0', step: '1' },
      { id: 'buyPrice', label: '추가 매수 단가', suffix: '원', value: '40000', min: '0', step: '100' },
    ],
    resultLabels: ['새 평균 단가', '총 투자금', '손익분기 상승률'],
    formula: '손익분기 상승률 = (새 평단가 - 추가 매수 단가) ÷ 추가 매수 단가 × 100',
    example: '60,000원에 20주를 보유하고 40,000원에 20주를 추가 매수하면 새 평단가는 50,000원입니다. 추가 매수 가격 기준으로는 약 25% 상승해야 새 평단가에 도달합니다.',
    mistakes: ['손실 회복에 필요한 상승률을 과소평가하는 것', '한 종목에 투자금이 과도하게 집중되는 것', '하락 이유를 확인하지 않고 단가만 낮추는 것'],
    disclaimer: '물타기는 손실을 줄이는 전략이 아니라 투자 비중을 키우는 행동입니다. 계산 결과는 투자 판단의 참고 자료일 뿐입니다.',
    faqs: [
      { question: '물타기를 하면 손실이 줄어드나요?', answer: '평균 단가는 낮아지지만 평가손익은 시장 가격에 따라 달라집니다. 추가 투자금이 들어간다는 점을 함께 봐야 합니다.' },
      { question: '얼마나 더 사야 평단가가 크게 낮아지나요?', answer: '기존 보유 수량과 비슷하거나 더 큰 수량을 낮은 가격에 사야 평단가 변화가 큽니다.' },
      { question: '손익분기 상승률은 무엇인가요?', answer: '추가 매수 가격에서 새 평균 단가까지 오르기 위해 필요한 상승률입니다.' },
    ],
    related: stockRelatedKo,
  },
  {
    id: 'stock-return',
    lang: 'ko',
    slug: 'stock-return-calculator',
    title: '주식 수익률 계산기 - 매수 매도 손익률 계산',
    h1: '주식 수익률 계산기',
    description: '매수 단가, 매도 단가, 수량, 수수료·세금을 입력해 예상 손익과 수익률을 계산합니다.',
    keywords: '주식 수익률 계산기, 주식 손익 계산, 매도 수익률, 투자 수익률 계산',
    category: '투자',
    icon: '💹',
    answer: '주식 수익률은 순손익을 총 매수금액으로 나눈 비율입니다. 단순 가격 차이뿐 아니라 수수료와 세금을 빼야 실제 수익률에 가까워집니다.',
    fields: [
      { id: 'buyPrice', label: '매수 단가', suffix: '원', value: '50000', min: '0', step: '100' },
      { id: 'sellPrice', label: '매도 단가', suffix: '원', value: '58000', min: '0', step: '100' },
      { id: 'shares', label: '수량', suffix: '주', value: '30', min: '0', step: '1' },
      { id: 'costs', label: '수수료·세금 합계', suffix: '원', value: '5000', min: '0', step: '100' },
    ],
    resultLabels: ['순손익', '수익률', '총 매도금액'],
    formula: '수익률 = (매도금액 - 매수금액 - 비용) ÷ 매수금액 × 100',
    example: '50,000원에 30주를 매수하고 58,000원에 매도, 비용이 5,000원이면 순손익은 235,000원이고 수익률은 약 15.67%입니다.',
    mistakes: ['수익률을 매도금액이 아니라 매수금액 기준으로 계산하지 않는 것', '수수료와 세금을 누락하는 것', '부분 매도 수량을 전체 보유 수량으로 착각하는 것'],
    disclaimer: '세금과 수수료 체계는 시장, 계좌, 상품에 따라 다를 수 있습니다. 실제 체결 내역과 증권사 기준을 확인하세요.',
    faqs: [
      { question: '수익률은 어떤 금액을 기준으로 하나요?', answer: '일반적으로 총 매수금액을 기준으로 순손익 비율을 계산합니다.' },
      { question: '배당금도 포함하나요?', answer: '이 페이지는 매매 차익 중심입니다. 배당금을 포함하려면 배당금 계산 결과를 손익에 별도로 더해야 합니다.' },
      { question: '손실일 때도 계산되나요?', answer: '매도 단가가 매수 단가보다 낮거나 비용이 크면 음수 수익률로 표시됩니다.' },
    ],
    related: stockRelatedKo,
  },
  {
    id: 'dividend',
    lang: 'ko',
    slug: 'dividend-calculator',
    title: '배당금 계산기 - 보유 주식 기준 예상 배당금 계산',
    h1: '배당금 계산기',
    description: '보유 수량과 주당 배당금을 입력해 예상 연 배당금, 월평균 배당금, 세후 배당금을 계산합니다.',
    keywords: '배당금 계산기, 주당 배당금, 세후 배당금, 월 배당금 계산',
    category: '투자',
    icon: '💵',
    answer: '예상 배당금은 보유 주식 수량에 주당 배당금을 곱해 계산합니다. 세후 현금흐름을 보려면 배당소득세율을 함께 반영해야 합니다.',
    fields: [
      { id: 'shares', label: '보유 수량', suffix: '주', value: '100', min: '0', step: '1' },
      { id: 'dividendPerShare', label: '연 주당 배당금', suffix: '원', value: '1200', min: '0', step: '10' },
      { id: 'taxRate', label: '배당 세율', suffix: '%', value: '15.4', min: '0', max: '50', step: '0.1' },
    ],
    resultLabels: ['연 배당금', '세후 배당금', '월평균 배당금'],
    formula: '연 배당금 = 보유 수량 × 주당 배당금, 세후 배당금 = 연 배당금 × (1 - 세율)',
    example: '100주를 보유하고 연 주당 배당금이 1,200원, 세율이 15.4%라면 세전 연 배당금은 120,000원, 세후 배당금은 약 101,520원입니다.',
    mistakes: ['분기 배당과 연 배당을 혼동하는 것', '배당락 이후 주가 변동을 고려하지 않는 것', '세전 배당금만 보고 실제 입금액으로 착각하는 것'],
    disclaimer: '배당금은 기업의 배당 정책과 환율, 세법에 따라 달라질 수 있습니다. 과거 배당이 미래 배당을 보장하지 않습니다.',
    faqs: [
      { question: '주당 배당금은 어디서 확인하나요?', answer: '기업 공시, 증권사 앱, 거래소 정보에서 확인할 수 있습니다. 연 배당인지 분기 배당인지 구분해야 합니다.' },
      { question: '월평균 배당금은 실제 매달 받는 금액인가요?', answer: '아닙니다. 연 배당금을 12개월로 나눈 참고값입니다. 실제 지급 주기는 기업마다 다릅니다.' },
      { question: '해외주식 배당도 계산할 수 있나요?', answer: '통화만 맞춰 입력하면 계산은 가능하지만 현지 원천징수와 환율을 별도로 고려해야 합니다.' },
    ],
    related: stockRelatedKo,
  },
  {
    id: 'dividend-yield',
    lang: 'ko',
    slug: 'dividend-yield-calculator',
    title: '배당수익률 계산기 - 주가 대비 연 배당률 계산',
    h1: '배당수익률 계산기',
    description: '현재 주가와 연 주당 배당금을 입력해 배당수익률과 투자금 기준 예상 배당금을 계산합니다.',
    keywords: '배당수익률 계산기, 배당률 계산, 주당 배당금, 배당주 수익률',
    category: '투자',
    icon: '🏦',
    answer: '배당수익률은 연 주당 배당금을 현재 주가로 나눈 비율입니다. 같은 배당금이라도 주가가 낮아지면 수익률은 높아 보일 수 있으므로 배당 지속성을 함께 봐야 합니다.',
    fields: [
      { id: 'stockPrice', label: '현재 주가', suffix: '원', value: '50000', min: '0', step: '100' },
      { id: 'annualDividend', label: '연 주당 배당금', suffix: '원', value: '2000', min: '0', step: '10' },
      { id: 'investment', label: '투자금', suffix: '원', value: '1000000', min: '0', step: '10000' },
    ],
    resultLabels: ['배당수익률', '예상 보유 수량', '예상 연 배당금'],
    formula: '배당수익률 = 연 주당 배당금 ÷ 현재 주가 × 100',
    example: '주가가 50,000원이고 연 배당금이 2,000원이면 배당수익률은 4%입니다. 1,000,000원을 투자하면 약 20주를 보유하고 연 40,000원의 세전 배당을 기대할 수 있습니다.',
    mistakes: ['높은 배당수익률만 보고 배당 삭감 위험을 무시하는 것', '현재 주가가 급락해 수익률이 높아진 상황을 안정적 배당으로 오해하는 것', '세후 수익률을 따로 계산하지 않는 것'],
    disclaimer: '배당수익률은 현재 입력값 기준의 단순 계산입니다. 기업의 재무 상태와 배당 정책 변화는 반영하지 않습니다.',
    faqs: [
      { question: '배당수익률이 높으면 좋은 주식인가요?', answer: '항상 그렇지는 않습니다. 주가 하락이나 배당 삭감 가능성 때문에 수익률이 높아 보일 수 있습니다.' },
      { question: '투자금으로 보유 수량은 어떻게 계산하나요?', answer: '투자금을 현재 주가로 나눈 뒤 소수점 이하 주식은 제외해 예상 보유 수량을 계산합니다.' },
      { question: '세후 배당수익률도 봐야 하나요?', answer: '실제 현금흐름을 보려면 배당소득세와 해외 원천징수 등을 반영해야 합니다.' },
    ],
    related: stockRelatedKo,
  },
  {
    id: 'foreign-stock-return',
    lang: 'ko',
    slug: 'foreign-stock-return-calculator',
    title: '해외주식 환율 수익률 계산기 - 주가와 환율 손익 계산',
    h1: '해외주식 환율 수익률 계산기',
    description: '해외주식 매수·매도 가격과 매수·매도 환율을 입력해 원화 기준 손익과 수익률을 계산합니다.',
    keywords: '해외주식 수익률 계산기, 환율 수익률, 미국주식 수익률, 원화 손익 계산',
    category: '투자',
    icon: '🌎',
    answer: '해외주식 수익률은 주가 변화와 환율 변화가 함께 반영됩니다. 달러 기준으로 수익이어도 원화 환산 수익률은 달라질 수 있습니다.',
    fields: [
      { id: 'buyPrice', label: '매수 단가', suffix: 'USD', value: '100', min: '0', step: '0.01' },
      { id: 'sellPrice', label: '매도 단가', suffix: 'USD', value: '120', min: '0', step: '0.01' },
      { id: 'shares', label: '수량', suffix: '주', value: '10', min: '0', step: '1' },
      { id: 'buyFx', label: '매수 환율', suffix: '원/USD', value: '1300', min: '0', step: '1' },
      { id: 'sellFx', label: '매도 환율', suffix: '원/USD', value: '1350', min: '0', step: '1' },
    ],
    resultLabels: ['원화 순손익', '원화 수익률', '환율 효과'],
    formula: '원화 수익률 = (매도단가 × 매도환율 - 매수단가 × 매수환율) ÷ (매수단가 × 매수환율) × 100',
    example: '100달러에 10주를 1,300원 환율로 사고 120달러에 1,350원 환율로 팔면 주가와 환율이 모두 우호적으로 움직여 원화 수익률은 달러 수익률보다 높아집니다.',
    mistakes: ['달러 기준 수익률만 보고 원화 기준 손익을 확인하지 않는 것', '환전 수수료와 세금을 누락하는 것', '매수 당시 환율과 매도 당시 환율을 같은 값으로 넣는 것'],
    disclaimer: '실제 해외주식 손익에는 환전 스프레드, 수수료, 세금, 배당 원천징수 등이 반영됩니다.',
    faqs: [
      { question: '달러로 수익인데 원화로 손실일 수 있나요?', answer: '가능합니다. 매도 시점 환율이 크게 낮아지면 달러 수익 일부가 원화 환산에서 줄어들 수 있습니다.' },
      { question: '환율 효과는 무엇인가요?', answer: '주가가 변하지 않았다고 가정했을 때 환율 변화만으로 생긴 원화 손익 차이입니다.' },
      { question: '환전 수수료도 포함되나요?', answer: '이 계산기는 기본 환율 효과를 보여줍니다. 정확한 손익은 환전 수수료와 거래 비용을 추가로 반영해야 합니다.' },
    ],
    related: stockRelatedKo,
  },
  {
    id: 'etf-investment',
    lang: 'ko',
    slug: 'etf-investment-calculator',
    title: 'ETF 적립식 투자 계산기 - 월 적립 미래가치 계산',
    h1: 'ETF 적립식 투자 계산기',
    description: '초기 투자금, 월 적립금, 예상 연 수익률, 투자 기간을 입력해 ETF 적립식 투자의 예상 미래가치를 계산합니다.',
    keywords: 'ETF 적립식 투자 계산기, 월 적립 투자, ETF 복리 계산, 장기 투자 계산',
    category: '투자',
    icon: '📈',
    answer: 'ETF 적립식 투자는 초기 금액과 매월 납입액이 복리로 성장한다고 가정해 미래가치를 추정할 수 있습니다. 기간과 월 적립금이 결과에 큰 영향을 줍니다.',
    fields: [
      { id: 'initialAmount', label: '초기 투자금', suffix: '원', value: '1000000', min: '0', step: '10000' },
      { id: 'monthlyContribution', label: '월 적립금', suffix: '원', value: '300000', min: '0', step: '10000' },
      { id: 'annualReturn', label: '예상 연 수익률', suffix: '%', value: '6', min: '-50', max: '100', step: '0.1' },
      { id: 'years', label: '투자 기간', suffix: '년', value: '20', min: '1', max: '60', step: '1' },
    ],
    resultLabels: ['예상 미래가치', '총 납입금', '예상 수익'],
    formula: '미래가치 = 초기 투자금의 복리 가치 + 매월 적립금의 월복리 누적 가치',
    example: '초기 100만원, 월 30만원, 연 6%, 20년을 가정하면 총 납입금은 7,300만원이고 예상 미래가치는 그보다 커질 수 있습니다.',
    mistakes: ['기대수익률을 너무 높게 잡는 것', '하락장이 없는 직선 성장을 가정하는 것', '수수료와 세금을 전혀 고려하지 않는 것'],
    disclaimer: 'ETF 수익률은 시장 상황에 따라 변동하며 원금 손실이 발생할 수 있습니다. 계산 결과는 일정 수익률 가정의 예시입니다.',
    faqs: [
      { question: '월 적립 시점은 어떻게 가정하나요?', answer: '이 계산기는 매월 말 납입 후 월 단위 복리로 성장한다고 단순 가정합니다.' },
      { question: '마이너스 수익률도 계산할 수 있나요?', answer: '네. 예상 연 수익률에 음수를 입력하면 손실 시나리오를 볼 수 있습니다.' },
      { question: 'ETF 수수료는 반영되나요?', answer: '기본 계산에는 포함하지 않습니다. 보수와 세금을 감안하려면 예상 수익률을 보수적으로 입력하세요.' },
    ],
    related: stockRelatedKo,
  },
  {
    id: 'ai-token',
    lang: 'ko',
    slug: 'ai-token-calculator',
    title: 'AI 토큰 계산기 - 글자 수로 토큰 수 추정',
    h1: 'AI 토큰 계산기',
    description: '텍스트 길이를 기준으로 AI 모델 입력 토큰과 출력 토큰을 추정하고 API 비용 계산의 기준값을 잡을 수 있습니다.',
    keywords: 'AI 토큰 계산기, 토큰 수 계산, GPT 토큰, ChatGPT 토큰 계산',
    category: 'AI',
    icon: '🤖',
    answer: 'AI 토큰은 모델이 텍스트를 처리하는 단위입니다. 이 계산기는 글자 수와 단어 수를 바탕으로 대략적인 토큰 수를 추정해 API 비용 계산 전 기준을 잡도록 돕습니다.',
    fields: [
      { id: 'promptText', label: '분석할 텍스트', suffix: '', value: 'AI cost planning starts with estimating input and output tokens.', type: 'textarea' },
      { id: 'outputTokens', label: '예상 출력 토큰', suffix: 'tokens', value: '800', min: '0', step: '1' },
    ],
    resultLabels: ['입력 토큰 추정', '전체 토큰 추정', '단어 수'],
    formula: '영문 기준 대략 4글자 ≈ 1토큰, 한국어는 문장 구성에 따라 차이가 커서 보수적으로 추정해야 합니다.',
    example: '짧은 고객 문의 1,000개를 요약한다면 문의당 입력 500토큰, 출력 150토큰처럼 가정해 전체 처리량을 먼저 추정할 수 있습니다.',
    mistakes: ['글자 수와 토큰 수가 항상 1:1이라고 생각하는 것', '출력 토큰을 비용 계산에서 누락하는 것', '모델마다 토크나이저가 다를 수 있다는 점을 무시하는 것'],
    disclaimer: '토큰 수는 모델과 토크나이저에 따라 달라집니다. 이 도구는 비용 계획을 위한 근사치입니다.',
    faqs: [
      { question: '토큰은 단어와 같은가요?', answer: '같지 않습니다. 영어 단어 하나가 하나 이상의 토큰이 될 수 있고, 한국어도 모델별로 분리 방식이 다릅니다.' },
      { question: '출력 토큰도 비용에 포함되나요?', answer: '대부분의 API는 입력 토큰과 출력 토큰을 각각 과금합니다. 출력이 길수록 비용이 늘어납니다.' },
      { question: '정확한 토큰 수는 어떻게 확인하나요?', answer: '각 모델 제공사의 토크나이저나 API 응답 사용량 필드를 확인하는 것이 가장 정확합니다.' },
    ],
    related: aiRelatedKo,
    sourceLinks: aiSources,
  },
  {
    id: 'chatgpt-api-cost',
    lang: 'ko',
    slug: 'chatgpt-api-cost-calculator',
    title: 'ChatGPT API 비용 계산기 - 토큰과 호출 수 기준 비용 추정',
    h1: 'ChatGPT API 비용 계산기',
    description: '입력 토큰, 출력 토큰, 요청 횟수, 백만 토큰당 단가를 입력해 예상 ChatGPT API 비용을 계산합니다.',
    keywords: 'ChatGPT API 비용 계산기, OpenAI API 비용, GPT 토큰 비용, AI API 과금 계산',
    category: 'AI',
    icon: '💬',
    answer: 'ChatGPT API 비용은 보통 입력 토큰 비용과 출력 토큰 비용을 더해 계산합니다. 요청 수가 많을수록 작은 토큰 차이도 월 비용에 큰 영향을 줍니다.',
    fields: [
      { id: 'inputTokens', label: '요청당 입력 토큰', suffix: 'tokens', value: '1200', min: '0', step: '1' },
      { id: 'outputTokens', label: '요청당 출력 토큰', suffix: 'tokens', value: '500', min: '0', step: '1' },
      { id: 'requests', label: '요청 수', suffix: '회', value: '10000', min: '0', step: '1' },
      { id: 'inputPrice', label: '입력 단가', suffix: '$/1M tokens', value: '1.25', min: '0', step: '0.01' },
      { id: 'outputPrice', label: '출력 단가', suffix: '$/1M tokens', value: '10', min: '0', step: '0.01' },
    ],
    resultLabels: ['예상 총 비용', '입력 비용', '출력 비용'],
    formula: '총 비용 = 입력토큰 × 요청수 ÷ 1,000,000 × 입력단가 + 출력토큰 × 요청수 ÷ 1,000,000 × 출력단가',
    example: '요청당 입력 1,200토큰, 출력 500토큰, 10,000회 요청에서 입력 단가 $1.25, 출력 단가 $10이면 예상 비용은 입력 $15와 출력 $50을 합한 약 $65입니다.',
    mistakes: ['출력 토큰 단가가 입력보다 높은 모델을 같은 단가로 보는 것', '테스트 요청과 재시도 요청을 월 요청 수에서 누락하는 것', '캐시·배치·도구 호출 비용을 확인하지 않는 것'],
    disclaimer: 'OpenAI API 가격은 모델과 날짜에 따라 바뀔 수 있습니다. 실제 청구 전 공식 가격표와 사용량 대시보드를 확인하세요.',
    faqs: [
      { question: '입력 비용과 출력 비용을 왜 따로 계산하나요?', answer: '대부분의 AI API는 입력 토큰과 출력 토큰 단가가 다르기 때문입니다.' },
      { question: '요청 수는 어떻게 추정하나요?', answer: '일 사용자 수, 사용자당 평균 실행 횟수, 자동 재시도 횟수를 곱해 보수적으로 잡는 것이 좋습니다.' },
      { question: '달러 비용을 원화로 바꿀 수 있나요?', answer: '이 페이지는 달러 기준 비용을 계산합니다. 원화 예산은 결제 환율과 카드 수수료를 별도로 반영하세요.' },
    ],
    related: aiRelatedKo,
    sourceLinks: aiSources,
  },
  {
    id: 'ai-model-cost-comparison',
    lang: 'ko',
    slug: 'ai-model-cost-comparison',
    title: 'GPT vs Claude vs Gemini 비용 비교 계산기',
    h1: 'AI 모델 비용 비교 계산기',
    description: '같은 입력·출력 토큰 사용량에서 GPT, Claude, Gemini 모델의 예상 API 비용을 나란히 비교합니다.',
    keywords: 'AI 모델 비용 비교, GPT Claude Gemini 비용, LLM API 비용 계산기, AI API 가격 비교',
    category: 'AI',
    icon: '⚖️',
    answer: 'AI 모델 비용 비교는 같은 토큰 사용량에 각 제공사의 입력·출력 단가를 적용해 계산합니다. 모델 품질과 속도는 별도 평가가 필요하지만, 비용 계획은 토큰 기준으로 먼저 잡을 수 있습니다.',
    fields: [
      { id: 'inputTokens', label: '요청당 입력 토큰', suffix: 'tokens', value: '2000', min: '0', step: '1' },
      { id: 'outputTokens', label: '요청당 출력 토큰', suffix: 'tokens', value: '700', min: '0', step: '1' },
      { id: 'requests', label: '요청 수', suffix: '회', value: '5000', min: '0', step: '1' },
      { id: 'gptInputPrice', label: 'GPT 입력 단가', suffix: '$/1M', value: '1.25', min: '0', step: '0.01' },
      { id: 'gptOutputPrice', label: 'GPT 출력 단가', suffix: '$/1M', value: '10', min: '0', step: '0.01' },
      { id: 'claudeInputPrice', label: 'Claude 입력 단가', suffix: '$/1M', value: '3', min: '0', step: '0.01' },
      { id: 'claudeOutputPrice', label: 'Claude 출력 단가', suffix: '$/1M', value: '15', min: '0', step: '0.01' },
      { id: 'geminiInputPrice', label: 'Gemini 입력 단가', suffix: '$/1M', value: '1.25', min: '0', step: '0.01' },
      { id: 'geminiOutputPrice', label: 'Gemini 출력 단가', suffix: '$/1M', value: '10', min: '0', step: '0.01' },
    ],
    resultLabels: ['GPT 예상 비용', 'Claude 예상 비용', 'Gemini 예상 비용'],
    formula: '모델별 비용 = 입력 비용 + 출력 비용, 각 비용은 토큰 수 × 요청 수 ÷ 1,000,000 × 단가로 계산합니다.',
    example: '입력 2,000토큰, 출력 700토큰, 5,000회 요청이면 각 모델의 입력·출력 단가 차이에 따라 월 비용이 크게 달라질 수 있습니다.',
    mistakes: ['모델 가격만 보고 품질과 지연시간을 무시하는 것', '프롬프트 캐시나 배치 API 할인 가능성을 누락하는 것', '도구 호출, 검색, 이미지, 오디오 비용을 포함하지 않는 것'],
    disclaimer: '기본 단가는 예시입니다. GPT, Claude, Gemini 가격은 모델 버전과 과금 정책에 따라 달라지므로 공식 가격표를 확인하세요.',
    faqs: [
      { question: '가장 저렴한 모델이 항상 좋은 선택인가요?', answer: '아닙니다. 실패율, 재시도, 품질 검수 비용까지 보면 더 비싼 모델이 총비용을 낮출 수도 있습니다.' },
      { question: '검색 도구 비용도 포함되나요?', answer: '이 계산기는 텍스트 입력·출력 토큰 비용 중심입니다. 웹 검색, 이미지, 오디오, 도구 실행 비용은 별도 확인이 필요합니다.' },
      { question: '기본 단가는 자동 업데이트되나요?', answer: '아니요. 가격 변동이 잦기 때문에 공식 가격 페이지를 기준으로 직접 수정해 비교하는 구조입니다.' },
    ],
    related: aiRelatedKo,
    sourceLinks: aiSources,
  },
];

const enPages: GrowthCalculatorPageData[] = [
  {
    id: 'stock-average',
    lang: 'en',
    slug: 'stock-average-calculator',
    title: 'Stock Average Cost Calculator - Average Share Price After Buying More',
    h1: 'Stock Average Cost Calculator',
    description: 'Calculate your new average share cost after an additional stock purchase, including total shares and total invested amount.',
    keywords: 'stock average cost calculator, average share price calculator, stock average calculator',
    category: 'Investing',
    icon: '📊',
    answer: 'Average stock cost is total invested amount divided by total shares owned. After buying more shares, the key number is the new average cost and how much additional capital you have committed.',
    fields: [
      { id: 'currentShares', label: 'Current shares', suffix: 'shares', value: '20', min: '0', step: '1' },
      { id: 'currentPrice', label: 'Current average cost', suffix: 'USD', value: '50', min: '0', step: '0.01' },
      { id: 'buyShares', label: 'New shares bought', suffix: 'shares', value: '10', min: '0', step: '1' },
      { id: 'buyPrice', label: 'New purchase price', suffix: 'USD', value: '40', min: '0', step: '0.01' },
    ],
    resultLabels: ['New average cost', 'Total shares', 'Total invested'],
    formula: 'New average cost = (current shares × current cost + new shares × new price) ÷ total shares',
    example: 'If you own 20 shares at $50 and buy 10 more at $40, your total invested amount is $1,400, total shares are 30, and the new average cost is about $46.67.',
    mistakes: ['Confusing current market price with average cost', 'Ignoring trading fees when reconciling brokerage records', 'Focusing only on a lower average cost while total exposure rises'],
    disclaimer: 'This calculator only models user-provided numbers. It does not provide investment advice or a buy/sell recommendation.',
    faqs: [
      { question: 'Does a lower average cost mean the trade is better?', answer: 'Not necessarily. A lower average cost can also mean more capital is concentrated in the same position.' },
      { question: 'Should I include commissions?', answer: 'For exact brokerage reconciliation, include commissions and fees in total invested amount.' },
      { question: 'Can this handle fractional shares?', answer: 'Yes. Enter fractional share quantities if your broker supports them.' },
    ],
    related: stockRelatedEn,
  },
  {
    id: 'stock-averaging-down',
    lang: 'en',
    slug: 'stock-averaging-down-calculator',
    title: 'Stock Averaging Down Calculator - Break-Even After Buying More',
    h1: 'Stock Averaging Down Calculator',
    description: 'Estimate your new average cost, total invested amount, and required rebound after averaging down a stock position.',
    keywords: 'averaging down calculator, stock averaging down, break even stock calculator',
    category: 'Investing',
    icon: '📉',
    answer: 'Averaging down lowers your average cost by buying more shares at a lower price. The important question is not only the new average, but also how much the new purchase must rebound to reach break-even.',
    fields: [
      { id: 'currentShares', label: 'Current shares', suffix: 'shares', value: '20', min: '0', step: '1' },
      { id: 'currentPrice', label: 'Current average cost', suffix: 'USD', value: '60', min: '0', step: '0.01' },
      { id: 'buyShares', label: 'Additional shares', suffix: 'shares', value: '20', min: '0', step: '1' },
      { id: 'buyPrice', label: 'Additional purchase price', suffix: 'USD', value: '40', min: '0', step: '0.01' },
    ],
    resultLabels: ['New average cost', 'Total invested', 'Rebound to break even'],
    formula: 'Rebound to break even = (new average cost - new purchase price) ÷ new purchase price × 100',
    example: 'If you own 20 shares at $60 and buy 20 more at $40, your new average cost is $50. The new purchase price would need to rise about 25% to reach that average.',
    mistakes: ['Underestimating the rebound needed after a large decline', 'Adding capital without checking position concentration', 'Treating a lower average cost as a risk reduction by itself'],
    disclaimer: 'Averaging down increases position size. This tool is for scenario math only and does not evaluate the stock or business.',
    faqs: [
      { question: 'Does averaging down reduce my loss?', answer: 'It lowers average cost, but your profit or loss still depends on the market price and the larger position size.' },
      { question: 'Why is break-even rebound useful?', answer: 'It shows how far the new purchase price must rise before the combined position reaches the new average cost.' },
      { question: 'Can averaging down increase risk?', answer: 'Yes. It can concentrate more capital in a falling asset.' },
    ],
    related: stockRelatedEn,
  },
  {
    id: 'stock-return',
    lang: 'en',
    slug: 'stock-return-calculator',
    title: 'Stock Return Calculator - Profit, Loss, and Return Percentage',
    h1: 'Stock Return Calculator',
    description: 'Calculate stock profit or loss, return percentage, and total sale proceeds using buy price, sell price, shares, and costs.',
    keywords: 'stock return calculator, stock profit calculator, investment return calculator',
    category: 'Investing',
    icon: '💹',
    answer: 'Stock return is net profit divided by total purchase cost. Fees and taxes can turn a headline gain into a smaller real return, so they should be included when possible.',
    fields: [
      { id: 'buyPrice', label: 'Buy price', suffix: 'USD', value: '50', min: '0', step: '0.01' },
      { id: 'sellPrice', label: 'Sell price', suffix: 'USD', value: '58', min: '0', step: '0.01' },
      { id: 'shares', label: 'Shares', suffix: 'shares', value: '30', min: '0', step: '1' },
      { id: 'costs', label: 'Fees and taxes', suffix: 'USD', value: '5', min: '0', step: '0.01' },
    ],
    resultLabels: ['Net profit/loss', 'Return', 'Sale proceeds'],
    formula: 'Return = (sale proceeds - purchase cost - fees/taxes) ÷ purchase cost × 100',
    example: 'Buying 30 shares at $50 and selling them at $58 with $5 in costs produces $235 in net profit and a return of about 15.67%.',
    mistakes: ['Using sale proceeds instead of purchase cost as the return base', 'Leaving out fees and taxes', 'Mixing a partial sale with total position shares'],
    disclaimer: 'Tax treatment varies by country, account type, and holding period. Confirm actual results with your broker or tax professional.',
    faqs: [
      { question: 'Can the calculator show a loss?', answer: 'Yes. If sale value after costs is below purchase cost, the profit and return will be negative.' },
      { question: 'Does this include dividends?', answer: 'No. Add dividends separately if you want total return.' },
      { question: 'What if I sold only part of my position?', answer: 'Enter only the shares that were sold for this calculation.' },
    ],
    related: stockRelatedEn,
  },
  {
    id: 'dividend',
    lang: 'en',
    slug: 'dividend-calculator',
    title: 'Dividend Calculator - Estimate Annual and Monthly Dividend Income',
    h1: 'Dividend Calculator',
    description: 'Estimate annual dividends, after-tax dividends, and average monthly dividend income from shares owned and dividend per share.',
    keywords: 'dividend calculator, dividend income calculator, annual dividend calculator',
    category: 'Investing',
    icon: '💵',
    answer: 'Expected dividend income is shares owned multiplied by annual dividend per share. To estimate cash flow, apply the tax rate and divide annual income by 12 for a monthly average.',
    fields: [
      { id: 'shares', label: 'Shares owned', suffix: 'shares', value: '100', min: '0', step: '1' },
      { id: 'dividendPerShare', label: 'Annual dividend per share', suffix: 'USD', value: '1.2', min: '0', step: '0.01' },
      { id: 'taxRate', label: 'Dividend tax rate', suffix: '%', value: '15', min: '0', max: '50', step: '0.1' },
    ],
    resultLabels: ['Annual dividend', 'After-tax dividend', 'Monthly average'],
    formula: 'Annual dividend = shares × dividend per share; after-tax dividend = annual dividend × (1 - tax rate)',
    example: 'Owning 100 shares with a $1.20 annual dividend per share produces $120 before tax. At a 15% tax rate, the after-tax estimate is $102.',
    mistakes: ['Mixing quarterly and annual dividend amounts', 'Assuming dividends are guaranteed', 'Treating monthly average as actual monthly payment timing'],
    disclaimer: 'Dividend payments can change or stop. This calculator does not evaluate dividend safety or tax rules.',
    faqs: [
      { question: 'Is monthly average the actual payout schedule?', answer: 'No. It is annual dividend income divided by 12. Actual payment timing depends on the company or fund.' },
      { question: 'Should I use forward or trailing dividend?', answer: 'Use the figure that matches your planning assumption and label it clearly in your notes.' },
      { question: 'Does this work for ETFs?', answer: 'Yes, if you enter the ETF distribution per share as the dividend amount.' },
    ],
    related: stockRelatedEn,
  },
  {
    id: 'dividend-yield',
    lang: 'en',
    slug: 'dividend-yield-calculator',
    title: 'Dividend Yield Calculator - Annual Dividend Yield From Share Price',
    h1: 'Dividend Yield Calculator',
    description: 'Calculate dividend yield from stock price and annual dividend per share, plus estimated dividend income from an investment amount.',
    keywords: 'dividend yield calculator, dividend rate calculator, dividend stock yield',
    category: 'Investing',
    icon: '🏦',
    answer: 'Dividend yield is annual dividend per share divided by the current share price. A high yield can be attractive, but it can also reflect a falling share price or payout risk.',
    fields: [
      { id: 'stockPrice', label: 'Current share price', suffix: 'USD', value: '50', min: '0', step: '0.01' },
      { id: 'annualDividend', label: 'Annual dividend per share', suffix: 'USD', value: '2', min: '0', step: '0.01' },
      { id: 'investment', label: 'Investment amount', suffix: 'USD', value: '1000', min: '0', step: '1' },
    ],
    resultLabels: ['Dividend yield', 'Estimated shares', 'Estimated annual dividend'],
    formula: 'Dividend yield = annual dividend per share ÷ current share price × 100',
    example: 'A $50 stock with a $2 annual dividend has a 4% dividend yield. A $1,000 investment buys about 20 shares and would estimate $40 in annual dividends before tax.',
    mistakes: ['Assuming a high yield is automatically safe', 'Ignoring dividend cuts', 'Forgetting tax effects on income'],
    disclaimer: 'Yield is a snapshot from current inputs. It does not forecast future dividends or share prices.',
    faqs: [
      { question: 'Why can dividend yield rise when a stock falls?', answer: 'If the dividend stays the same while price falls, the dividend divided by price becomes larger.' },
      { question: 'Does this include taxes?', answer: 'No. It estimates pre-tax dividend income.' },
      { question: 'Can I use this for funds?', answer: 'Yes, if you use annual distribution per share and current fund price.' },
    ],
    related: stockRelatedEn,
  },
  {
    id: 'foreign-stock-return',
    lang: 'en',
    slug: 'foreign-stock-return-calculator',
    title: 'Foreign Stock FX Return Calculator - Stock and Currency Return',
    h1: 'Foreign Stock FX Return Calculator',
    description: 'Calculate local-currency return for a foreign stock using buy price, sell price, shares, and buy/sell exchange rates.',
    keywords: 'foreign stock return calculator, FX return calculator, currency adjusted return',
    category: 'Investing',
    icon: '🌎',
    answer: 'Foreign stock returns depend on both share price movement and exchange rate movement. A gain in the foreign currency can look different after conversion back to your local currency.',
    fields: [
      { id: 'buyPrice', label: 'Buy price', suffix: 'USD', value: '100', min: '0', step: '0.01' },
      { id: 'sellPrice', label: 'Sell price', suffix: 'USD', value: '120', min: '0', step: '0.01' },
      { id: 'shares', label: 'Shares', suffix: 'shares', value: '10', min: '0', step: '1' },
      { id: 'buyFx', label: 'Buy FX rate', suffix: 'local/USD', value: '1.00', min: '0', step: '0.0001' },
      { id: 'sellFx', label: 'Sell FX rate', suffix: 'local/USD', value: '1.05', min: '0', step: '0.0001' },
    ],
    resultLabels: ['Local-currency profit', 'Local-currency return', 'FX effect'],
    formula: 'Local return = (sell price × sell FX - buy price × buy FX) ÷ (buy price × buy FX) × 100',
    example: 'If a stock rises from $100 to $120 and the exchange rate also rises from 1.00 to 1.05, the local-currency return is higher than the stock-only dollar return.',
    mistakes: ['Checking only the foreign-currency stock return', 'Using the same FX rate for buy and sell dates', 'Ignoring conversion spreads and taxes'],
    disclaimer: 'Actual results can differ due to FX spreads, broker fees, taxes, and settlement rules.',
    faqs: [
      { question: 'Can currency movement turn a gain into a loss?', answer: 'Yes. A large adverse currency move can offset stock gains after conversion.' },
      { question: 'What is FX effect?', answer: 'It estimates how much of the local-currency result comes from exchange rate movement alone.' },
      { question: 'Which exchange rate should I use?', answer: 'Use the effective rate from your purchase and sale or the rate applied by your broker.' },
    ],
    related: stockRelatedEn,
  },
  {
    id: 'etf-investment',
    lang: 'en',
    slug: 'etf-investment-calculator',
    title: 'ETF Recurring Investment Calculator - Monthly Investing Future Value',
    h1: 'ETF Recurring Investment Calculator',
    description: 'Estimate future value from an initial ETF investment, monthly contribution, expected annual return, and investment period.',
    keywords: 'ETF investment calculator, recurring investment calculator, monthly investing calculator',
    category: 'Investing',
    icon: '📈',
    answer: 'Recurring ETF investing can be modeled as an initial lump sum plus monthly contributions growing at an assumed return. Time and contribution amount usually drive most of the result.',
    fields: [
      { id: 'initialAmount', label: 'Initial investment', suffix: 'USD', value: '1000', min: '0', step: '1' },
      { id: 'monthlyContribution', label: 'Monthly contribution', suffix: 'USD', value: '300', min: '0', step: '1' },
      { id: 'annualReturn', label: 'Expected annual return', suffix: '%', value: '6', min: '-50', max: '100', step: '0.1' },
      { id: 'years', label: 'Investment period', suffix: 'years', value: '20', min: '1', max: '60', step: '1' },
    ],
    resultLabels: ['Estimated future value', 'Total contributed', 'Estimated growth'],
    formula: 'Future value = compounded initial investment + monthly contribution future value',
    example: 'With $1,000 upfront, $300 per month, 6% annual return, and 20 years, total contributions are $73,000 and estimated future value can be meaningfully higher.',
    mistakes: ['Using an unrealistically high expected return', 'Assuming markets grow smoothly every year', 'Ignoring fund expense ratios and taxes'],
    disclaimer: 'This is a constant-return scenario, not a market forecast. ETF investments can lose value.',
    faqs: [
      { question: 'Can I use a negative return?', answer: 'Yes. Enter a negative annual return to model a downside scenario.' },
      { question: 'Are contributions assumed monthly?', answer: 'Yes. The model assumes end-of-month contributions and monthly compounding.' },
      { question: 'Does this include ETF fees?', answer: 'No. Use a more conservative expected return if you want to approximate fees and taxes.' },
    ],
    related: stockRelatedEn,
  },
  {
    id: 'ai-token',
    lang: 'en',
    slug: 'ai-token-calculator',
    title: 'AI Token Calculator - Estimate Tokens From Text',
    h1: 'AI Token Calculator',
    description: 'Estimate AI input tokens from text length and combine them with expected output tokens for API cost planning.',
    keywords: 'AI token calculator, token counter, GPT token calculator, LLM token estimator',
    category: 'AI',
    icon: '🤖',
    answer: 'AI tokens are the units language models process. This calculator estimates input tokens from text and combines them with expected output tokens so you can plan API usage before sending requests.',
    fields: [
      { id: 'promptText', label: 'Text to estimate', suffix: '', value: 'AI cost planning starts with estimating input and output tokens.', type: 'textarea' },
      { id: 'outputTokens', label: 'Expected output tokens', suffix: 'tokens', value: '800', min: '0', step: '1' },
    ],
    resultLabels: ['Estimated input tokens', 'Estimated total tokens', 'Word count'],
    formula: 'Rough English estimate: about 4 characters per token. Actual tokenization varies by model and language.',
    example: 'If each support ticket uses about 500 input tokens and 150 output tokens, processing 10,000 tickets requires roughly 6.5 million total tokens.',
    mistakes: ['Treating characters, words, and tokens as the same unit', 'Forgetting output tokens', 'Assuming every provider uses the same tokenizer'],
    disclaimer: 'This is an estimate. For exact counts, use the provider tokenizer or API usage response.',
    faqs: [
      { question: 'Is a token the same as a word?', answer: 'No. A word can be one token, multiple tokens, or part of a token depending on the tokenizer.' },
      { question: 'Do output tokens cost money?', answer: 'Most APIs bill input and output tokens separately, often at different rates.' },
      { question: 'Why is this an estimate?', answer: 'Tokenization depends on model, language, punctuation, and formatting.' },
    ],
    related: aiRelatedEn,
    sourceLinks: aiSources,
  },
  {
    id: 'chatgpt-api-cost',
    lang: 'en',
    slug: 'chatgpt-api-cost-calculator',
    title: 'ChatGPT API Cost Calculator - Estimate Token-Based API Cost',
    h1: 'ChatGPT API Cost Calculator',
    description: 'Estimate ChatGPT API cost from input tokens, output tokens, request count, and per-million token prices.',
    keywords: 'ChatGPT API cost calculator, OpenAI API cost calculator, GPT token cost',
    category: 'AI',
    icon: '💬',
    answer: 'ChatGPT API cost is usually input token cost plus output token cost. At scale, small changes in prompt length or response length can materially change monthly spend.',
    fields: [
      { id: 'inputTokens', label: 'Input tokens per request', suffix: 'tokens', value: '1200', min: '0', step: '1' },
      { id: 'outputTokens', label: 'Output tokens per request', suffix: 'tokens', value: '500', min: '0', step: '1' },
      { id: 'requests', label: 'Requests', suffix: 'calls', value: '10000', min: '0', step: '1' },
      { id: 'inputPrice', label: 'Input price', suffix: '$/1M tokens', value: '1.25', min: '0', step: '0.01' },
      { id: 'outputPrice', label: 'Output price', suffix: '$/1M tokens', value: '10', min: '0', step: '0.01' },
    ],
    resultLabels: ['Estimated total cost', 'Input cost', 'Output cost'],
    formula: 'Total cost = input tokens × requests ÷ 1,000,000 × input price + output tokens × requests ÷ 1,000,000 × output price',
    example: 'With 1,200 input tokens, 500 output tokens, 10,000 requests, $1.25 input pricing and $10 output pricing, estimated total cost is about $65.',
    mistakes: ['Using one price for both input and output', 'Leaving out retries and tests', 'Forgetting tool, search, image, or audio charges'],
    disclaimer: 'Model prices change. Confirm current rates on the official OpenAI pricing page before budgeting.',
    faqs: [
      { question: 'Why separate input and output pricing?', answer: 'Many AI models have different prices for input and output tokens.' },
      { question: 'How should I estimate request count?', answer: 'Start with users × average actions per user, then add retries, background jobs, and testing traffic.' },
      { question: 'Does this include web search or tools?', answer: 'No. This calculator focuses on text token costs only.' },
    ],
    related: aiRelatedEn,
    sourceLinks: aiSources,
  },
  {
    id: 'ai-model-cost-comparison',
    lang: 'en',
    slug: 'ai-model-cost-comparison',
    title: 'AI Model Cost Comparison Calculator - GPT vs Claude vs Gemini',
    h1: 'AI Model Cost Comparison Calculator',
    description: 'Compare estimated GPT, Claude, and Gemini API costs using the same input tokens, output tokens, request count, and editable model prices.',
    keywords: 'AI model cost comparison, GPT vs Claude cost, Gemini API cost calculator, LLM pricing calculator',
    category: 'AI',
    icon: '⚖️',
    answer: 'AI model cost comparison applies the same token workload to different input and output prices. This helps separate usage volume from provider pricing before deeper quality testing.',
    fields: [
      { id: 'inputTokens', label: 'Input tokens per request', suffix: 'tokens', value: '2000', min: '0', step: '1' },
      { id: 'outputTokens', label: 'Output tokens per request', suffix: 'tokens', value: '700', min: '0', step: '1' },
      { id: 'requests', label: 'Requests', suffix: 'calls', value: '5000', min: '0', step: '1' },
      { id: 'gptInputPrice', label: 'GPT input price', suffix: '$/1M', value: '1.25', min: '0', step: '0.01' },
      { id: 'gptOutputPrice', label: 'GPT output price', suffix: '$/1M', value: '10', min: '0', step: '0.01' },
      { id: 'claudeInputPrice', label: 'Claude input price', suffix: '$/1M', value: '3', min: '0', step: '0.01' },
      { id: 'claudeOutputPrice', label: 'Claude output price', suffix: '$/1M', value: '15', min: '0', step: '0.01' },
      { id: 'geminiInputPrice', label: 'Gemini input price', suffix: '$/1M', value: '1.25', min: '0', step: '0.01' },
      { id: 'geminiOutputPrice', label: 'Gemini output price', suffix: '$/1M', value: '10', min: '0', step: '0.01' },
    ],
    resultLabels: ['GPT estimated cost', 'Claude estimated cost', 'Gemini estimated cost'],
    formula: 'Model cost = input tokens × calls ÷ 1,000,000 × input price + output tokens × calls ÷ 1,000,000 × output price',
    example: 'Using 2,000 input tokens, 700 output tokens, and 5,000 calls, each provider total changes directly with its editable per-million token prices.',
    mistakes: ['Choosing only by price without quality tests', 'Ignoring caching, batching, or rate limits', 'Forgetting non-text charges such as search, images, audio, or tool execution'],
    disclaimer: 'Default prices are editable examples. Check official provider pricing for current rates and model-specific rules.',
    faqs: [
      { question: 'Is the cheapest model always best?', answer: 'No. Lower price can be offset by worse quality, higher retry rates, or longer workflows.' },
      { question: 'Does this include prompt caching?', answer: 'No. Enter adjusted effective prices if you want to model caching or batch discounts.' },
      { question: 'Can I compare any provider?', answer: 'Yes. Replace the editable price fields with the provider and model rates you want to compare.' },
    ],
    related: aiRelatedEn,
    sourceLinks: aiSources,
  },
];

export const growthCalculatorPages: GrowthCalculatorPageData[] = [...koPages, ...enPages];

export function getGrowthPagesByLang(lang: GrowthCalculatorLang): GrowthCalculatorPageData[] {
  return growthCalculatorPages.filter((page) => page.lang === lang);
}

export function getGrowthPageBySlug(lang: GrowthCalculatorLang, slug: string): GrowthCalculatorPageData | undefined {
  return growthCalculatorPages.find((page) => page.lang === lang && page.slug === slug);
}
