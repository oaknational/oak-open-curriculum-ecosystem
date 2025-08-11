/**
 * Search operations for the curriculum organ
 * Uses the Oak Curriculum SDK to perform searches
 */

import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import type { Logger } from '@oaknational/mcp-moria';
import type { components } from '@oaknational/oak-curriculum-sdk';
import type { SearchLessonsParams } from '../../../chorai/stroma';
import { CurriculumOperationError } from '../errors/curriculum-errors';
import { validateSearchParams, formatSearchResultsForLog } from './search-pure';

// Use generated types from SDK
type SearchResult = components['schemas']['LessonSearchResponseSchema'][number];

// Re-export SearchLessonsParams for backward compatibility
export type { SearchLessonsParams };

/**
 * Search for lessons using the Oak Curriculum SDK
 * This is an integration point that coordinates SDK calls
 */
export async function searchLessons(
  sdk: OakApiClient,
  logger: Logger,
  params: SearchLessonsParams,
): Promise<SearchResult[]> {
  // Use pure function for validation
  const validParams = validateSearchParams(params);

  logger.info('Searching lessons', validParams);

  try {
    // Call SDK with proper parameters
    const result = await sdk.GET('/search/lessons', {
      params: {
        query: {
          q: validParams.q,
          keyStage: validParams.keyStage,
          subject: validParams.subject,
          limit: validParams.limit,
        },
      },
    });

    // Handle SDK response
    if (result.error) {
      throw new Error(`SDK error: ${result.error.message ?? 'Unknown error'}`);
    }

    const lessons = result.data ?? [];

    // Use pure function for formatting log message
    logger.debug(formatSearchResultsForLog(lessons));

    return lessons;
  } catch (error) {
    logger.error('Search failed', { error, params: validParams });
    throw new CurriculumOperationError('searchLessons', error, { params: validParams });
  }
}
