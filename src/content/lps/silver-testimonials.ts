/*
 * Silver's customer testimonials, in a file of their own (no imports, so the test can read it).
 */
/**
 * Customer testimonials ("A few words from the kitchen table"). HIDDEN: no verified customer reviews yet.
 *
 * The design (src/pages/silver.astro, .voices in silver.css) is kept. To bring the section back:
 *   1. Replace `items` with real reviews. Each needs the customer's permission and a `source`
 *      (where it was collected, e.g. "Google review, 2026-11-02" or "Email, permission on file").
 *   2. Set `enabled: true`.
 * tests/silver-testimonials.test.mjs refuses `enabled: true` while any item has no source, and
 * while the sample reviews below are still here.
 */
export interface Testimonial {
  rating: string;
  quote: string;
  /** Initials and last initial are enough, e.g. "L.M." */
  name: string;
  place: string;
  /** What they sold, e.g. "Sterling flatware". */
  item: string;
  /** Where it came from and that we may publish it. null = not verified. */
  source: string | null;
}

export const silverTestimonials: { enabled: boolean; heading: string; items: Testimonial[] } = {
  enabled: false,
  heading: 'A few words from the kitchen table.',
  // SAMPLE copy that kept the layout in the mock-up. These are not real reviews: never publish them.
  items: [
    { rating: '5.0', quote: 'The appraisal was calm and straightforward. Every piece was weighed in front of me, and I never felt pressured.', name: 'L.M.', place: 'Plano, TX', item: 'Sterling flatware', source: null },
    { rating: '5.0', quote: 'Having the visit at home made everything easier. The appraiser explained what was silver and what was plated.', name: 'D.R.', place: 'Austin, TX', item: 'Tea service', source: null },
    { rating: '5.0', quote: 'I appreciated being able to ask questions and take my time before deciding.', name: 'C.B.', place: 'Houston, TX', item: 'Silver coins & jewelry', source: null },
  ],
};
