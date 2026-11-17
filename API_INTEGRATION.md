# ASP.NET Core / SQL Server integration handoff

## Frontend boundaries

This ZIP contains no working backend or real AI. `DemoRepository` is the injectable signal-backed UI/domain boundary; feature components use it rather than manipulating browser storage. `matching.ts` and `assessment.ts` isolate pure calculations and explicit simulation fixtures. `models.ts` declares the current entities. `api-contracts.ts` provides request/response contracts, repository interfaces, configurable `API_BASE_URL`, and an optional HttpClient adapter which is **not called by Demo Mode**.

For server integration, preserve the feature-facing repository/facade methods and its state signals. Replace localStorage hydration/mutations with API requests, loading/error signals, server DTO mapping and refreshing affected entities. The synchronous demo methods currently throw validation errors; adapt them to async commands with pending/error state and disable duplicate submissions. Do not just change the API base URL and assume this app now uses a server: wire facade commands to the adapter and remove demo login/fixtures for production.

Use generated OpenAPI DTOs from the future .NET API. Add contract tests for DTO naming/nullability, validation error mapping, timestamps and authorization. Use UTC ISO-8601 timestamps in transport; interview and fair datetime-local values need explicit Egypt timezone conversion at the API boundary. Current local demo dates use the browser's local time.

## Suggested HTTP boundaries

Endpoint names below are proposed contracts, not existing services.

| Domain               | Suggested endpoints                                                                                                                     | Server ownership                                                                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Auth                 | POST `/api/auth/login`, `/logout`, `/candidates`, `/companies`; GET `/auth/me`                                                          | Password hashing, session/token issuance, role/approval enforcement, rate limiting |
| Candidate            | GET/PUT `/api/candidates/me`; GET `/candidates/{id}` for authorized recruiter views                                                     | Profile, university changes, privacy-filtered recruiter DTOs                       |
| Skills               | POST/DELETE `/api/candidates/me/skills`                                                                                                 | Canonical skill IDs, claims, newest evidence, cooldown history                     |
| Assessments          | POST `/api/assessments`; GET `/{id}/current-question`; POST `/{id}/answers`, `/{id}/submit`, `/{id}/cancel`; GET `/assessments/results` | Attempt state, timers, generation/grading, answer/rubric privacy                   |
| Matching             | GET `/api/jobs/{id}/match`; `/jobs/{id}/recommendations`                                                                                | Validated weights, score contributions, eligibility and stable ranking             |
| Jobs                 | GET `/api/jobs`; GET `/{id}`; POST/PUT `/api/company/jobs`; POST `/{id}/publish`                                                        | Ownership, publish validation, draft handling, revisions and recalculation         |
| Applications         | POST `/api/applications`; GET `/candidate/applications`, `/company/applications`; PATCH `/{id}/status`                                  | Unique candidate/job constraint, profile snapshot policy, valid state transitions  |
| Interviews           | POST `/api/applications/{id}/interview`; PATCH `/api/interviews/{id}/response`                                                          | Future times, authorized candidate responses, in-app notifications                 |
| Fairs                | GET/POST/PUT `/api/fairs`; POST `/{id}/companies`, `/{id}/registrations`; GET `/{id}/registrations`                                     | Institution scoping, published-job ownership, duplicate prevention                 |
| University analytics | GET `/api/university/analytics?fairId=...`                                                                                              | Aggregates only, no individual assessment DTOs                                     |
| Notifications        | GET `/api/notifications`; PATCH `/read`                                                                                                 | Per-account visibility, idempotency, delivery                                      |
| Admin                | GET `/api/admin/companies`; PATCH `/{id}/approval`; POST/PUT `/api/admin/universities`                                                  | Admin-only approval/institution account lifecycle                                  |

## Persistent model and integrity

SQL Server entities should include Users, Roles, Candidates, Companies, Universities, Skills, CareerTracks, TrackSkillWeights, CandidateSkills, AssessmentAttempts, Questions, Answers, Results, Jobs, JobSkills, Applications, Interviews, Fairs, FairCompanies, FairJobs, Registrations and Notifications.

Recommended constraints: unique email; one recruiter/company and university-admin/institution for MVP; canonical skill uniqueness per job/profile; unique application(candidate,job); unique registration(candidate,fair); foreign keys for linked jobs/companies/fairs; row-version or ETag concurrency; range checks for scores/thresholds/weights. Publishing must atomically require exactly 100 total percentage points and at least one Must-Have. Drafts may remain incomplete.

