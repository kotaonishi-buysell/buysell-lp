/*
 * Silver's competitor comparison ("How we compare"), in a file of its own (no imports, so the test can read it).
 */
/**
 * HIDDEN until legal has confirmed the comparison and its sources. The other columns describe how pawn
 * shops, mail-in buyers and estate-sale companies usually work; that text has not been checked against
 * primary sources or reviewed by counsel (docs/design/silver/COMPARISON_SOURCES.md).
 *
 * The design (the section in src/pages/silver.astro, the table in silver.css) is kept. To bring it back:
 *   1. Check every row against the sources in docs/design/silver/COMPARISON_SOURCES.md and get legal's OK.
 *   2. Set `enabled: true` and `legalApproved` to who approved it and when (e.g. "Counsel, 2026-11-20").
 * While the section is hidden, the sections after it are numbered without a gap.
 * tests/silver-comparison.test.mjs refuses `enabled: true` without `legalApproved`.
 */
export const silverComparison: { enabled: boolean; legalApproved: string | null } = {
  enabled: false,
  legalApproved: null,
};
