/**
 * Path grouping utilities
 * Functions for generating path grouping sections
 */

import type { PathGroup } from './typegen/extraction-types.js';
import {
  generatePathGroupingKeysType,
  generatePathGroupingTypes,
  generateValidCombinations,
} from './typegen-path-groupings.js';

/**
 * Generate path groupings section
 */
export function generatePathGroupingsSection(pathGroupings: Record<string, PathGroup>): string {
  const groupKeys = Object.keys(pathGroupings).sort((a, b) => a.localeCompare(b));
  const groupEntries = groupKeys
    .map((groupKey) => {
      const group = pathGroupings[groupKey];
      const pathKeys = Object.keys(group).sort((a, b) => a.localeCompare(b));
      const serializedPaths = pathKeys
        .map((pathKey) => {
          const body = JSON.stringify(group[pathKey], undefined, 2)
            .split('\n')
            .map((line) => `    ${line}`)
            .join('\n');
          return `  ${pathKey}: {\n${body}\n  }`;
        })
        .join(',\n');
      return `  ${groupKey}: {\n${serializedPaths}\n  },`;
    })
    .join('\n');

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
export function generateValidPathsByParameters(
  validCombinations: Record<string, PathGroup | undefined>,
): string {
  const pathGroupingKeys = generatePathGroupingKeysType(validCombinations);
  const types = generatePathGroupingTypes(pathGroupingKeys);
  const groupEntries = generateValidCombinations(validCombinations);

  return `${types}



/**
 * Valid combinations of parameters for different paths
 */
export const VALID_PATHS_BY_PARAMETERS: ValidPathGroupings = {
${groupEntries}
};`;
}
