/**
 * KS3 Art identity and expression ground truth queries.
 *
 * Covers personal identity, portraiture, and wellbeing through art.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * KS3 Art identity and expression standard queries.
 */
export const ART_KS3_IDENTITY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'portraiture art lessons',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for portraiture unit.',
    expectedRelevance: {
      'identity-exploring-portraiture': 3,
      'exploring-collage-and-composition-through-portraits': 2,
    },
  },
  {
    query: 'art and wellbeing emotions',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for wellbeing unit.',
    expectedRelevance: {
      'expressing-emotion-through-art': 3,
      'art-as-self-discovery': 3,
      'making-sense-art-and-wellbeing': 2,
    },
  },
  {
    query: 'nature and environment in art',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for nature in art unit.',
    expectedRelevance: {
      'the-presence-of-nature-in-art': 3,
      'art-and-environmental-activism': 3,
      'nature-and-symbolism': 2,
    },
  },
] as const;
