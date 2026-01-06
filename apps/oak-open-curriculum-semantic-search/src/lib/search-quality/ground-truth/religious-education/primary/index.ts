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
      'guru-nanaks-teachings-on-equality-and-acceptance': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'Brahman Hindu',
    expectedRelevance: {
      'brahman-the-story-of-svetaketu': 3,
      'brahman-the-role-of-deities': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'Muslim prayer fasting',
    expectedRelevance: {
      'allah-and-harmony': 3,
      'the-shahadah-harmony-through-faith': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'Bible God promises',
    expectedRelevance: {
      'shared-stories': 3,
      'noah-and-the-rainbow': 3,
    },
    category: 'naturalistic',
  },
  {
    query: 'Jewish festivals Rosh Hashanah',
    expectedRelevance: {
      'rosh-hashanah-diverse-jewish-celebrations-27026': 3,
      'rosh-hashanah-and-yom-kippur': 3,
    },
    category: 'naturalistic',
  },
] as const;

/**
 * Hard ground truth queries for Primary RE.
 */
export const RE_PRIMARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'relegion stories primary',
    expectedRelevance: {
      'shared-stories': 2,
      'noah-and-the-rainbow': 2,
    },
    category: 'misspelling',
    description: 'Misspelling of religion',
  },
  {
    query: 'what do Sikhs believe',
    expectedRelevance: {
      'guru-nanak': 2,
      'guru-nanaks-teachings-on-equality-and-acceptance': 2,
    },
    category: 'colloquial',
    description: 'Question format for Sikh beliefs',
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
