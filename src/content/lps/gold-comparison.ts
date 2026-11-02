/*
 * Gold's comparison with pawn or gold shops and mail-in buyers, in a file of its own (no imports, so the test can read it).
 */
/**
 * HIDDEN until U.S. counsel has reviewed the comparison wording: the left column describes how other kinds of
 * businesses usually work, and nobody has checked that against sources or had counsel look at it.
 *
 * The design (section #cmp in src/pages/gold.astro, the tabs in src/scripts/gold.ts) is kept. To bring it back:
 *   1. Have counsel review every row, and check the claims about other businesses against sources.
 *   2. Set `enabled: true` and `legalApproved` to who approved it and when (e.g. "Counsel, 2026-11-20").
 * tests/comparison-approval.test.mjs refuses `enabled: true` without `legalApproved`.
 */
export const goldComparison: { enabled: boolean; legalApproved: string | null } = {
  enabled: false,
  legalApproved: null,
};
