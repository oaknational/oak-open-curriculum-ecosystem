/**
 * SECONDARY History ground truth queries for Medieval history.
 *
 * Covers Year 7 medieval topics: Norman Conquest, Crusades, Black Death.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Medieval history ground truth queries for SECONDARY.
 */
export const MEDIEVAL_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Norman Conquest 1066',
    expectedRelevance: {
      '1066-and-claims-to-the-throne': 3,
      'the-battle-of-hastings-1066': 2,
      'the-impact-of-the-norman-conquest-on-england': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Norman Conquest content using curriculum terminology',
  },
  {
    query: 'Battle of Hastings',
    expectedRelevance: {
      'the-battle-of-hastings-1066': 3,
      '1066-and-claims-to-the-throne': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Battle of Hastings content using curriculum terminology',
  },
  {
    query: 'Norman changes England',
    expectedRelevance: {
      'norman-changes-to-english-land-tenure': 3,
      'norman-changes-to-the-english-landscape': 2,
      'norman-reforms-to-the-english-church': 2,
      'the-impact-of-the-norman-conquest-on-england': 1,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Norman impact content using curriculum terminology',
  },
] as const;
