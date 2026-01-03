/**
 * KS3 Computing data and systems ground truth queries.
 *
 * Covers computer networks, data representation, web development, and cybersecurity.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * KS3 Computing data and systems standard queries.
 */
export const COMPUTING_KS3_DATA_SYSTEMS_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'computer networks internet',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for networks topic.',
    expectedRelevance: {
      'an-introduction-to-computer-networks': 3,
      'the-internet': 3,
      'wired-and-wireless-networks': 2,
    },
  },
  {
    query: 'binary numbers computing',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for binary representation.',
    expectedRelevance: {
      'numbers-in-binary': 3,
      'binary-digits': 3,
      'representing-information': 2,
    },
  },
  {
    query: 'cybersecurity lessons',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for cybersecurity unit.',
    expectedRelevance: {
      'introduction-to-cybersecurity': 3,
    },
  },
] as const;
