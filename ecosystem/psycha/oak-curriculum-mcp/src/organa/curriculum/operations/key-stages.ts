/**
 * Key stage operations for the curriculum organ
 * Uses the Oak Curriculum SDK to retrieve key stage information
 */

import type { OakApiClient, components } from '@oaknational/oak-curriculum-sdk';
import type { Logger } from '@oaknational/mcp-moria';
import { CurriculumOperationError } from '../errors/curriculum-errors';
import { processSdkResponse } from '../sdk-utils';

// Use generated types from SDK
type KeyStage = components['schemas']['KeyStageResponseSchema'][number];
type KeyStageArray = KeyStage[];

/**
 * List all available key stages
 */
export async function listKeyStages(sdk: OakApiClient, logger: Logger): Promise<KeyStage[]> {
  logger.info('Listing key stages');

  try {
    // Call SDK to get key stages
    const result = await sdk.GET('/key-stages');

    // Process SDK response with type safety
    const keyStages = processSdkResponse<KeyStageArray>(result, 'listKeyStages');
    logger.debug(`Found ${String(keyStages.length)} key stages`);

    return keyStages;
  } catch (error) {
    logger.error('Failed to list key stages', { error });
    throw new CurriculumOperationError('listKeyStages', error);
  }
}
