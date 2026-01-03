/**
 * KS3 English ground truth queries for fiction reading.
 *
 * Covers Year 7-9 fiction texts: Sherlock Holmes, Lord of the Flies, Gothic fiction.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Fiction ground truth queries for KS3 English.
 */
export const FICTION_KS3_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Sherlock Holmes character analysis',
    expectedRelevance: {
      'making-predictions-about-sherlock-holmes': 3,
      'becoming-a-detective-like-sherlock-holmes': 3,
      'comparing-the-victims': 2,
    },
  },
  {
    query: 'Sherlock Holmes mystery writing',
    expectedRelevance: {
      'collecting-evidence-in-the-adventure-of-the-speckled-band': 3,
      'solving-the-speckled-band-mystery': 3,
      'solving-the-boscombe-valley-mystery': 2,
    },
  },
  {
    query: 'Lord of the Flies symbolism',
    expectedRelevance: {
      'goldings-use-of-symbolism-in-lord-of-the-flies': 3,
      'allusions-in-lord-of-the-flies': 3,
      'goldings-message-about-human-behaviour': 2,
    },
  },
  {
    query: 'Lord of the Flies human nature',
    expectedRelevance: {
      'goldings-message-about-human-behaviour': 3,
      'an-introduction-to-lord-of-the-flies': 3,
      'jack-as-the-antagonist-in-lord-of-the-flies': 2,
    },
  },
  {
    query: 'Gothic fiction Frankenstein',
    expectedRelevance: {
      'frankenstein-and-the-gothic-context': 3,
      'frankensteins-reaction-to-his-creation': 3,
      'frankensteins-regret': 2,
      'diving-deeper-into-the-gothic-genre': 2,
    },
  },
  {
    query: 'Gothic literature features',
    expectedRelevance: {
      'diving-deeper-into-the-gothic-genre': 3,
      'frankenstein-and-the-gothic-context': 3,
      'gothic-vocabulary-in-jane-eyre': 2,
    },
  },
] as const;
