import { verifyCalculatorRoutes } from '../../src/lib/insights/calculator-route-verifier.mjs';

const result = await verifyCalculatorRoutes();

if (!result.ok) {
  console.error('Calculator route verification failed.');

  if (result.missing.length > 0) {
    console.error(`Missing routes: ${result.missing.map((route) => route.path).join(', ')}`);
  }

  if (result.noindex.length > 0) {
    console.error(`Noindex calculator routes: ${result.noindex.map((route) => route.path).join(', ')}`);
  }

  if (result.canonicalMismatches.length > 0) {
    console.error(`Canonical mismatches: ${result.canonicalMismatches.map((route) => route.path).join(', ')}`);
  }

  process.exit(1);
}

console.log(`Calculator route verification passed (${result.checked} URL(s)).`);
