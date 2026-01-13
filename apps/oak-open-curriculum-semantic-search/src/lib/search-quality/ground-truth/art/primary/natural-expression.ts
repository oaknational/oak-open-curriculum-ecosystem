/**
 * Natural-expression ground truth query for Primary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - Perfect MRR (1.000) */
export const ART_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'how to draw faces',
    expectedRelevance: {
      'draw-a-profile-portrait': 3,
      'profile-portraits-in-art': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Question format for portrait drawing - tests informal phrasing',
  },
] as const;
