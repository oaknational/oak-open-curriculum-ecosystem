/**
 * Lesson operations for the curriculum organ
 * Uses the Oak Curriculum SDK to retrieve lesson information
 */

import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import type { Logger } from '@oaknational/mcp-moria';
import type { components } from '@oaknational/oak-curriculum-sdk';
import { CurriculumOperationError } from '../errors/curriculum-errors';

// Use generated types from SDK
type LessonSummary = components['schemas']['LessonSummaryResponseSchema'];

/**
 * Get lesson summary by slug
 */
export async function getLesson(
  sdk: OakApiClient,
  logger: Logger,
  lessonSlug: string,
): Promise<LessonSummary> {
  // Validate input
  if (!lessonSlug || lessonSlug.trim() === '') {
    throw new CurriculumOperationError('getLesson', new Error('Lesson slug is required'), {
      lessonSlug,
    });
  }

  logger.info('Getting lesson', { lessonSlug });

  try {
    // Call SDK with proper path parameters
    const result = await sdk.GET('/lessons/{lessonSlug}/summary', {
      params: {
        path: {
          lessonSlug,
        },
      },
    });

    // Handle SDK response
    if (result.error) {
      throw new Error(`SDK error: ${result.error.message ?? 'Unknown error'}`);
    }

    if (!result.data) {
      throw new Error('No lesson data returned');
    }

    logger.debug('Lesson retrieved', {
      lessonSlug,
      title: result.data.lessonTitle,
    });

    return result.data;
  } catch (error) {
    logger.error('Failed to get lesson', { error, lessonSlug });
    throw new CurriculumOperationError('getLesson', error, { lessonSlug });
  }
}
