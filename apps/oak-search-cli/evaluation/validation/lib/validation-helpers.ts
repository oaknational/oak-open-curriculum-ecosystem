/**
 * Validation helper functions.
 */

import type { ValidationCategory, ValidationResult } from './types';

interface QueryWithRelevance {
  readonly query: string;
  readonly expectedRelevance: Readonly<Record<string, number>>;
}

/**
 * Validates a category of slugs against the API.
 * @param category - Category to validate
 * @param apiKey - Oak API key
 * @returns Array of validation results
 */
export async function validateCategory(
  category: ValidationCategory,
  apiKey: string,
): Promise<readonly ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (const entry of category.entries) {
    const exists = await category.checker(entry.slug, apiKey);
    results.push({
      slug: entry.slug,
      exists,
      usedBy: entry.queries,
    });
  }

  return results;
}

/**
 * Prints validation results for a category.
 * @param categoryName - Name of the category
 * @param results - Validation results
 * @returns Count of passed and failed slugs
 */
export function printResults(
  categoryName: string,
  results: readonly ValidationResult[],
): { passed: number; failed: number } {
  const passed = results.filter((r) => r.exists);
  const failed = results.filter((r) => !r.exists);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`${categoryName}`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Total slugs: ${results.length}`);
  console.log(`✅ Valid: ${passed.length}`);
  console.log(`❌ Invalid: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nINVALID SLUGS:');
    for (const result of failed) {
      console.log(`  ❌ ${result.slug}`);
      console.log(`     Used by: ${result.usedBy.join(', ')}`);
    }
  }

  return { passed: passed.length, failed: failed.length };
}

/**
 * Validates the structure of ground truth queries.
 * @param queries - Queries to validate
 * @param categoryName - Name of the category for error messages
 * @returns Array of error messages (empty if valid)
 */
export function validateQueryStructure(
  queries: readonly QueryWithRelevance[],
  categoryName: string,
): readonly string[] {
  const errors: string[] = [];

  for (const query of queries) {
    validateSingleQuery(query, categoryName, errors);
  }

  return errors;
}

/** Validate a single query's structure and add any errors to the array. */
function validateSingleQuery(
  query: QueryWithRelevance,
  categoryName: string,
  errors: string[],
): void {
  let slugCount = 0;

  for (const key in query.expectedRelevance) {
    if (!Object.prototype.hasOwnProperty.call(query.expectedRelevance, key)) {
      continue;
    }
    slugCount++;
    const relevance = query.expectedRelevance[key];
    validateRelevanceEntry(key, relevance, query.query, categoryName, errors);
  }

  if (slugCount === 0) {
    errors.push(`${categoryName}: Query "${query.query}" has no expected relevant items`);
  }
}

/** Validate a single relevance entry. */
function validateRelevanceEntry(
  slug: string,
  relevance: number | undefined,
  queryText: string,
  categoryName: string,
  errors: string[],
): void {
  if (relevance !== undefined && ![1, 2, 3].includes(relevance)) {
    errors.push(
      `${categoryName}: Query "${queryText}" has invalid relevance ${relevance} for "${slug}"`,
    );
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    errors.push(`${categoryName}: Query "${queryText}" has invalid slug format: "${slug}"`);
  }
}
