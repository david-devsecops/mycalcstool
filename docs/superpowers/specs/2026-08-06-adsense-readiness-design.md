# AdSense Readiness Design

## Goal

Improve mycalcstool's AdSense approval readiness by reducing thin-page signals, clarifying the site's finance-first editorial focus, and disabling ad loading by default until AdSense is intentionally enabled.

## Current Issues

- The site has many calculator-style URLs, which can look like low-value tool inventory if pages contain only inputs and short formulas.
- The homepage still reads broadly as a general calculator collection instead of a focused finance decision-support site.
- Trust pages exist, but they need stronger editorial scope, update process, correction process, and limits of advice.
- AdSense currently loads by default when a publisher ID exists, even if the environment does not explicitly opt in.

## Design

Use the existing Astro structure and data-driven calculator template. Do not add dependencies or a new CMS.

1. Change monetization default behavior so ads are disabled unless `PUBLIC_AD_PROVIDER=adsense` is explicitly set.
2. Strengthen Korean and English homepages with a finance-first positioning section, review principles, and clear paths to methodology/contact pages.
3. Add reusable content sections to the shared growth calculator template:
   - input checklist generated from the calculator fields
   - result interpretation generated from result labels
   - review and update note with the current review date
4. Expand Korean and English About and Methodology pages with editorial scope, correction workflow, YMYL-style disclaimer language, and AI/investing methodology notes.

## Constraints

- Keep all calculations client-side.
- Do not add third-party packages.
- Do not remove existing calculator URLs.
- Keep health and utility calculators available, but position them as supporting tools.
- Keep copy factual and non-promotional.

## Verification

- Run `npm run build`.
- Confirm representative generated pages include the new review sections.
- Confirm default build does not include the AdSense script unless `PUBLIC_AD_PROVIDER=adsense` is explicitly set.
