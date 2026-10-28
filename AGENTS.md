# Repository instructions

## Read before frontend work
- Read README.md and docs/design/README.md to identify the target LP.
- For /downsizing, read docs/design/downsizing/DESIGN_SYSTEM.md.
- For /home-value, read docs/design/home-value/DESIGN_SYSTEM.md.
- For changes affecting multiple LPs, read each affected LP's design system.
- For home-value, also read src/content/lps/home-value/README.md.
- For home-value business requirements and behavior, read docs/requirements/home-value.en.md. Its confirmed facts and seven-section sequence supersede earlier draft copy.
- For /silver, read docs/design/silver/DESIGN_SYSTEM.md. Silver loads silver.css only through SilverLayout; never import silver.css or base.css into the other LPs.
- Preserve the existing Astro application, /downsizing route, and / redirect.
- Apply Friendly Discovery styling only to home-value unless migration is explicitly requested.
- Keep legacy tokens.css, base.css and existing LP content unchanged for this addition.
- Reuse components where appropriate; keep page copy in src/content. All LPs share one contact form (src/components/ContactForm.astro, src/lib/contact-form.ts, src/content/contact-form.ts, docs/forms/contact-form.md). Change its fields, validation, delivery or endpoint in the shared files, and give each LP only a skin and its own panel, heading and button. The shared form has no analytics; each LP listens to its `cf:event` events. The service-area ZIP box is also shared (src/components/ZipCheck.astro; the ZIP prefixes live in site.serviceArea.zipPrefixes); it is not the contact form and sends nothing. Delivery has three modes set by env vars (see docs/forms/contact-form.md): Netlify Forms (default on Netlify; the form markup carries data-netlify and the browser posts to its own page), the email function (src/server/contact.ts, served by netlify/functions/contact.ts) or preview. Host: Netlify, settings in netlify.toml; keep secrets in the Netlify dashboard, never in the repo. Home Value must not load the legacy analytics.
- Never introduce a nested repository, a second package manifest or a new framework for an LP.

## Design and content
- Each LP's own DESIGN_SYSTEM.md is its design source of truth; there is no universal visual design system.
- Do not apply one LP's colors, typography, imagery, radii or layout rules to another LP.
- Add docs/design/<slug>/DESIGN_SYSTEM.md and register it in docs/design/README.md for every new LP.
- Shared components and form/analytics code may be reused. Scope visual changes to the target LP; verify both LPs if shared CSS or markup changes.
- Scope new CSS to body[data-lp="home-value"] in src/styles/home-value.css.
- Keep legacy business facts in src/content/site.ts and Home Value configuration in src/content/lps/home-value/config.ts. Do not change legacy facts when updating Home Value.
- Do not invent fees, service areas, accepted items, phone numbers or customer testimonials. Missing Home Value integrations must use explicit preview states, not visible legacy TODO copy.
- Payment rule, the same on every LP: the amount is told at the visit; if the customer agrees to sell, we pay by bank transfer by the end of the next calendar day. Never claim same-day payment or payment "before we leave". Never say we take no photos or share nothing: Texas dealer rules require ID and item records.
- Privacy Policy, Terms and Do Not Sell or Share are one set of pages for every LP (src/content/legal.ts; docs/design/legal/DESIGN_SYSTEM.md). Link to them through site.links; do not write a separate policy per LP. Keep their text true to what the code does (data collected, no sale/sharing, analytics); if a change adds a tracker, a vendor or a new use of personal data, update legal.ts in the same change. They load no LP stylesheet and no analytics.
- Mark unconfirmed business facts using the existing {{TODO: ...}} convention.
- Consultation examples are hypothetical situations, not reviews.
- Use owned/licensed assets; do not copy Pestie assets or layouts.
- Keep mobile layouts, keyboard access, visible focus and readable contrast.

## Verify
- Run npm run check, npm run build and npm run todos.
- Run npm test for changes to the contact form, its validation or delivery behavior.
- Confirm both /downsizing and /home-value are generated and / still redirects to /downsizing.
- With no receiving endpoint configured (the default), the shared form validates locally, sends nothing, and must never report live receipt or emit a submit measurement event.
- After changing the shared form, verify both /downsizing and /home-value in the browser.
- Do not deploy or merge as part of scaffolding.
