/**
 * Ground truth validation runner.
 *
 * Orchestrates the validation of all ground truth slugs against the Oak API.
 *
 * @packageDocumentation
 */

import { getApiKey } from './api-helpers';
import { collectSlugsFromQueries } from './slug-collectors';
import { checkLessonExists, checkUnitExists, checkSequenceExists } from './api-checkers';
import { validateCategory, printResults, validateQueryStructure } from './validation-helpers';
import {
  MATHS_SECONDARY_STANDARD_QUERIES,
  MATHS_SECONDARY_HARD_QUERIES,
  DIAGNOSTIC_QUERIES,
  UNIT_GROUND_TRUTH_QUERIES,
  UNIT_HARD_GROUND_TRUTH_QUERIES,
} from '../../../src/lib/search-quality/ground-truth/index';
import {
  SEQUENCE_GROUND_TRUTH_QUERIES,
  SEQUENCE_HARD_GROUND_TRUTH_QUERIES,
} from '../../../src/lib/search-quality/ground-truth/sequences/index';
import type { ValidationCategory } from './types';

/** Validates all ground truth data against the Oak API. */
export async function runValidation(): Promise<void> {
  console.log('Ground Truth Validation');
  console.log('========================\n');

  const apiKey = getApiKey();
  console.log('✅ API key found\n');

  validateStructure();
  await validateAllCategories(apiKey);
}

/** Validate query structure (fast, no API calls). */
function validateStructure(): void {
  console.log('Validating query structure...');
  const allLessonQueries = [
    ...MATHS_SECONDARY_STANDARD_QUERIES,
    ...MATHS_SECONDARY_HARD_QUERIES,
    ...DIAGNOSTIC_QUERIES,
  ];

  const unitQueries = [...UNIT_GROUND_TRUTH_QUERIES, ...UNIT_HARD_GROUND_TRUTH_QUERIES];
  const sequenceQueries = [...SEQUENCE_GROUND_TRUTH_QUERIES, ...SEQUENCE_HARD_GROUND_TRUTH_QUERIES];

  const structureErrors = [
    ...validateQueryStructure(allLessonQueries, 'Lessons'),
    ...validateQueryStructure(unitQueries, 'Units'),
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

/** Build the list of validation categories. */
function buildCategories(): readonly ValidationCategory[] {
  return [
    {
      name: 'Standard Lesson Queries',
      entries: collectSlugsFromQueries(MATHS_SECONDARY_STANDARD_QUERIES),
      checker: checkLessonExists,
    },
    {
      name: 'Hard Lesson Queries',
      entries: collectSlugsFromQueries(MATHS_SECONDARY_HARD_QUERIES),
      checker: checkLessonExists,
    },
    {
      name: 'Diagnostic Lesson Queries',
      entries: collectSlugsFromQueries(DIAGNOSTIC_QUERIES),
      checker: checkLessonExists,
    },
    {
      name: 'Standard Unit Queries',
      entries: collectSlugsFromQueries(UNIT_GROUND_TRUTH_QUERIES),
      checker: checkUnitExists,
    },
    {
      name: 'Hard Unit Queries',
      entries: collectSlugsFromQueries(UNIT_HARD_GROUND_TRUTH_QUERIES),
      checker: checkUnitExists,
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
}

/** Validate all categories against the API. */
async function validateAllCategories(apiKey: string): Promise<void> {
  console.log('Validating slugs against Oak API...');
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

  printSummary(totalPassed, totalFailed);
}

/** Print final summary and exit appropriately. */
function printSummary(passed: number, failed: number): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log('SUMMARY');
  console.log(`${'='.repeat(60)}`);
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
