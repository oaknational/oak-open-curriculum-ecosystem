/**
 * Pure functions for search operations
 * These can be unit tested without mocks
 */

import type { SearchLessonsParams } from '../../../chorai/stroma';

/**
 * Check if key stage is valid
 */
function isValidKeyStage(value: string): value is 'ks1' | 'ks2' | 'ks3' | 'ks4' {
  const validKeyStages = ['ks1', 'ks2', 'ks3', 'ks4'] as const;
  return (validKeyStages as readonly string[]).includes(value);
}

type ValidSubject = NonNullable<SearchLessonsParams['subject']>;

/**
 * Check if subject is valid
 */
function isValidSubject(value: string): value is ValidSubject {
  const validSubjects: readonly ValidSubject[] = [
    'art',
    'citizenship',
    'computing',
    'cooking-nutrition',
    'design-technology',
    'english',
    'french',
    'geography',
    'german',
    'history',
    'maths',
    'music',
    'physical-education',
    'religious-education',
    'rshe-pshe',
    'science',
    'spanish',
  ];
  return validSubjects.includes(value as ValidSubject);
}

/**
 * Get string field from object if it exists
 */
function getStringField(obj: Record<string, unknown>, field: string): string | undefined {
  const value = obj[field];
  return typeof value === 'string' ? value : undefined;
}

/**
 * Validate and extract query from params
 */
function extractQuery(obj: Record<string, unknown>): string {
  const query = getStringField(obj, 'q');
  if (!query) throw new Error('Search query is required');

  const trimmedQuery = query.trim();
  if (trimmedQuery === '') throw new Error('Search query is required');

  return trimmedQuery;
}

/**
 * Add optional fields to result
 */
function addOptionalFields(obj: Record<string, unknown>, result: SearchLessonsParams): void {
  // Add optional keyStage
  const keyStage = getStringField(obj, 'keyStage');
  if (keyStage) {
    if (!isValidKeyStage(keyStage)) {
      throw new Error(`Invalid key stage: ${keyStage}`);
    }
    result.keyStage = keyStage;
  }

  // Add optional subject
  const subject = getStringField(obj, 'subject');
  if (subject) {
    const trimmedSubject = subject.trim();
    if (isValidSubject(trimmedSubject)) {
      result.subject = trimmedSubject;
    }
  }

  // Add optional unit
  const unit = getStringField(obj, 'unit');
  if (unit) result.unit = unit.trim();
}

/**
 * Validate search parameters from unknown input
 * Pure function - no side effects
 */
export function validateSearchParams(params: unknown): SearchLessonsParams {
  // Basic structure validation
  if (typeof params !== 'object' || params === null) {
    throw new Error('Search params must be an object');
  }

  const obj = params as Record<string, unknown>;

  // Build result with required query
  const result: SearchLessonsParams = { q: extractQuery(obj) };

  // Add optional fields
  addOptionalFields(obj, result);

  return result;
}

/**
 * Format search results for logging
 * Pure function - no side effects
 */
export function formatSearchResultsForLog(results: unknown[]): string {
  const count = results.length;
  if (count === 0) {
    return 'No lessons found';
  } else if (count === 1) {
    return 'Found 1 lesson';
  } else {
    return `Found ${String(count)} lessons`;
  }
}
