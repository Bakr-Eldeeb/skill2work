# Version A landing-page correction

The baseline was the delivered Version A archive with the interactive Skill Passport. A byte comparison of the baseline archive against the final project found changes to three application files, all in src/app/features/public: landing.html, landing.css, and landing.ts. Two existing tests (pages.test.mjs and v4.test.mjs) use the new public link and heading text. A new landing-reference.e2e.ts exercises the responsive layout and captures the requested views.

The header uses the existing themed logo. The hero includes an original passport illustration, native links, a sample evidence disclosure, and three benefits. The journey includes three linked steps. Sample previews pair assessed scores with job minimums, identify the university event as an example, and open the existing company and fair routes. Arabic copy follows the same language preference as the rest of the application.

New files in public/assets/landing are skill-passport.webp (1536 × 1024 original artwork), company-cover.webp (office facade cropped from the supplied reference), icons.svg (interface symbols), and sample-ticket.svg (illustration encoding a sample-only message).
