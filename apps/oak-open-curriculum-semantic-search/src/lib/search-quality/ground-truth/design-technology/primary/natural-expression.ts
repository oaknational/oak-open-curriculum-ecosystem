/**
 * Natural-expression ground truth query for Primary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** Human Review: 2026-01-17 - Deep review: expanded to include rotary-motion and upgraded slider to score=3 */
export const DT_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'DT making things move',
    expectedRelevance: {
      'card-lever-mechanisms': 3,
      'card-slider-mechanisms': 3,
      'make-things-move-with-air': 3,
      'rotary-motion': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Tests informal phrasing "making things move" bridging to mechanisms vocabulary',
  },
] as const;
