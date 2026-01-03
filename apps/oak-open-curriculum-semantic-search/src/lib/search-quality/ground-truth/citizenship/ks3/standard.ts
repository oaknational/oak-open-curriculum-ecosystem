/**
 * KS3 Citizenship standard ground truth queries.
 *
 * Covers democracy, rights, community, law, and active citizenship.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified against Oak API via MCP tools:
 * - `get-key-stages-subject-lessons` for lesson slugs
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * KS3 Citizenship standard queries.
 */
export const CITIZENSHIP_KS3_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'democracy voting elections UK',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for democracy units.',
    expectedRelevance: {
      'why-is-registering-to-vote-so-important': 3,
      'how-do-local-elections-work': 3,
      'what-is-a-democratic-community': 2,
    },
  },
  {
    query: 'equality discrimination Equality Act',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for equality unit.',
    expectedRelevance: {
      'what-is-the-equality-act-2010': 3,
      'what-is-discrimination-and-prejudice': 3,
      'why-do-we-need-laws-on-equality-in-the-uk': 2,
    },
  },
  {
    query: 'active citizenship community',
    category: 'naturalistic',
    priority: 'high',
    description: 'Direct curriculum term match for active citizenship.',
    expectedRelevance: {
      'how-can-we-be-active-citizens': 3,
      'what-do-we-need-to-become-active-citizens-in-our-community': 3,
      'how-can-citizens-get-involved-in-community-change': 2,
    },
  },
  {
    query: 'managing money finances',
    category: 'naturalistic',
    priority: 'medium',
    description: 'Direct curriculum term match for financial literacy.',
    expectedRelevance: {
      'what-is-the-best-way-to-look-after-money': 3,
      'where-can-we-save-money': 3,
      'what-are-the-implications-of-borrowing-money': 2,
    },
  },
] as const;
