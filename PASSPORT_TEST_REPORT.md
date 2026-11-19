# Interactive Skill Passport test report

Tested on 19 November 2026 with Node 24.22.3, npm 11.9.0 and Angular 22.2.6. The preview uses the V4 source archive that includes the Find Jobs footer correction.

| Check                                 | Executed result                                                                                                                                                                                                                                                                                                 |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install from package-lock.json        | `npm ci` installed 292 packages. A first offline attempt encountered a missing cache entry.                                                                                                                                                                                                                     |
| Production build                      | `npm run build` completed Angular AOT compilation and template checking.                                                                                                                                                                                                                                        |
| Domain and compiled application tests | 58 passed across the domain, source, DOM, prior UX, V3, V4, media and new passport suites. The UI suites in this row use Happy DOM.                                                                                                                                                                             |
| Development server                    | `npm run test:server` launched `npm start` and passed six route and six asset HTTP checks. The route checks covered all four roles and candidate assessments.                                                                                                                                                   |
| GitHub Pages                          | `npm run build:pages` succeeded. All 16 Pages checks passed, including the passport hash deep link, assessments and repository-relative branding assets.                                                                                                                                                        |
| Playwright runner                     | `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e` attempted the 16 specs. The worker's Chromium process exited before every test body because creation of its process-singleton socket was denied. These specs have no passing result from this runner.                                                        |
| Interactive browser                   | Separately exercised the production bundle in managed Chrome using the local preview. Desktop viewport was 1348 × 926. Mobile used a 390 × 844 viewport inside the browser.                                                                                                                                     |
| Motion                                | Captured frames during opening and turning. Also exercised the instant path using a test-only browser override for the reduced-motion media query. Open, Next and Close worked, and the observer counted zero turning leaves. Native OS preference switching and hardware screen-reader output were not tested. |

## What was observed in Chrome

- Opened the closed cover, inspected the holder and index, turned between spreads, switched to the list and back, and closed the book. Bounds disabled Previous on the first spread and Next on the final page.
- The demo holder had four assessed skills, a track-derived overall of 57.7 and initials in place of a missing photo. The Angular entry displayed its recorded 50/100 and assessment date. The full read-only recruiter profile and its role boundaries also passed the compiled application suite.
- Added Accessibility through the real skill form. The reader showed one claimed skill, the reserved outline and the assessment link. List View showed the same record. Switching language and theme preserved the current page, and the right-arrow key moved to the previous Arabic spread.
- Followed Assess skill. The assessment overview rendered and preselected Accessibility. Completed all four questions. The local simulator recorded 65/100. The assessed count became five, the list and passport both reflected that score, and the new stamp, dated feedback and 24-hour cooldown appeared. Expanding the disclosure revealed the stored question explanations. The four original skills and overall stayed intact.
- Re-tested List View from the results deep link after fixing a component recreation issue found during browser review. The final build opened the requested list on the first click.
- Verified one leaf on mobile. The usable root width and content width both measured 375 CSS pixels inside the 390-pixel viewport including the scrollbar. After a focus/scroll correction, the identity heading appeared 155 pixels below the top instead of partly above it. Next and the index worked in the single-page layout.
- Regression fixtures independently covered a scored zero, missing score, cross-candidate feedback isolation, live cooldown expiry, focus/transition locking, reduced motion, reading-position retention and results deep links.

## Archive verification

The source archive passed CRC verification. A clean extraction installed all 292 packages, completed the production build and passed all four passport regression tests. The project-wide Prettier check passed. The packaged lockfile, original demo seed, matching engine and GitHub Actions workflow were compared byte-for-byte with the V4 footer-fix baseline.

## Visual evidence

The `review/` directory contains nine actual Chrome captures. The first eight cover the closed cover, identity spread, assessed spread, unassessed page, list, mobile identity, Arabic dark mode and mobile stamps. The ninth shows Accessibility after the local assessment with the feedback expanded. The GIF uses 12 browser frames, including frames captured during both transitions, with brief holds for readability.

The review server opened an isolated seeded candidate session for visual testing. Its bootstrap, temporary fixtures, browser state, build output and development dependencies are excluded from the source archive. The added Accessibility record belongs to that review session. The distributed demo seed is unchanged.

## Reproduce

Run these commands inside the extracted project. The application suites read the latest local production bundle. Build for local routing first, then build for Pages before running its tests.

```powershell
npm ci
npm run build
node --import tsx --test tests/domain.test.ts tests/source.test.mjs tests/dom.test.mjs tests/final-ux.test.mjs tests/v3.test.mjs tests/v4.test.mjs tests/media.test.mjs tests/passport.test.mjs
npm run test:server
npm run build:pages
npm run test:pages
npx playwright install chromium
npm run test:e2e
```
