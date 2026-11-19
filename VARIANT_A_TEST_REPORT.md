# Version A validation

The production Angular build passed. The GitHub Pages build passed at /skill2work/ with hash routing. The HTTP server check passed all 12 route and asset checks.

| Suite | Passed |
| --- | ---: |
| Domain | 7 |
| TypeScript source | 3 |
| Compiled application DOM | 11 |
| UX and navigation | 10 |
| V3 workflow regressions | 10 |
| V4 features and media | 13 |
| Passport | 4 |
| Pages base path and deep links | 16 |

These suites exercise the four role workspaces, ownership restrictions, evidence and minimums, interview responses, ticket data, profile persistence, language and theme settings, navigation and assessment recovery.

## Browser limitation

Playwright attempted to launch system Chromium. The environment denied its process-singleton socket before any page rendered. Browser E2E assertions, visual appearance, mobile overflow, rendered RTL, reduced-motion behavior and screenshots are unverified here. The review directory contains only the original passport reference images.

The new tests/variant-a.e2e.ts captures the eight requested views at 1440 and 390 pixels on a browser-capable machine. Run npm run test:e2e after installing Playwright Chromium or setting CHROMIUM_PATH. Its review uses fictional local fixtures.

## Revalidation against the supplied archive

The SHA-256 of the supplied source ZIP matches the input used for this variant (6b7f933e6d99cda8bc5cd92f01024d059ad06de04f95d3ed3886079df0022933). During revalidation the source suite caught a later motion rule after the global override. The global override now appears last in the stylesheet. All three source checks and the production rebuild passed after the correction.
