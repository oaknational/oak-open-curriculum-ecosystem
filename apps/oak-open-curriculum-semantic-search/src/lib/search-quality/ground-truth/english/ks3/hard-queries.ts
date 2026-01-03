/**
 * Hard ground truth queries for KS3 English search.
 *
 * Tests the search system with challenging scenarios for Year 7-9 content.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Hard ground truth queries for KS3 English.
 */
export const HARD_QUERIES_KS3_ENGLISH: readonly GroundTruthQuery[] = [
  // NATURALISTIC
  {
    query: 'teach students about gothic literature year 8',
    category: 'naturalistic',
    priority: 'high',
    description: 'Teacher request with year group specification.',
    expectedRelevance: {
      'diving-deeper-into-the-gothic-genre': 3,
      'frankenstein-and-the-gothic-context': 3,
      'gothic-vocabulary-in-jane-eyre': 2,
    },
  },

  // MISSPELLING
  {
    query: 'frankenstien monster creation',
    category: 'misspelling',
    priority: 'critical',
    description: 'Common Frankenstein misspelling.',
    expectedRelevance: {
      'frankensteins-reaction-to-his-creation': 3,
      'frankenstein-and-the-gothic-context': 3,
      'frankensteins-regret': 2,
    },
  },

  // SYNONYM
  {
    query: 'detective stories mystery solving',
    category: 'synonym',
    priority: 'high',
    description: 'Detective = Sherlock Holmes style. Tests vocabulary bridging.',
    expectedRelevance: {
      'becoming-a-detective-like-sherlock-holmes': 3,
      'solving-the-speckled-band-mystery': 3,
      'solving-the-boscombe-valley-mystery': 2,
    },
  },

  // COLLOQUIAL
  {
    query: 'the shakespeare play about the island',
    category: 'colloquial',
    priority: 'medium',
    description: 'Informal reference to The Tempest.',
    expectedRelevance: {
      'consolidating-our-understanding-of-the-plot-of-the-tempest': 3,
      'prosperos-power-over-caliban': 2,
      'caliban-as-an-outsider': 2,
    },
  },
] as const;
