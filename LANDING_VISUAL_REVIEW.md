# Visual review

The reference sets the order and scale of the public header, split hero, three-step journey and previews. The new passport illustration was inspected separately. It shows a deep purple cover, embossed lettering, an open assessment page, two stamps and a skyline. The page uses live Angular content for its headline, actions, navigation, disclosures, journey and previews.

Final browser fidelity could not be verified. Local Chromium failed at startup when opening its process-singleton socket. A separate cloud browser could not reach the workspace preview server. No new screenshots were captured. The existing review directory contains earlier Skill Passport material.

On a browser-capable development machine, run npm run test:e2e -- tests/landing-reference.e2e.ts. The test checks 1536, 1440, 768 and 390 pixel widths and saves the desktop, mobile and dark screenshots to screenshots/.
