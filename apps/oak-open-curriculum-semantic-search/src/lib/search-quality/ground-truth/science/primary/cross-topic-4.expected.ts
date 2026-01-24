/**
 * Expected relevance for "plants and animals" (no typos)
 * Control comparison for imprecise-input-2 (plints and enimals)
 *
 * Updated 2026-01-23: GT corrected based on deep curriculum analysis.
 * Prioritizes lessons with "plants and animals" in key learning points.
 *
 * Map of lesson_slug → relevance score.
 * - 3 = Highly relevant (explicitly discusses plants AND animals together)
 * - 2 = Relevant (discusses relationship between plants and animals)
 *
 * @packageDocumentation
 */

import type { ExpectedRelevance } from '../../types';

export const SCIENCE_PRIMARY_CROSS_TOPIC_4_EXPECTED: ExpectedRelevance = {
  // Title: "Plants and animals in microhabitats" - PERFECT match
  // Key Learning: "A habitat is where a group of plants and animals live"
  'plants-and-animals-in-microhabitats': 3,
  // Key Learning: "A habitat is where a group of plants and animals live" (same as above)
  // Direct companion to plant-habitats in "Living things and where they live" unit
  'animal-habitats': 3,
  // Key Learning: "A habitat is where a group of plants and animals live"
  'plant-habitats': 3,
  // Key Learning: "A wildlife-friendly garden can encourage plants and animals to live safely"
  'protecting-microhabitats': 2,
  // Key Learning: "Animals need food from plants and other animals"
  'introduction-to-food-chains': 2,
} as const;
