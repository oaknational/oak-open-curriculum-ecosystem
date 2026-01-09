/**
 * SECONDARY Computing data and systems ground truth queries.
 *
 * Covers computer networks, data representation, web development, and cybersecurity.
 *
 * **Methodology (2026-01-08)**:
 * All lesson slugs verified against bulk-downloads/computing-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * SECONDARY Computing data and systems standard queries.
 */
export const COMPUTING_SECONDARY_DATA_SYSTEMS_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'computer networks internet wired wireless connections',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for networks topic.',
    expectedRelevance: {
      'an-introduction-to-computer-networks': 3,
      'the-internet': 3,
      'wired-and-wireless-networks': 2,
    },
  },
  {
    query: 'binary numbers digits computing representation',
    category: 'precise-topic',
    priority: 'high',
    description: 'Direct curriculum term match for binary representation.',
    expectedRelevance: {
      'numbers-in-binary': 3,
      'binary-digits': 3,
      'representing-information': 2,
    },
  },
  {
    query: 'cybersecurity lessons threats attacks prevention careers',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Direct curriculum term match for cybersecurity unit.',
    expectedRelevance: {
      'careers-in-cyber-security': 3,
      'preventing-cyber-attacks': 3,
      'the-cost-of-cyber-crime-and-hacker-motivation': 2,
    },
  },
] as const;
