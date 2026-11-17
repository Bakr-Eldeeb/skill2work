# Final validation — 17 November 2026

This is the current acceptance record for `Skill2Work_Final_UX_Polished_Frontend.zip`. Older TEST_REPORT/UX_TEST_REPORT documents are historical. The latest uploaded UX/Motion source was repaired in place in an isolated work folder. It was not rebuilt from another prototype.

## Build gate and reported errors

- `npm ci` succeeded with the supplied compatible lockfile.
- Removed duplicate translation property `Assessment results`, preserving the complete Arabic dictionary including identifier-style keys.
- Fixed Settings `@for` tracking to `u.email` on the `{role,email}` projection. Passwords were not added back.
- `npm run build` passed before further UX implementation (Gate 1). Subsequent AOT builds passed with no remaining TypeScript/template errors.
- Port 4200 stays unchanged; alternative-port/old-server instructions are in both READMEs.

## Executed automated checks

The actual compiled Angular application is evaluated in Happy DOM for behavioral tests. This is not a screenshot renderer or a real Chromium browser.

| Command                                      | Result                                                                                                                                   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                     | Dependencies installed from the synchronized lockfile                                                                                    |
| `npm run build`                              | Production AOT compilation passed                                                                                                        |
| `npm run test:source`                        | 3 passed: every TS object checked for duplicate keys/syntax, Settings projection/persistence isolation, reduced-motion override          |
| `npm run test:domain`                        | 7 passed: coherent seed, match/overall/null evidence, thresholds, ranking, publish validation, question counts/rounding, decimal weights |
| `npm run test:dom`                           | 11 passed: real AOT routes and cross-role workflows                                                                                      |
| `npm run test:ux`                            | 10 passed: behavioral consolidation/Back/password/assessment regressions                                                                 |
| `npm run build:pages` + `npm run test:pages` | Production Pages build and 5 role/base-path/asset/hash-navigation DOM tests passed                                                       |
| `npm run test:server`                        | Real `npm start` readiness, 6 deep-link/title/root responses and 6 brand/favicon assets: 12 HTTP checks                                  |
| `npm run format:check`                       | Formatting verification before packaging                                                                                                 |

Fresh-extraction verification uses a clean source-only archive in a separate directory, a new `node_modules` installed with `npm ci`, and repeats build/domain/DOM/UX/source/server/Pages checks. No generated build or dependency folder from the development source is needed. Final ZIP integrity and required source/config/docs/assets are checked before handoff.

## Functional coverage

The 11 AOT DOM journeys cover 39 protected routes/subviews, primary pages for all four roles, and specifically a direct bootstrap of **`/candidate/assessments`**, whose main contains Assessment overview, skill/difficulty controls and Start assessment. This is real compiled page content, not a sidebar-only/static mock check.

Other executed journeys: signup/password validation and required-university data; manual profile/claimed skill; applying without assessment and duplicate prevention; visibility to the relevant recruiter; company Pending/Rejected/Approved gates; invalid publish/draft/valid publish/discovery; recommendations versus all-candidate search/applicants; assessment results/cooldown/recovery/cancellation; status and interview Accept/Decline/Reschedule synchronization; job requirement notices; fair creation/company participation/job linking/self-reported registration/fair-origin applications; aggregate analytics; changed-university cancellation; admin university account creation/edit; notifications; locale/theme state; storage events/session revocation; reassessment below threshold removes a recommendation and preserves applications.

Ten added UX regressions test:

1. Parent-route rules stay within role and preserve fair/application context.
2. Shared Back returns through meaningful history, keeps query context, uses parents on direct access, hides on dashboards and never returns to another role/auth page.
3. Skills/Passport/Results consolidate while legacy URLs and mobile priorities remain intact.
4. Candidate discovery tabs retain threshold gating and canonical active navigation; pipeline alias uses Applicants & hiring.
5. Fair sections include registrations and jobs while avoiding individual passport/results access.
6. Settings and university editing do not reveal/prefill passwords; blank password updates retain credentials.
7. Initial full assessment includes only unassessed claims; full reassessment includes eligible evaluated skills and skips cooling results.
8. Expiry preserves actual partial text, records timed-out status, and saves open-answer drafts across rebootstrap.
9. A recoverable profile/result conflict retains the completed attempt, shows Retry, and saves only the latest per-skill results after recovery.

Scoring fixtures remain explicitly simulated; none of these tests proves real LLM generation/grading, production authentication or anti-cheating detection.

10. Skip-to-content focuses the main region without changing local or Pages routes.

## Browser/visual limitation — NOT passed

`npx playwright install chromium` was executed; the environment returned corrupt/truncated download archives. The installed system Chromium was then attempted with `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e -- --grep 'all screen groups'`. It aborted before any page assertions, with `socket() failed: Operation not permitted` in Chromium's process-singleton setup. The remaining browser cases were not run. No browser screenshots or visual passes are fabricated.

Therefore desktop/mobile layout, actual no-overflow behavior, font/logo painting, keyboard-focus appearance, dark-mode contrast, RTL layout mirroring, animation quality and reduced-motion appearance remain **visually unverified**. Source rules and DOM state are tested, but do not establish CSS geometry. The authored Playwright suite includes four-role routes, representative captures, 1440×900 and 390×844 checks, direct reload, Back, Arabic/dark mode, blank password fields, fair sections, and reduced-motion assertions for local rerun.

Run on Windows:

```powershell
npm ci
npx playwright install chromium
npm run test:e2e
```

## Dependency audit

`npm audit` reports **11 high-severity entries in the development dependency graph**, rooted in the picomatch advisory. `npm audit --omit=dev` reports **0 runtime dependency vulnerabilities**. No compatible patched picomatch version was available from the registry; unsafe Angular downgrade/TypeScript major changes and `audit fix --force` were not applied. The remaining entries, locked versions, source advisory and scope are documented in DEPENDENCY_AUDIT_FINAL.md. This is not a claim that all dependency warnings are resolved.

## Environment and package boundary

Node 24.22.1, npm 11.9.0, Angular 22.2.6. Supported Node ranges are declared in package.json and READMEs. The ZIP excludes node_modules, dist, .angular, caches, browser binaries/results, logs and secrets. It contains the `skill2work-angular` root, complete source, exact supplied logos/favicons, lockfile, tests, docs and optional GitHub Pages workflow. No remote repository or Pages deployment was performed for this refinement task.
