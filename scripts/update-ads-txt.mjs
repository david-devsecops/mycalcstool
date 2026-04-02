import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const domain = 'mycalcstool.com';
const outputPath = path.join(process.cwd(), 'public', 'ads.txt');

async function readDotEnv() {
  const envPath = path.join(process.cwd(), '.env');

  try {
    const raw = await readFile(envPath, 'utf8');
    return Object.fromEntries(
      raw
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const index = line.indexOf('=');
          const key = line.slice(0, index).trim();
          const value = line.slice(index + 1).trim().replace(/^['"]|['"]$/g, '');
          return [key, value];
        }),
    );
  } catch {
    return {};
  }
}

async function writeAdsTxt(body) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${body.trim()}\n`, 'utf8');
}

const envFile = await readDotEnv();
const env = { ...envFile, ...process.env };
const adsenseClient = env.PUBLIC_ADSENSE_CLIENT?.trim() || 'ca-pub-2898972256894696';
const rawProvider = env.PUBLIC_AD_PROVIDER?.trim().toLowerCase();
const hasEzoicConfig = [
  env.PUBLIC_EZOIC_PLACEHOLDER_TOP,
  env.PUBLIC_EZOIC_PLACEHOLDER_RESULT,
  env.PUBLIC_EZOIC_PLACEHOLDER_CONTENT,
  env.PUBLIC_EZOIC_PLACEHOLDER_MID,
  env.PUBLIC_EZOIC_PLACEHOLDER_MID2,
].some((value) => Boolean(value?.trim()));

const provider =
  rawProvider === 'adsense' || rawProvider === 'ezoic' || rawProvider === 'none'
    ? rawProvider
    : hasEzoicConfig
      ? 'ezoic'
      : adsenseClient
        ? 'adsense'
        : 'none';

if (provider === 'adsense' && adsenseClient) {
  const publisherId = adsenseClient.replace(/^ca-pub-/, '').trim();

  if (!publisherId) {
    throw new Error('PUBLIC_ADSENSE_CLIENT is missing a publisher id.');
  }

  await writeAdsTxt(`google.com, pub-${publisherId}, DIRECT, f08c47fec0942fa0`);
  console.log(`Updated ${outputPath} for Google AdSense.`);
  process.exit(0);
}

if (provider === 'ezoic') {
  const accountId = env.EZOIC_ADS_TXT_ACCOUNT_ID?.trim() || '19390';
  const sourceUrl = `https://srv.adstxtmanager.com/${accountId}/${domain}`;
  const response = await fetch(sourceUrl, {
    headers: {
      'user-agent': 'mycalcstool ads.txt sync',
    },
  });

  if (response.status === 404) {
    console.warn(`Ezoic ads.txt source is not available yet for ${domain}. Keeping the existing ${outputPath}.`);
    process.exit(0);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch ads.txt from ${sourceUrl}: ${response.status} ${response.statusText}`);
  }

  const body = (await response.text()).trim();

  if (!body || body.startsWith('<')) {
    throw new Error(`Unexpected ads.txt response from ${sourceUrl}`);
  }

  await writeAdsTxt(body);
  console.log(`Updated ${outputPath} from ${sourceUrl}`);
  process.exit(0);
}

await writeAdsTxt(`# Configure PUBLIC_AD_PROVIDER and ad account credentials before publishing ads.\n# Supported providers: adsense, ezoic`);
console.log(`Wrote placeholder ${outputPath} because no ad provider is configured.`);
