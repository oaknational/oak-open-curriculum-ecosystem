/**
 * KS3 Art movements and techniques ground truth queries.
 *
 * Covers art history, movements, and practical techniques.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * KS3 Art movements and techniques standard queries.
 */
export const ART_KS3_MOVEMENTS_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'art movements history',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for art movements unit.',
    expectedRelevance: {
      'iconic-images-from-art-movements': 3,
      'art-movements-disciplines-and-multidisciplinary-artists': 3,
      'art-in-response-to-events': 2,
    },
  },
  {
    query: 'abstract painting techniques',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for abstract painting.',
    expectedRelevance: {
      'abstract-art-painting-using-different-stimuli': 3,
      'abstract-art-dry-materials-in-response-to-stimuli': 3,
      'abstract-marks-respond-to-stimuli-by-painting': 2,
    },
  },
  {
    query: 'collage and assemblage art',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for collage unit.',
    expectedRelevance: {
      'creating-and-refining-an-abstract-collage': 3,
      'exploring-collage-and-composition-through-portraits': 3,
      'exploring-memory-through-the-world-of-assemblage': 2,
    },
  },
] as const;
