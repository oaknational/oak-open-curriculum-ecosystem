/**
 * Interface generation utilities for path parameters
 */

import { PARAMETER_GENERATION_CONFIG } from './typegen/parameters/index.js';

/**
 * Generate the PathParameters interface and related types
 */
export function generatePathParametersInterface(): string {
  const interfaceFields = PARAMETER_GENERATION_CONFIG.map((config) => {
    // Use the plural form with proper capitalisation for the type name
    const typeName = config.plural.charAt(0).toUpperCase() + config.plural.slice(1);
    return `  ${config.singular}: ${typeName};`;
  }).join('\n');

  const constantFields = PARAMETER_GENERATION_CONFIG.map(
    (config) => `  ${config.singular}: ${config.constant},`,
  ).join('\n');

  return `
/**
 * All possible path parameters extracted from the API schema
 */
interface PathParameters {
${interfaceFields}
}

export const PATH_PARAMETERS: PathParameters = {
${constantFields}
} as const;

/**
 * Type for path parameter values
 */
export type PathParameterValues = {
  [K in keyof typeof PATH_PARAMETERS]: (typeof PATH_PARAMETERS)[K][number];
};

/**
 * Type guard for parameter types
 */
export function isValidParameterType(
  parameterType: string
): parameterType is keyof PathParameterValues {
  return parameterType in PATH_PARAMETERS;
}

/**
 * Function to validate if a value is a valid parameter for a given parameter type
 */
export function isValidPathParameter<K extends keyof PathParameterValues>(
  parameterType: K,
  value: string
): value is PathParameterValues[K] {
  const allowedValues: readonly string[] = PATH_PARAMETERS[parameterType]
  return allowedValues.length === 0 ? typeof value === "string" : allowedValues.includes(value)
};`;
}
