/**
 * Secondary English ground truth queries for modern texts.
 *
 * Covers GCSE set texts: An Inspector Calls, Animal Farm.
 *
 * **Methodology (2026-01-08)**:
 * All lesson slugs verified against bulk-downloads/english-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Modern text ground truth queries for Secondary English (KS4).
 *
 * Focus: An Inspector Calls — themes, characters, context.
 */
export const MODERN_TEXTS_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'An Inspector Calls Mrs Birling gender class analysis',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of An Inspector Calls gender and class content using curriculum terminology',
    expectedRelevance: {
      'understanding-gender-and-class-through-mrs-birling-in-an-inspector-calls': 3,
      'sheila-and-changing-attitudes-toward-gender-and-class-in-an-inspector-calls': 3,
      'contextualising-gender-expectations-in-an-inspector-calls': 2,
    },
  },
  {
    query: 'An Inspector Calls social responsibility punishment justice',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of An Inspector Calls responsibility themes content using curriculum terminology',
    expectedRelevance: {
      'exploring-how-priestley-portrays-punishment-and-justice-in-an-inspector-calls': 3,
      'an-inspector-calls-writing-an-essay-on-punishment-justice-and-the-inspector': 3,
      'religion-sin-morality-and-punishment-in-an-inspector-calls': 2,
    },
  },
  {
    query: 'An Inspector Calls the inspector supernatural archetype',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of Inspector character analysis content using curriculum terminology',
    expectedRelevance: {
      'the-inspector-as-a-supernatural-figure-in-an-inspector-calls': 3,
      'exploring-the-inspector-as-an-archetype-in-an-inspector-calls': 3,
      'developing-nuanced-analysis-of-an-inspector-calls': 2,
    },
  },
  {
    query: 'An Inspector Calls Eva Smith representation symbolism',
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests retrieval of Eva Smith symbolism content using curriculum terminology',
    expectedRelevance: {
      'eva-smith-in-an-inspector-calls-representation-and-symbolism': 3,
      'exploring-the-presentation-of-crime-an-inspector-calls': 2,
    },
  },
  {
    query: 'An Inspector Calls essay writing quotations context',
    category: 'precise-topic',
    priority: 'high',
    description:
      'Tests retrieval of An Inspector Calls essay writing content using curriculum terminology',
    expectedRelevance: {
      'using-quotations-and-context-effectively-in-an-an-inspector-calls-essay': 3,
      'planning-an-essay-on-societal-expectations-in-an-inspector-calls': 3,
      'developing-nuanced-analysis-of-an-inspector-calls': 2,
    },
  },
] as const;
