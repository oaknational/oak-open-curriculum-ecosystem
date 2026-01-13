/**
 * Natural-expression ground truth query for Primary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** AI Curation: 2026-01-11 - MRR 0.500, tests DT abbreviation and informal phrasing */
export const DT_PRIMARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'DT making things move',
    expectedRelevance: {
      'cam-mechanisms': 3,
      'card-lever-mechanisms': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Uses DT abbreviation and informal phrasing',
  },
] as const;
