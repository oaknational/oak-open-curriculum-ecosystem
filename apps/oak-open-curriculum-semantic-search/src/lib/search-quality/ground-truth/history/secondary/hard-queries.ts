/**
 * Hard ground truth queries for SECONDARY History search.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for SECONDARY History.
 */
export const HARD_QUERIES_SECONDARY_HISTORY: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach year 7 about the Norman invasion',
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher request with year group.',
    expectedRelevance: {
      'the-battle-of-hastings-1066': 3,
      '1066-and-claims-to-the-throne': 3,
      'the-impact-of-the-norman-conquest-on-england': 2,
    },
  },

  // MISSPELLING
  {
    query: 'holocost and nazi germany',
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Common Holocaust misspelling.',
    expectedRelevance: {
      'the-holocaust-in-context': 3,
      'nazi-persecution-of-jewish-people': 3,
      'ghettos-and-the-final-solution': 2,
    },
  },

  // SYNONYM
  {
    query: 'factory age workers conditions',
    category: 'natural-expression',
    priority: 'high',
    description: 'Factory age = Industrial Revolution.',
    expectedRelevance: {
      'the-industrial-revolution-and-change-in-britain': 3,
      'the-industrial-revolution-and-urban-migration': 3,
      'inventions-of-the-industrial-revolution': 2,
    },
  },

  // CROSS-TOPIC
  {
    query: 'war and society together',
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of conflict with social history.',
    expectedRelevance: {
      'the-holocaust-in-context': 3,
      'the-impact-of-the-norman-conquest-on-england': 2,
    },
  },

  // PEDAGOGICAL-INTENT
  {
    query: 'starter activity to hook year 8',
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for engaging lesson opener.',
    expectedRelevance: {
      'the-battle-of-hastings-1066': 3,
      'the-industrial-revolution-and-change-in-britain': 2,
    },
  },
] as const;
