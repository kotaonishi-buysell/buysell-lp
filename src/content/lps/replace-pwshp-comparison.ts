/*
 * The "How we compare" section of /replace-pwshp, in a file of its own (no imports, so the test can read it).
 */
/**
 * HIDDEN until legal and the ad review have approved a comparison with consignment and in-store selling
 * (docs/lp-house-call-spec.md, open question 4). The section and its table are built (src/pages/replace-pwshp.astro,
 * replace-pwshp.css) but the cells are empty and the whole section is left out of the page.
 *
 * To bring it back:
 *   1. Decide the value of each cell and check it against sources (see docs/design/silver/COMPARISON_SOURCES.md).
 *      Do not name any other company, and do not disparage anyone.
 *   2. Fill the cells in the page, set `enabled: true` and `legalApproved` to who approved it and when
 *      (e.g. "Counsel, 2026-12-01").
 * While the section is hidden, the sections after it are numbered without a gap.
 * tests/comparison-approval.test.mjs refuses `enabled: true` without `legalApproved`.
 */
export const replacePwshpComparison: { enabled: boolean; legalApproved: string | null } = {
  enabled: false,
  legalApproved: null,
};
