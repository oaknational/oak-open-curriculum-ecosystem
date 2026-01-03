/**
 * KS3 Design & Technology hard ground truth queries.
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
 * KS3 Design & Technology hard queries (misspellings, synonyms, colloquial).
 */
export const DT_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'platics and polymers materials',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common misspelling of "plastics".',
    expectedRelevance: {
      'polymers-properties-sources-and-stock-forms': 3,
      'physical-properties-of-materials': 2,
    },
  },
  {
    query: 'making stuff from wood',
    category: 'colloquial',
    priority: 'high',
    description: 'Colloquial: "stuff" → products, "wood" → timbers.',
    expectedRelevance: {
      'timbers-properties-sources-and-stock-forms': 3,
      'batch-assembly': 2,
    },
  },
  {
    query: 'green design environment friendly',
    category: 'synonym',
    priority: 'high',
    description: 'Synonym: "green" + "environment friendly" → sustainable.',
    expectedRelevance: {
      'linear-versus-circular-economy': 3,
      'life-cycle-assessment': 2,
      'sustainable-fabrics-for-wearable-technology': 2,
    },
  },
] as const;
