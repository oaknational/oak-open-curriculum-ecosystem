/**
 * Path grouping type generation utilities
 */

import type { ValidCombinations } from './typegen/extraction-types.js';

/**
 * Generate the path grouping keys type union
 */
export function generatePathGroupingKeysType(validCombinations: ValidCombinations): string {
  const otherKeys = Object.keys(validCombinations)
    .filter((key) => key !== 'NO_PARAMS')
    .sort()
    .map((key) => `"${key}"`);
  const allKeys = ['"NO_PARAMS"', ...otherKeys];
  return allKeys.join(' | ');
}

/**
 * Generate the TypeScript interface definitions for path groupings
 */
export function generatePathGroupingTypes(pathGroupingKeys: string): string {
  return `
/**
 * Path grouping keys
 */
export type PathGroupingKeys = ${pathGroupingKeys};


/**
 * Type for a valid parameter combination, linking to the paths types file.
 */
// Parametrise ValidParameterCombination with both the path and the path key
export interface ValidParameterCombination<
  P extends ValidPath,
  K extends PathGroupingKeys
> {
  params?: string;
  path: P;
  paramsKey: K; // This ensures paramsKey matches the K type parameter, enabling type narrowing based on the path key
}

// Make ValidPathAndParameters parameterized by the path key K
export type ValidPathAndParameters<K extends PathGroupingKeys> = {
  // Only include paths that are valid for this specific K
  [P in ValidPath as P extends keyof Paths ? P : never]?: ValidParameterCombination<P, K>;
};

// Now ValidPathGroupings maps each key to only its relevant paths
export type ValidPathGroupings = {
  [K in PathGroupingKeys]: ValidPathAndParameters<K>;
};`;
}

/**
 * Generate the VALID_PATHS_BY_PARAMETERS constant entries
 */
export function generateValidCombinations(validCombinations: ValidCombinations): string {
  const sortedGroupKeys = [...Object.keys(validCombinations)].sort((a, b) => a.localeCompare(b));
  return sortedGroupKeys
    .map((pathGroupingKey, index) => {
      const group = validCombinations[pathGroupingKey];
      const entries = group ? Object.keys(group).sort((a, b) => a.localeCompare(b)) : [];

      const objectLiteral = group
        ? entries
            .map((entryKey) => {
              const value = group[entryKey];
              return `    "${entryKey}": ${JSON.stringify(value, undefined, 4).replace(/\n/g, '\n    ')}`;
            })
            .join(',\n')
        : '';

      const suffix = index < sortedGroupKeys.length - 1 ? ',' : '';
      if (group && entries.length > 0) {
        return `  "${pathGroupingKey}": {
${objectLiteral}
  }${suffix}`;
      }
      return `  "${pathGroupingKey}": {}${suffix}`;
    })
    .join('\n');
}
