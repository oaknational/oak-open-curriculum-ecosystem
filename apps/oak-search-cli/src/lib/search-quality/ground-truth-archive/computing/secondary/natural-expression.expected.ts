/**
 * Expected relevance for natural-expression ground truth.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant
 * - 2 = Relevant
 * - 1 = Marginal
 *
 * Query: "fake emails, scams, social engineering"
 * Vocabulary bridging: "fake emails" → phishing, "scams" → social engineering
 */

import type { ExpectedRelevance } from '../../types';

export const COMPUTING_SECONDARY_NATURAL_EXPRESSION_EXPECTED: ExpectedRelevance = {
  // Year 9: teaches phishing, blagging, name generator attacks
  'social-engineering': 3,
  // Year 11: teaches phishing, pharming, blagging techniques
  'social-engineering-techniques': 3,
  // Year 10: covers phishing, malware (more general overview)
  'being-safe-online': 2,
} as const;
