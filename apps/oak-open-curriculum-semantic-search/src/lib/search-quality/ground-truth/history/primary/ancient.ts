/**
 * Primary History ground truth queries for Ancient history.
 *
 * Covers Romans, Vikings, Anglo-Saxons.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Ancient history ground truth queries for Primary.
 */
export const ANCIENT_PRIMARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Romans in Britain',
    expectedRelevance: {
      'the-roman-invasion-of-britain': 3,
      'the-buildings-of-roman-britain': 3,
      'towns-in-roman-britain': 2,
      'the-changes-to-life-brought-about-by-roman-settlement': 2,
    },
  },
  {
    query: 'Boudica rebellion',
    expectedRelevance: {
      'boudicas-rebellion-against-roman-rule': 3,
      'the-roman-invasion-of-britain': 2,
    },
  },
  {
    query: 'Vikings raids Britain',
    expectedRelevance: {
      'early-viking-raids': 3,
      'why-the-vikings-came-to-britain': 3,
      'the-great-heathen-army': 2,
      'seafaring-vikings': 2,
    },
  },
  {
    query: 'Alfred the Great',
    expectedRelevance: {
      'aethelred-alfred-the-great-and-wessex': 3,
      'the-anglo-saxon-fightback': 2,
    },
  },
] as const;
