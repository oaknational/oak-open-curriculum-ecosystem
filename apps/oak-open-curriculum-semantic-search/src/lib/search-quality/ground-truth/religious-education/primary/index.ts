/**
 * Primary Religious Education ground truth queries for search quality evaluation.
 *
 * Covers KS1-KS2: world religions, beliefs, practices, stories.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/religious-education-primary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Primary RE.
 */
export const RE_PRIMARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'Guru Nanak Sikhs',
    expectedRelevance: {
      'guru-nanak': 3,
      'guru-nanaks-teachings-on-equality-and-acceptance': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests Sikh religious figure and belief retrieval.',
  },
  {
    query: 'Brahman Hindu belief deities',
    expectedRelevance: {
      'brahman-the-story-of-svetaketu': 3,
      'brahman-the-role-of-deities': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests Hindu theology terminology.',
  },
  {
    query: 'Muslim prayer fasting',
    expectedRelevance: {
      'allah-and-harmony': 3,
      'the-shahadah-harmony-through-faith': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests Islamic practice terminology.',
  },
  {
    query: 'Bible God promises',
    expectedRelevance: {
      'shared-stories': 3,
      'noah-and-the-rainbow': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests Christian scripture story retrieval.',
  },
  {
    query: 'Jewish festivals Rosh Hashanah',
    expectedRelevance: {
      'rosh-hashanah-diverse-jewish-celebrations-27026': 3,
      'rosh-hashanah-and-yom-kippur': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests Jewish festival and celebration matching.',
  },
] as const;

/**
 * Hard ground truth queries for Primary RE.
 */
export const RE_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'relegion stories primary',
    expectedRelevance: {
      'shared-stories': 3,
      'noah-and-the-rainbow': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of religion',
  },
  {
    query: 'what do Sikhs believe',
    expectedRelevance: {
      'guru-nanak': 3,
      'guru-nanaks-teachings-on-equality-and-acceptance': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Question format for Sikh beliefs',
  },
  {
    query: 'learning about religious leaders',
    expectedRelevance: {
      'guru-nanak': 3,
      'guru-nanaks-teachings-on-being-honest-and-living-a-good-life': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Informal phrasing for religious figure lessons.',
  },
  {
    query: 'Sikh teachings and values together',
    expectedRelevance: {
      'guru-nanaks-teachings-on-equality-and-acceptance': 3,
      'guru-nanaks-teachings-on-serving-others': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of religious teachings with ethical values.',
  },
  {
    query: 'discussion starter for sensitive topic',
    expectedRelevance: {
      'shared-stories': 3,
      'the-calling-of-abraham': 2,
    },
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for thoughtful RE discussion.',
  },
] as const;

/**
 * All Primary RE ground truth queries.
 *
 * Total: 7 queries.
 */
export const RE_PRIMARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...RE_PRIMARY_STANDARD_QUERIES,
  ...RE_PRIMARY_HARD_QUERIES,
] as const;
