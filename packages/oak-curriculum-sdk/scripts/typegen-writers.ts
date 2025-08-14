/**
 * Path grouping utilities
 * Functions for generating path grouping sections
 */

import type { ValidCombinations } from './typegen/extraction-types.js';
import { formatPathGrouping } from './typegen-helpers.js';
import {
  generatePathGroupingKeysType,
  generatePathGroupingTypes,
  generateValidPathsEntries,
} from './typegen-path-groupings.js';

/**
 * Generate path groupings section
 */
export function generatePathGroupingsSection(pathGroupings: ValidCombinations): string {
  const groupEntries = Object.entries(pathGroupings)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([pathGroupingKey, group]) => formatPathGrouping(pathGroupingKey, group ?? {}))
    .join(', ');

  return `
/**
 * Path groupings for different API endpoints
 */
export const PATH_GROUPINGS = {
  ${groupEntries}
};
`;
}

/** Generate the complete valid paths by parameters section */
export function generateValidPathsByParameters(validCombinations: ValidCombinations): string {
  const pathGroupingKeys = generatePathGroupingKeysType(validCombinations);
  const types = generatePathGroupingTypes(pathGroupingKeys);
  const groupEntries = generateValidPathsEntries(validCombinations);

  return `${types}



/**
 * Valid combinations of parameters for different paths
 */
export const VALID_PATHS_BY_PARAMETERS: ValidPathGroupings = {
${groupEntries}
};`;
}
