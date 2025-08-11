/**
 * Pure functions for search operations
 * These can be unit tested without mocks
 */

import type { SearchLessonsParams } from '../../../chorai/stroma';

/**
 * Validate search parameters
 * Pure function - no side effects
 */
export function validateSearchParams(params: SearchLessonsParams): SearchLessonsParams {
  if (!params.q || params.q.trim() === '') {
    throw new Error('Search query is required');
  }

  // Validate key stage if provided
  if (params.keyStage) {
    const validKeyStages = ['eyfs', 'ks1', 'ks2', 'ks3', 'ks4', 'ks5'] as const;
    if (!validKeyStages.includes(params.keyStage)) {
      throw new Error(`Invalid key stage: ${params.keyStage}`);
    }
  }

  // Validate limit if provided
  if (params.limit !== undefined) {
    if (params.limit < 1 || params.limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }
  }

  return {
    q: params.q.trim(),
    keyStage: params.keyStage,
    subject: params.subject?.trim(),
    limit: params.limit,
  };
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
    return `Found ${count} lessons`;
  }
}
