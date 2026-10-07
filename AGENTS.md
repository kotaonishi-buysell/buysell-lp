# Repository instructions

## Read before frontend work
- Read DESIGN_SYSTEM.md and README.md.
- For home-value, also read src/content/lps/home-value/README.md.
- Preserve the existing Astro application, /downsizing route, and / redirect.
- Apply Friendly Discovery styling only to home-value unless migration is explicitly requested.
- Keep legacy tokens.css, base.css and existing LP content unchanged for this addition.
- Reuse existing components, form behavior and analytics; keep page copy in src/content.
- Never introduce a nested repository, a second package manifest or a new framework for an LP.

## Design and content
- DESIGN_SYSTEM.md is the design source of truth within its stated scope.
- Scope new CSS to body[data-lp="home-value"] in src/styles/home-value.css.
- Keep actual business facts in src/content/site.ts. Do not invent fees, service areas, accepted items, phone numbers or customer testimonials.
- Mark unconfirmed business facts using the existing {{TODO: ...}} convention.
- Consultation examples are hypothetical situations, not reviews.
- Use owned/licensed assets; do not copy Pestie assets or layouts.
- Keep mobile layouts, keyboard access, visible focus and readable contrast.

## Verify
- Run npm run check, npm run build and npm run todos.
- Confirm both /downsizing and /home-value are generated and / still redirects to /downsizing.
- The form is an existing stub; a successful demo is not delivery to a real endpoint.
- Do not deploy or merge as part of scaffolding.
