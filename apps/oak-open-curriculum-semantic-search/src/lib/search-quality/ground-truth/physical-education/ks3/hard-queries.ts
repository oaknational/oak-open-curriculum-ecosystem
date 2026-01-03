/**
 * KS3 Physical Education hard ground truth queries.
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
 * KS3 Physical Education hard queries (misspellings, synonyms, colloquial).
 */
export const PE_KS3_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'PE athletics runing and jumping',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common misspelling of "running".',
    expectedRelevance: {
      'running-for-speed-and-the-relationship-between-distance-and-time': 3,
      'jumping-for-distance': 3,
      'jumping-for-height': 2,
    },
  },
  {
    query: 'teach kids throwing sports',
    category: 'colloquial',
    priority: 'high',
    description: 'Colloquial: "kids" → students, "throwing sports" → field events.',
    expectedRelevance: {
      'shot-put-technique': 3,
      'javelin-technique': 3,
      'officiating-your-own-throwing-challenges': 2,
    },
  },
  {
    query: 'getting fit exercise programme',
    category: 'synonym',
    priority: 'high',
    description: 'Synonym: "getting fit" → fitness, "exercise programme" → training.',
    expectedRelevance: {
      'design-your-programme': 3,
      'the-fitt-frequency-intensity-time-and-type-principle': 2,
      'setting-goals-for-training': 2,
    },
  },
] as const;
