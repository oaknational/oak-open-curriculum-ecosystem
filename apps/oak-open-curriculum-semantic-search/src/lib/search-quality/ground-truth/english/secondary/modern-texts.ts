/**
 * Secondary English ground truth queries for modern texts.
 *
 * Covers GCSE set texts: An Inspector Calls, Animal Farm.
 *
 * **Methodology (2026-01-03)**:
 * All lesson slugs verified via Oak Curriculum MCP tools.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Modern text ground truth queries for Secondary English (KS4).
 *
 * Focus: An Inspector Calls, Animal Farm — themes, characters, context.
 */
export const MODERN_TEXTS_SECONDARY_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'An Inspector Calls Mr Birling character',
    expectedRelevance: {
      'an-inspector-calls-exploring-the-character-of-mr-birling': 3,
      'an-inspector-calls-exploring-class-and-power-in-a-model-essay': 2,
      'an-inspector-calls-exploring-class-and-power-through-gerald-and-eva': 2,
    },
  },
  {
    query: 'An Inspector Calls social responsibility',
    expectedRelevance: {
      'an-inspector-calls-exploring-class-and-power-in-a-model-essay': 3,
      'an-inspector-calls-exploring-priestleys-use-of-structure': 3,
      'an-inspector-calls-annotating-essay-questions-and-writing-a-thesis-statement': 2,
    },
  },
  {
    query: 'An Inspector Calls Eric character analysis',
    expectedRelevance: {
      'an-inspector-calls-exploring-the-character-of-eric': 3,
      'an-inspector-calls-exploring-class-and-power-through-gerald-and-eva': 2,
    },
  },
  {
    query: 'An Inspector Calls Mrs Birling',
    expectedRelevance: {
      'an-inspector-calls-exploring-the-character-of-mrs-birling': 3,
      'an-inspector-calls-exploring-class-and-power-in-a-model-essay': 2,
    },
  },
  {
    query: 'An Inspector Calls essay writing',
    expectedRelevance: {
      'an-inspector-calls-annotating-essay-questions-and-writing-a-thesis-statement': 3,
      'an-inspector-calls-exploring-class-and-power-in-a-model-essay': 3,
      'an-inspector-calls-exploring-priestleys-use-of-structure': 2,
    },
  },
] as const;
