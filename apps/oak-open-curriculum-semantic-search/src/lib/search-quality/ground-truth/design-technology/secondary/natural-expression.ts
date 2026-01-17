/**
 * Natural-expression ground truth query for Secondary Design & Technology.
 * @packageDocumentation
 */
import type { GroundTruthQuery } from '../../types';

/** Human Review: 2026-01-17 - Deep review: added material-sustainability which explicitly uses "sustainable" */
export const DT_SECONDARY_NATURAL_EXPRESSION: readonly GroundTruthQuery[] = [
  {
    query: 'green design environment friendly',
    category: 'natural-expression',
    priority: 'high',
    description:
      'Tests vocabulary bridging from "green/environment friendly" to sustainability/LCA concepts',
    expectedRelevance: {
      'life-cycle-assessment': 3,
      'life-cycle-assessment-of-flat-pack-furniture': 3,
      'linear-versus-circular-economy': 3,
      'material-sustainability': 2,
      'the-environmental-impact-of-materials': 2,
    },
  },
] as const;
