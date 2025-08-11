/**
 * Key stage operations for the curriculum organ
 * Uses the Oak Curriculum SDK to retrieve key stage information
 */

import type { OakApiClient } from '@oaknational/oak-curriculum-sdk';
import type { Logger } from '@oaknational/mcp-moria';
import type { components } from '@oaknational/oak-curriculum-sdk';
import { CurriculumOperationError } from '../errors/curriculum-errors';

// Use generated types from SDK
type KeyStage = components['schemas']['KeyStageResponseSchema'][number];

/**
 * List all available key stages
 */
export async function listKeyStages(sdk: OakApiClient, logger: Logger): Promise<KeyStage[]> {
  logger.info('Listing key stages');

  try {
    // Call SDK to get key stages
    const result = await sdk.GET('/key-stages');

    // Handle SDK response
    if (result.error) {
      throw new Error(`SDK error: ${result.error.message ?? 'Unknown error'}`);
    }

    const keyStages = result.data ?? [];
    logger.debug(`Found ${keyStages.length} key stages`);

    return keyStages;
  } catch (error) {
    logger.error('Failed to list key stages', { error });
    throw new CurriculumOperationError('listKeyStages', error);
  }
}
