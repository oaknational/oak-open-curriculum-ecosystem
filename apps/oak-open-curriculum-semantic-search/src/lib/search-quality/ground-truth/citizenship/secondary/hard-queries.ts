/**
 * SECONDARY Citizenship hard ground truth queries.
 *
 * Tests challenging scenarios: misspellings, synonyms, and colloquial terms.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * SECONDARY Citizenship hard queries (misspellings, synonyms, colloquial).
 */
export const CITIZENSHIP_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'goverment parliament how UK works',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common misspelling of "government".',
    expectedRelevance: {
      'how-is-the-uk-governed': 3,
      'how-is-local-government-different-to-central-government': 2,
    },
  },
  {
    query: 'being fair to everyone rights',
    category: 'synonym',
    priority: 'high',
    description: 'Colloquial: "being fair" → equality, "rights" → legal protections.',
    expectedRelevance: {
      'what-does-fairness-mean-in-society': 3,
      'why-do-we-need-laws-on-equality-in-the-uk': 2,
      'what-can-we-do-to-create-a-fairer-society': 2,
    },
  },
] as const;
