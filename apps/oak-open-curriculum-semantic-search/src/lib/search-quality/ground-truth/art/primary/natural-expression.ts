/**
 * Natural-expression ground truth query for Primary Art.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/**
 * AI Curation: 2026-01-14
 * Fixed: Replaced profile-portraits-in-art (about identifying) with
 * analyse-a-facial-expression-through-drawing (about drawing faces).
 * Query "how to draw faces" should match lessons about DRAWING, not identifying.
 */
export const ART_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'how to draw faces',
    expectedRelevance: {
      'draw-a-profile-portrait': 3,
      'analyse-a-facial-expression-through-drawing': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description:
      'Informal "how to" phrasing for portrait drawing. Tests vocabulary bridging: "faces" → portraits/facial expressions.',
  },
] as const;
