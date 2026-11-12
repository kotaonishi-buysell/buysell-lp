/*
 * How a sale goes, the same on every LP. (This replaces the old "paid next day" payment promise.)
 *
 * We visit to APPRAISE. Nothing is bought at the customer's home: Texas treats a purchase at a temporary
 * location as something that may need a notice before each visit (Occupations Code 1956.067), so the visit is
 * an appraisal only. We tell the customer the appraised amount at the visit. If the customer decides to sell,
 * we collect the items the next day, or the customer sends them to us. Payment is by bank transfer; no time
 * is promised for it (the business decided not to state one).
 *
 * Counsel should confirm this reading of 1956.067 before launch (docs/design/legal/RESEARCH.md).
 */
export const purchaseFlow = {
  /** What happens at the visit. */
  atVisit: 'We tell you the appraised amount at your home. Nothing is bought at the visit.',
  /** What happens if the customer decides to sell. */
  afterYes: 'If you decide to sell, we collect your items the next day, or you can send them to us. Payment is by bank transfer.',
  /** Both together, for an FAQ answer. */
  full:
    'We tell you the appraised amount at your home. Nothing is bought at the visit. If you decide to sell, we collect your items the next day, or you can send them to us. Payment is by bank transfer.',
};
