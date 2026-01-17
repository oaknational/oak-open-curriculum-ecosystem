/**
 * Natural-expression ground truth query for Secondary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-15 - Reviewed: confirmed correct. Score=3 slug has "feelings" as keyword, directly about art conveying emotions. */
export const ART_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'feelings in pictures',
    category: 'natural-expression',
    priority: 'high',
    description:
      'Colloquial: "feelings" → emotions, "pictures" → art. Tests natural language bridging for emotion/expression concepts.',
    expectedRelevance: {
      'personal-to-universal-art-as-connection': 3,
      'expressing-emotion-through-art': 2,
    },
  },
] as const;
