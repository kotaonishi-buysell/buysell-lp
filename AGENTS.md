# Repository instructions

## Read before frontend work
- Read README.md and docs/design/README.md to identify the target LP.
- For /downsizing, read docs/design/downsizing/DESIGN_SYSTEM.md.
- For /home-value, read docs/design/home-value/DESIGN_SYSTEM.md.
- For changes affecting multiple LPs, read each affected LP's design system.
- For home-value, also read src/content/lps/home-value/README.md.
- For home-value business requirements and behavior, read docs/requirements/home-value.en.md. Its confirmed facts and seven-section sequence supersede earlier draft copy.
- Preserve the existing Astro application, /downsizing route, and / redirect.
- Apply Friendly Discovery styling only to home-value unless migration is explicitly requested.
- Keep legacy tokens.css, base.css and existing LP content unchanged for this addition.
- Reuse components where appropriate; keep page copy in src/content. Home Value has its own request behavior and must not load the legacy submit stub or analytics.
- Never introduce a nested repository, a second package manifest or a new framework for an LP.

## Design and content
- Each LP's own DESIGN_SYSTEM.md is its design source of truth; there is no universal visual design system.
- Do not apply one LP's colors, typography, imagery, radii or layout rules to another LP.
- Add docs/design/<slug>/DESIGN_SYSTEM.md and register it in docs/design/README.md for every new LP.
- Shared components and form/analytics code may be reused. Scope visual changes to the target LP; verify both LPs if shared CSS or markup changes.
- Scope new CSS to body[data-lp="home-value"] in src/styles/home-value.css.
- Keep legacy business facts in src/content/site.ts and Home Value configuration in src/content/lps/home-value/config.ts. Do not change legacy facts when updating Home Value.
- Do not invent fees, service areas, accepted items, phone numbers or customer testimonials. Missing Home Value integrations must use explicit preview states, not visible legacy TODO copy.
- Mark unconfirmed business facts using the existing {{TODO: ...}} convention.
- Consultation examples are hypothetical situations, not reviews.
- Use owned/licensed assets; do not copy Pestie assets or layouts.
- Keep mobile layouts, keyboard access, visible focus and readable contrast.

## Verify
- Run npm run check, npm run build and npm run todos.
- Run npm run test:home-value for changes to its form, contact or delivery behavior.
- Confirm both /downsizing and /home-value are generated and / still redirects to /downsizing.
- The legacy form is a stub. Home Value validates locally when no receiving endpoint is configured and must never report live receipt in that mode.
- Do not deploy or merge as part of scaffolding.
