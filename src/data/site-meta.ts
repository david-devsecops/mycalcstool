export type AdProvider = 'none' | 'adsense';

const rawAdProvider = (import.meta.env.PUBLIC_AD_PROVIDER ?? '').trim().toLowerCase();
const adsenseClientValue = (import.meta.env.PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-2898972256894696').trim();
const gaMeasurementIdValue = (import.meta.env.PUBLIC_GA_MEASUREMENT_ID ?? 'G-DWJ06N3894').trim();
const contactEmailValue = (import.meta.env.PUBLIC_CONTACT_EMAIL ?? 'golreas@gmail.com').trim();
const ownerNameValue = (import.meta.env.PUBLIC_SITE_OWNER ?? 'mycalcstool Editorial Team').trim();

export const adProvider: AdProvider =
  rawAdProvider === 'none' ? 'none' : adsenseClientValue ? 'adsense' : 'none';

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
  ko: adProvider === 'adsense' ? 'Google AdSense' : '비활성화된 광고 기능',
  en: adProvider === 'adsense' ? 'Google AdSense' : 'ads are currently disabled',
};
