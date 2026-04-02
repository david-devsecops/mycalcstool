export type AdProvider = 'none' | 'adsense' | 'ezoic';

const rawAdProvider = (import.meta.env.PUBLIC_AD_PROVIDER ?? '').trim().toLowerCase();
const adsenseClientValue = (import.meta.env.PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-2898972256894696').trim();
const gaMeasurementIdValue = (import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? 'G-DWJ06N3894').trim();
const contactEmailValue = (import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'golreas@gmail.com').trim();
const ownerNameValue = (import.meta.env.PUBLIC_SITE_OWNER ?? 'mycalcstool Editorial Team').trim();

const hasEzoicPlaceholders = [
  import.meta.env.PUBLIC_EZOIC_PLACEHOLDER_TOP,
  import.meta.env.PUBLIC_EZOIC_PLACEHOLDER_RESULT,
  import.meta.env.PUBLIC_EZOIC_PLACEHOLDER_CONTENT,
  import.meta.env.PUBLIC_EZOIC_PLACEHOLDER_MID,
  import.meta.env.PUBLIC_EZOIC_PLACEHOLDER_MID2,
].some((value) => Boolean(value?.trim()));

const validProviders: AdProvider[] = ['none', 'adsense', 'ezoic'];

export const adProvider: AdProvider = validProviders.includes(rawAdProvider as AdProvider)
  ? (rawAdProvider as AdProvider)
  : hasEzoicPlaceholders
    ? 'ezoic'
    : adsenseClientValue
      ? 'adsense'
      : 'none';

export const adsenseClient = adsenseClientValue;
export const gaMeasurementId = gaMeasurementIdValue;
export const contactEmail = contactEmailValue;

export const siteMeta = {
  name: 'mycalcstool',
  url: 'https://mycalcstool.com',
  author: ownerNameValue,
  organizationName: 'mycalcstool',
  editorLabel: ownerNameValue,
  contactEmail: contactEmailValue,
  focusSummary: {
    ko: '금융 계산기를 우선 강화하고, 건강 및 생활 계산기는 보조 도구로 운영합니다.',
    en: 'We prioritize finance calculators first and keep health and utility tools as supporting calculators.',
  },
};

export const adProviderLabel = {
  ko:
    adProvider === 'ezoic'
      ? 'Ezoic 및 광고 파트너'
      : adProvider === 'adsense'
        ? 'Google AdSense'
        : '향후 적용 가능한 광고 파트너',
  en:
    adProvider === 'ezoic'
      ? 'Ezoic and its advertising partners'
      : adProvider === 'adsense'
        ? 'Google AdSense'
        : 'future advertising partners if ads are enabled later',
};