On published requirements edits, preserve applications, recompute matches, notify existing applicants. Candidate university changes cancel old-institution registrations but do not reattribute historical applications. Fair-origin `fairId` must be validated at application time against a real registration, institution and linked job; an ordinary existing application is never silently counted as fair-origin. Analytics counts `Application.fairId`, not all applications to participating companies.

## Matching contracts

Match points = `Σ(jobWeightPercentage × assessedScore) / 100`; missing evidence contributes no points and is not proof of zero proficiency. Null means no relevant evidence. Overall = `Σ(score × trackImportance) / Σ(included assessed trackImportance)`; null when no applicable evidence. Overall differs from job match. Case-insensitive demo names should become canonical Skill IDs in the API.

Eligibility first: every Must-Have must have an evaluated score and meet that requirement's minimum. Then rank match DESC, count of evaluated Nice-to-Haves DESC, overall DESC, ID ASC. Applicants and Talent Search remain separate from eligibility. Reassessment below a threshold removes recommendation eligibility and preserves applications.

## Real LLM assessment integration

Remove fixture question/score generation when enabling real assessment mode. The backend creates an attempt, validates targeted claimed skills and the 24-hour per-skill cooldown, selects difficulty, then generates and validates questions/rubrics. Preserve the documented per-skill 4/6/8 count and `round(0.3 × count)` MCQ split unless the product spec changes.

Return only the current question, permitted choices, progress and a server deadline. **Do not return keys, ideal answers or grading rubrics to the live browser attempt.** Keep LLM keys and provider calls on the server. Server time controls deadlines; record answers with idempotency keys. Make generation/grading failures retryable without duplicate attempts/results. Validate structured LLM output and ranges before persisting results. Make the latest successfully scored result the visible evidence; retain audit history server-side even though the MVP UI displays only the newest.

When real scoring succeeds, return score, strengths, weaknesses, per-question explanations and timestamp to the candidate. Recruiters receive only skill scores, assessment date and a short summary, **not the transcript**. Frontend simulation labels must remain present whenever fixtures are in use; never relabel fixture results as genuine verification.

## Separate anti-cheating service

Integrate the custom integrity model behind the backend with an explicit contract for consented signals, provenance, confidence and review status. This frontend does not collect webcam, biometric or screen recordings and makes no automatic cheating accusations. Do not turn a model signal into a definitive claim. Define consent/privacy/appeal and human review behavior separately before exposing any additional collection or decision UI.

## Security and operational work before production

Replace plaintext demo passwords and local session flags with trusted server authentication (for example secure HttpOnly cookies, CSRF protection, approved CORS configuration). Enforce role, ownership, company approval and institution scoping on every API action; route guards are insufficient. Add paging/search APIs for candidate discovery; do not ship all student/private data to university accounts. Handle authorization loss, API errors, version conflicts and token expiry. No frontend bundle may include LLM/provider secrets. There are no email/calendar integrations in this MVP; notifications remain in-app.

## Final facade/persistence and assessment boundary

The polished version removes storage implementation details from `DemoRepository`: `DemoPersistence`/`DEMO_PERSISTENCE` in `demo-persistence.ts` owns snapshot/session persistence; the repository owns domain commands and reactive state. Components call `addSkill`, `removeSkill`, `saveCredentials`, `markNotificationsRead` and `completeAssessment` rather than editing storage/state directly. Public `commit` remains an internal repository primitive for the local implementation; a future server facade must enforce commands atomically on the backend.

`AssessmentEngine`/`ASSESSMENT_ENGINE` is an asynchronous provider interface. `DemoAssessmentEngine` is explicitly a deterministic simulation. The assessment page exposes evaluating, success and recoverable failure states; Retry retains the completed attempt. Replace the engine/facade together for real API generation/grading, not just the local storage token. Draft sessionStorage is a tab recovery cache, not an authoritative assessment record.

`QuestionResponse` stores the entered answer separately from `answered`/`timed-out` status. Time expiry preserves actual partial input without inventing a placeholder response. Production APIs must store drafts/answers/deadlines server-side and enforce cooldowns against the latest successful per-skill result. Initial full assessment targets unassessed claims; full reassessment selects evaluated skills currently eligible after 24 hours. Recruiter DTOs must still exclude candidate answer text/transcripts.

Blank password fields mean preserve the existing credential when editing an account. Never return current passwords from a real Auth/Admin API. Demo fixtures remain local-only and are not security guarantees.
