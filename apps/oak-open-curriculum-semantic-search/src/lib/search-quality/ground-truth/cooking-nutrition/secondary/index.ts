/**
 * Secondary Cooking & Nutrition ground truth queries for search quality evaluation.
 *
 * Covers KS3: cooking techniques, nutrition, food safety.
 *
 * **Methodology (2026-01-05)**:
 * All lesson slugs verified from bulk-downloads/cooking-nutrition-secondary.json.
 *
 * @packageDocumentation
 */

import type { GroundTruthQuery } from '../../types';

/**
 * Standard ground truth queries for Secondary Cooking & Nutrition.
 */
export const COOKING_SECONDARY_STANDARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'making soup Year 7',
    expectedRelevance: {
      'making-leek-and-potato-soup': 3,
      'making-a-mini-deli-salad': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests year-specific practical cooking lesson retrieval.',
  },
  {
    query: 'baking bread focaccia',
    expectedRelevance: {
      'making-herby-focaccia': 3,
      'making-chelsea-buns': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests specific recipe and technique matching.',
  },
  {
    query: 'curry recipe cooking ks3',
    expectedRelevance: {
      'making-sweet-potato-katsu-curry': 3,
      'making-jerk-veg-and-black-bean-curry-with-rice-and-peas': 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests key stage filtering with recipe search.',
  },
  {
    query: 'Eatwell Guide healthy eating',
    expectedRelevance: {
      'eat-well-now': 3,
      'making-better-food-and-drink-choices': 2,
    },
    category: 'precise-topic',
    priority: 'high',
    description: 'Tests nutrition theory curriculum term matching.',
  },
  {
    query: 'macronutrients and micronutrients nutrition',
    expectedRelevance: {
      'macronutrients-fibre-and-water': 3,
      micronutrients: 2,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests scientific nutrition vocabulary retrieval.',
  },
  {
    query: 'burrito recipe ks3',
    expectedRelevance: {
      'making-cheesy-bean-burritos': 3,
      'making-yakisoba-noodles': 1,
    },
    category: 'precise-topic',
    priority: 'medium',
    description: 'Tests specific dish search with key stage context.',
  },
] as const;

/**
 * Hard ground truth queries for Secondary Cooking & Nutrition.
 */
export const COOKING_SECONDARY_HARD_QUERIES: readonly GroundTruthQuery[] = [
  {
    query: 'nutrision healthy food',
    expectedRelevance: {
      'eat-well-now': 3,
      'macronutrients-fibre-and-water': 2,
    },
    category: 'imprecise-input',
    priority: 'critical',
    description: 'Misspelling of nutrition',
  },
  {
    query: 'how to cook healthy meals ks3',
    expectedRelevance: {
      'making-better-food-and-drink-choices': 3,
      'making-a-mini-deli-salad': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Question format with key stage reference',
  },
  {
    query: 'teach students to make bread',
    expectedRelevance: {
      'making-herby-focaccia': 3,
      'making-chelsea-buns': 2,
    },
    category: 'natural-expression',
    priority: 'high',
    description: 'Teacher intent phrasing for baking lessons.',
  },
  {
    query: 'nutrition and cooking techniques together',
    expectedRelevance: {
      'eat-well-now': 3,
      'making-better-food-and-drink-choices': 2,
    },
    category: 'cross-topic',
    priority: 'medium',
    description: 'Tests intersection of nutrition theory with practical cooking skills.',
  },
  {
    query: 'quick practical for double lesson',
    category: 'pedagogical-intent',
    priority: 'exploratory',
    description: 'Tests teaching goal for time-appropriate practical cooking.',
    expectedRelevance: {
      'making-leek-and-potato-soup': 3,
      'making-a-mini-deli-salad': 2,
    },
  },
] as const;

/**
 * All Secondary Cooking & Nutrition ground truth queries.
 *
 * Total: 8 queries.
 */
export const COOKING_SECONDARY_ALL_QUERIES: readonly GroundTruthQuery[] = [
  ...COOKING_SECONDARY_STANDARD_QUERIES,
  ...COOKING_SECONDARY_HARD_QUERIES,
] as const;
