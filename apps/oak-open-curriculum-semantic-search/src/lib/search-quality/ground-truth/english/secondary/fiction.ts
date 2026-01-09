/**
 * Secondary English ground truth queries for fiction reading.
 *
 * Covers KS3-4 fiction texts: Sherlock Holmes, Lord of the Flies, Gothic fiction.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Fiction ground truth queries for Secondary English (KS3-4).
 */
export const FICTION_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Sherlock Holmes character analysis',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Sherlock Holmes content using curriculum terminology',
    expectedRelevance: {
      'making-predictions-about-sherlock-holmes': 3,
      'becoming-a-detective-like-sherlock-holmes': 3,
      'comparing-the-victims': 2,
    },
  },
  {
    query: 'Sherlock Holmes mystery writing',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of mystery writing content using curriculum terminology',
    expectedRelevance: {
      'collecting-evidence-in-the-adventure-of-the-speckled-band': 3,
      'solving-the-speckled-band-mystery': 3,
      'solving-the-boscombe-valley-mystery': 2,
    },
  },
  {
    query: 'Lord of the Flies symbolism',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of Lord of the Flies symbolism content using curriculum terminology',
    expectedRelevance: {
      'goldings-use-of-symbolism-in-lord-of-the-flies': 3,
      'allusions-in-lord-of-the-flies': 3,
      'goldings-message-about-human-behaviour': 2,
    },
  },
  {
    query: 'Lord of the Flies human nature',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Lord of the Flies themes content using curriculum terminology',
    expectedRelevance: {
      'goldings-message-about-human-behaviour': 3,
      'an-introduction-to-lord-of-the-flies': 3,
      'jack-as-the-antagonist-in-lord-of-the-flies': 2,
    },
  },
  {
    query: 'Gothic fiction Frankenstein',
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests retrieval of Frankenstein Gothic content using curriculum terminology',
    expectedRelevance: {
      'frankenstein-and-the-gothic-context': 3,
      'frankensteins-reaction-to-his-creation': 3,
      'frankensteins-regret': 2,
      'diving-deeper-into-the-gothic-genre': 2,
    },
  },
  {
    query: 'Gothic literature features',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Gothic genre content using curriculum terminology',
    expectedRelevance: {
      'diving-deeper-into-the-gothic-genre': 3,
      'frankenstein-and-the-gothic-context': 3,
      'gothic-vocabulary-in-jane-eyre': 2,
    },
  },
] as const;
