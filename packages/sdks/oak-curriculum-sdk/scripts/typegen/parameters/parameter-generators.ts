/**
 * Parameter generation functions
 * Pure functions for generating parameter constants and type guards
 *
 * IMPORTANT: All types flow from the schema - no manual type definitions
 */

import type { ExtractedParameters } from '../extraction-types.js';

/**
 * Configuration for code generation of parameter constants and types
 * Maps OpenAPI parameter names to their TypeScript type names
 */
export const PARAMETER_GENERATION_CONFIG = [
  { singular: 'keyStage', plural: 'keyStages', constant: 'KEY_STAGES' },
  { singular: 'subject', plural: 'subjects', constant: 'SUBJECTS' },
  { singular: 'lesson', plural: 'lessons', constant: 'LESSONS' },
  { singular: 'type', plural: 'assetTypes', constant: 'ASSET_TYPES' },
  { singular: 'sequence', plural: 'sequences', constant: 'SEQUENCES' },
  { singular: 'threadSlug', plural: 'threadSlugs', constant: 'THREAD_SLUGS' },
  { singular: 'unit', plural: 'units', constant: 'UNITS' },
] as const;

/**
 * Generate parameter constant and type guard
 * @param singularName - The singular form of the parameter name (e.g., 'keyStage')
 * @param pluralName - The plural form of the parameter name (e.g., 'keyStages')
 * @param values - The array of valid values extracted from the schema
 * @returns TypeScript code for the parameter constant and type guard
 */
export function generateParameterConstant(
  singularName: string,
  pluralName: string,
  values: unknown,
): string {
  // Special case for 'type' parameter which becomes 'AssetType'
  const isTypeParam = singularName === 'type';

  // Convert to appropriate cases
  // Convert camelCase to SNAKE_CASE for constant name
  const constantName = pluralName
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_/, ''); // KEY_STAGES
  const collectionTypeName = pluralName.charAt(0).toUpperCase() + pluralName.slice(1); // KeyStages

  // For 'type' parameter, use 'AssetType' consistently for both type and guard function
  const singleTypeName = isTypeParam
    ? 'AssetType'
    : singularName.charAt(0).toUpperCase() + singularName.slice(1);
  const guardParamName = pluralName; // keyStages

  return `
/**
 * ${collectionTypeName} extracted from the API schema
 */
export const ${constantName} = ${JSON.stringify(values, undefined, 2)} as const;
export type ${collectionTypeName} = typeof ${constantName};
export type ${singleTypeName} = ${collectionTypeName}[number];
export function is${singleTypeName}(value: string): value is ${singleTypeName} {
  const ${guardParamName}: readonly string[] = ${constantName};
  return ${guardParamName}.includes(value);
}`;
}

/**
 * Generate all parameter constants from the extracted parameters
 * @param parameters - Record of parameter names to their values from the schema
 * @returns TypeScript code for all parameter constants
 */
export function generateAllParameterConstants(parameters: ExtractedParameters): string {
  const sections: string[] = [];

  for (const config of PARAMETER_GENERATION_CONFIG) {
    const values = parameters[config.singular] ?? [];
    sections.push(generateParameterConstant(config.singular, config.plural, values));
  }

  return sections.join('\n');
}
