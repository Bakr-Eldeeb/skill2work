# Interactive Skill Passport preview

This review edition adds a physical-style passport and a practical list to the existing candidate skills workspace. The application uses the same four roles and browser-local demo repository as V4.

## Open the experience on Windows

1. Extract the archive to a new folder. Open PowerShell inside `skill2work-angular`.
2. With a supported Node version (see README), run `npm ci`, then `npm start`.
3. Open **http://localhost:4200** and sign in with **candidate@skill2work.demo** and **Demo123!**.
4. Select **Skill Passport** in the sidebar or **Skills** in mobile navigation. You can also open **/candidate/passport** after signing in.

For an independent review against a fresh dataset, use a separate browser profile. Opening a different build on the same origin uses the existing browser-local account and data.

## Try the reader

- Open the cover to see the holder and evidence index. Desktop shows facing pages if the reader has at least 730 CSS pixels of content width. Narrower readers show one leaf. Each skill page holds up to two records.
- Use the index, Previous and Next, or the left and right arrow keys while focus is in the reader. Reading direction follows the interface language. Escape closes the book. Opening it again starts at the identity page.
- Switch to List View to scan scores, read feedback, or manage skills. Switching back restores your open page. Language, theme and results are available in the same workspace.
- To see both evidence states in a fresh demo, add a skill such as **Accessibility** below the passport. Open its claimed entry, then select **Assess skill**. Complete the local practice assessment and look at its updated score, feedback, stamp and reassessment availability.
- For visual review without installing, open **review/01-cover.jpg** through **review/08-mobile-stamps.jpg**, or **review/Skill_Passport_Walkthrough.gif**.

## What the passport shows

A stamp means the candidate has a recorded assessment score for that skill. Zero is a valid score. An unassessed skill has a reserved outline and a link to its assessment. The actual recorded score appears alongside every stamp. Employer thresholds and job recommendations continue to use the existing matching engine.

Holder details, current skill scores, date and feedback come from the active candidate. Photos use the existing media service, with initials when a photo is unavailable. The passport reference uses the full stable candidate ID. The system keeps the latest result per skill and has no passport creation timestamp. The identity page therefore labels its date **Earliest retained assessment** and omits it when no dated evidence exists. The overall score uses the existing career-track calculation and appears only when available.

Full local practice feedback appears in the disclosure when a matching, candidate-owned result exists. Older summary-only records display their stored summary and score. A new assessment restarts the existing 24-hour cooldown for that skill. Results, feedback and storage are local to the browser. The interface makes no claim of external certification or live AI grading.

## Implementation

The feature lives in `src/app/features/candidate/passport/`. The skills workspace owns the reader and list. `PassportData` projects the existing repository into holder, index and skill pages without a new storage schema. Both modes render `PassportEntry`. The book owns only reading position, responsive layout and transition state. The stamp and cover are lightweight components using local SVG assets and CSS. No dependency was added.

During motion, decorative turning leaves are inert and hidden from accessibility tools. Pages use a 510 ms transform, mirrored navigation in RTL and an instant reduced-motion path. Recruiters retain the existing read-only candidate profile and scannable skill evidence. Existing skills, passport, results and assessment routes remain available. The project includes its repository-relative GitHub Pages hash-routing build and deployment workflow.
