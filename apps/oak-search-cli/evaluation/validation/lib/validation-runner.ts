/**
 * Ground truth validation runner.
 *
 * Orchestrates the validation of all ground truth slugs against the Oak API.
 * Uses the Ground Truth Registry as the single source of truth.
 *
 * @see ADR-085 Ground Truth Validation Discipline
 * @see ADR-098 Ground Truth Registry as Single Source of Truth
 */

import { requireApiKey } from './api-helpers';
import { collectSlugsFromQueries } from './slug-collectors';
import { checkLessonExists, checkSequenceExists } from './api-checkers';
import { validateCategory, printResults, validateQueryStructure } from './validation-helpers';
import { env } from '../../../src/lib/env.js';
import {
  getAllGroundTruthEntries,
  DIAGNOSTIC_QUERIES,
} from '../../../src/lib/search-quality/ground-truth-archive/index';
import {
  SEQUENCE_GROUND_TRUTH_QUERIES,
  SEQUENCE_HARD_GROUND_TRUTH_QUERIES,
} from '../../../src/lib/search-quality/ground-truth-archive/sequences/index';
import type { ValidationCategory } from './types';

/**
 * Validates all ground truth data against the Oak API.
 *
 * Uses the Ground Truth Registry to iterate over all subject/phase combinations,
 * plus validates diagnostic and sequence ground truths.
 */
export async function runValidation(): Promise<void> {
  console.log('Ground Truth Validation');
  console.log('========================\n');

  const config = env();
  const apiKey = requireApiKey(config.OAK_API_KEY);
  console.log('✅ API key found\n');

  validateStructure();
  await validateAllCategories(apiKey);
}

/**
 * Validate query structure (fast, no API calls).
 *
 * Validates all queries from the registry plus diagnostic/sequence queries.
 */
function validateStructure(): void {
  console.log('Validating query structure...');

  // Collect all lesson queries from registry
  const registryEntries = getAllGroundTruthEntries();
  const allRegistryQueries = registryEntries.flatMap((entry) => [...entry.queries]);

  // Include diagnostic queries
  const allLessonQueries = [...allRegistryQueries, ...DIAGNOSTIC_QUERIES];

  // Sequence queries
  const sequenceQueries = [...SEQUENCE_GROUND_TRUTH_QUERIES, ...SEQUENCE_HARD_GROUND_TRUTH_QUERIES];

  const structureErrors = [
    ...validateQueryStructure(allLessonQueries, 'Lessons'),
    ...validateQueryStructure(sequenceQueries, 'Sequences'),
  ];

  if (structureErrors.length > 0) {
    console.log('\n❌ STRUCTURE ERRORS:');
    for (const error of structureErrors) {
      console.log(`  - ${error}`);
    }
    process.exit(1);
  }
  console.log('✅ Query structure valid\n');
}

/**
 * Build the list of validation categories from the registry.
 *
 * Includes:
 * - All subject/phase combinations from the registry
 * - Diagnostic queries
 * - Sequence queries
 */
function buildCategories(): readonly ValidationCategory[] {
  const registryEntries = getAllGroundTruthEntries();

  // Create a category for each registry entry
  const registryCategories: ValidationCategory[] = registryEntries.map((entry) => ({
    name: `${entry.subject}/${entry.phase} (${entry.queries.length} queries)`,
    entries: collectSlugsFromQueries(entry.queries),
    checker: checkLessonExists,
  }));

  // Add diagnostic and sequence categories
  const additionalCategories: ValidationCategory[] = [
    {
      name: 'Diagnostic Queries',
      entries: collectSlugsFromQueries(DIAGNOSTIC_QUERIES),
      checker: checkLessonExists,
    },
    {
      name: 'Standard Sequence Queries',
      entries: collectSlugsFromQueries(SEQUENCE_GROUND_TRUTH_QUERIES),
      checker: checkSequenceExists,
    },
    {
      name: 'Hard Sequence Queries',
      entries: collectSlugsFromQueries(SEQUENCE_HARD_GROUND_TRUTH_QUERIES),
      checker: checkSequenceExists,
    },
  ];

  return [...registryCategories, ...additionalCategories];
}

/** Validate all categories against the API. */
async function validateAllCategories(apiKey: string): Promise<void> {
  console.log('Validating slugs against Oak API...');
  console.log('Using Ground Truth Registry as single source of truth.\n');

  const categories = buildCategories();
  let totalPassed = 0;
  let totalFailed = 0;

  for (const category of categories) {
    console.log(`  Checking ${category.name}...`);
    const results = await validateCategory(category, apiKey);
    const { passed, failed } = printResults(category.name, results);
    totalPassed += passed;
    totalFailed += failed;
  }

  printSummary(totalPassed, totalFailed, categories.length);
}

/** Print final summary and exit appropriately. */
function printSummary(passed: number, failed: number, categoryCount: number): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(60)}`);
  console.log(`Categories validated: ${categoryCount}`);
  console.log(`Total slugs validated: ${passed + failed}`);
  console.log(`✅ Valid: ${passed}`);
  console.log(`❌ Invalid: ${failed}`);

  if (failed > 0) {
    console.log('\n❌ VALIDATION FAILED');
    console.log('Fix the invalid slugs in the ground truth files before proceeding.');
    process.exit(1);
  }

  console.log('\n✅ ALL GROUND TRUTH SLUGS ARE VALID');
}
