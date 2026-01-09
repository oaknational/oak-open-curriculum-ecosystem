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
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Roman Britain content using curriculum terminology',
    expectedRelevance: {
      'the-roman-invasion-of-britain': 3,
      'the-buildings-of-roman-britain': 3,
      'towns-in-roman-britain': 2,
      'the-changes-to-life-brought-about-by-roman-settlement': 2,
    },
  },
  {
    query: 'Boudica rebellion against Romans',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Boudica content using curriculum terminology',
    expectedRelevance: {
      'boudicas-rebellion-against-roman-rule': 3,
      'the-roman-invasion-of-britain': 2,
    },
  },
  {
    query: 'Vikings raids Britain',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Viking raids content using curriculum terminology',
    expectedRelevance: {
      'early-viking-raids': 3,
      'why-the-vikings-came-to-britain': 3,
      'the-great-heathen-army': 2,
      'seafaring-vikings': 2,
    },
  },
  {
    query: 'Alfred the Great',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Alfred the Great content using curriculum terminology',
    expectedRelevance: {
      'aethelred-alfred-the-great-and-wessex': 3,
      'the-anglo-saxon-fightback': 2,
    },
  },
  {
    query: 'learning about viking life',
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for Viking society lessons.',
    expectedRelevance: {
      'yorks-importance-to-the-vikings': 3,
      'a-journey-through-viking-york-houses-halls-and-craftspeople': 2,
    },
  },
  {
    query: 'Vikings and trade in York',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of Viking history with economic/trade topics.',
    expectedRelevance: {
      'a-journey-through-viking-york-merchants-and-traders': 3,
      'how-we-know-so-much-about-viking-york': 2,
    },
  },
] as const;
