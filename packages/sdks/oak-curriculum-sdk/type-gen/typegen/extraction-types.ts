/**
 * Types for extracted path parameter data
 * These types represent the data we extract from the OpenAPI schema
 *
 * IMPORTANT: These are DERIVED types from analysing the schema,
 * not manual API type definitions. They represent the structure
 * of data we BUILD by processing the OpenAPI schema.
 */

import type { OpenAPI3 } from 'openapi-typescript';

/**
 * A single path entry with its parameters
 */
export interface PathEntry {
  params?: string;
  path: string;
  paramsKey: string;
}

/**
 * Map of path names to their entries
 */
export type PathGroup = Record<string, PathEntry>;

/**
 * Map of parameter group keys to their path groups
 */
export type ValidCombinations = Record<string, PathGroup | undefined>;

/**
 * Map of parameter names to their valid values
 */
export type ExtractedParameters = Record<string, string[] | undefined>;

/**
 * Map of parameter names to Sets of valid values (used during extraction)
 */
export type ParameterValueSets = Record<string, Set<string>>;

/**
 * Result of extracting path parameters from the schema
 */
export interface ExtractedPathData {
  parameters: ExtractedParameters;
  validCombinations: ValidCombinations;
}

/**
 * Map of filenames to their content (for file generation)
 */
export type FileMap = Record<string, string>;

/**
 * Context object passed during extraction process
 */
export interface ExtractionContext {
  pathParameters: ParameterValueSets;
  validCombinations: ValidCombinations;
  root: OpenAPI3;
}
