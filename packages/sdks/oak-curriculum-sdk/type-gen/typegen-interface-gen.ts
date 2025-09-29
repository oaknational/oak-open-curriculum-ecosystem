/**
 * Interface generation utilities for path parameters
 */

import { PARAMETER_GENERATION_CONFIG } from './typegen/parameters/index.js';
import type { ExtractedParameters } from './typegen/extraction-types.js';

/**
 * Generate the PathParameters interface and related types
 */
export function generatePathParametersInterface(parameters: ExtractedParameters): string {
  // Determine which parameter domains are concrete (non-empty enums)
  const included = PARAMETER_GENERATION_CONFIG.filter((cfg) => {
    const values = parameters[cfg.singular];
    return Array.isArray(values) && values.length > 0;
  });

  const interfaceFields = included
    .map((config) => {
      const typeName = config.plural.charAt(0).toUpperCase() + config.plural.slice(1);
      return `  ${config.singular}: ${typeName};`;
    })
    .join('\n');

  const constantFields = included
    .map((config) => `  ${config.singular}: ${config.constant},`)
    .join('\n');

  return `
/**
 * All possible path parameters extracted from the API schema
 */
export interface PathParameters {
${interfaceFields}
}

export const PATH_PARAMETERS: PathParameters = {
${constantFields}
} as const;

/**
 * Type for path parameter values
 */
export type PathParameterValues = {
  [K in keyof typeof PATH_PARAMETERS as (typeof PATH_PARAMETERS)[K] extends readonly unknown[]
    ? K
    : never]: (typeof PATH_PARAMETERS)[K] extends readonly unknown[]
    ? (typeof PATH_PARAMETERS)[K][number]
    : never;
};

/**
 * Type guard for parameter types
 */
export function isValidParameterType(parameterType: string): parameterType is keyof PathParameterValues {
  const keys = [${included.map((cfg) => `'${cfg.singular}'`).join(', ')}] as const;
  const keyList: readonly string[] = keys;
  return keyList.includes(parameterType);
}

/**
 * Function to validate if a value is a valid parameter for a given parameter type
 */
export function isValidPathParameter(parameterType: string, value: string): boolean {
${included
  .map((cfg) => {
    const constName = cfg.constant;
    return `  if (parameterType === '${cfg.singular}') { const allowed: readonly string[] = ${constName}; return allowed.includes(value); }`;
  })
  .join('\n')}
  // Open set (no enum emitted): accept any string for other parameter types
  return typeof value === 'string';
};`;
}
