/**
 * Subject operations for the curriculum organ
 * Uses the Oak Curriculum SDK to retrieve subject information
 */

import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import type { Logger } from '@oaknational/mcp-moria';
import type { components } from '@oaknational/oak-curriculum-sdk';
import { CurriculumOperationError } from '../errors/curriculum-errors';

// Use generated types from SDK
type Subject = components['schemas']['AllSubjectsResponseSchema'][number];

/**
 * List all available subjects
 */
export async function listSubjects(sdk: OakApiClient, logger: Logger): Promise<Subject[]> {
  logger.info('Listing subjects');

  try {
    // Call SDK to get subjects
    const result = await sdk.GET('/subjects');

    // Handle SDK response
    if (result.error) {
      throw new Error(`SDK error: ${result.error.message ?? 'Unknown error'}`);
    }

    const subjects = result.data ?? [];
    logger.debug(`Found ${subjects.length} subjects`);

    return subjects;
  } catch (error) {
    logger.error('Failed to list subjects', { error });
    throw new CurriculumOperationError('listSubjects', error);
  }
}
