/**
 * Path generation functions
 * Pure functions for generating path-related TypeScript code
 */

import type { OpenAPI3 } from 'openapi-typescript';
import { typeSafeKeys } from '../../../src/types/helpers.js';

/**
 * Generate path parameters file header
 * @returns TypeScript file header with imports and documentation
 */
export function generatePathParametersHeader(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 * This file is generated from the API schema during type generation.
 * 
 * This file contains the tuples, types and type guards for the path parameters, for use in dynamically constructing API requests.
 * 
 * It also contains the valid parameter combinations for different paths.
 */

// Link to the processed schema for use with the OpenAPI-Fetch client.
import type { paths as Paths } from "./api-paths-types";
// Link to the schema runtime object file.
/**
 * The Schema["paths"] keys are the same as the Paths type keys, but the types are different.
 * The Schema["paths"] type is for the raw schema, and the Paths type is the OpenAPI-TS type for the processed schema.
 */
import type { SchemaBase as Schema } from "./api-schema-base.js";
import { schemaBase as schema } from "./api-schema-base.js";

`;
}

/**
 * Generate PATHS constant from schema
 * @param schema - OpenAPI schema object
 * @returns TypeScript code for PATHS constant
 */
export function generatePathsConstant(schema: Pick<OpenAPI3, 'paths'>): string {
  const paths = typeSafeKeys(schema.paths ?? {})
    .sort((a, b) => a.localeCompare(b))
    .map((p) => `  '${p}': '${p}'`)
    .join(',\n');

  return `type ValidPath = keyof Paths;
/**
 * Convenience map for all the paths
 */
export const PATHS = {
${paths}
} as const;`;
}

/**
 * Generate runtime schema checks section
 * @returns TypeScript code for runtime validation functions
 */
function runtimeTypeDerivations(): string {
  const header = `
/**
 * Types derived from the runtime schema object.
*/
type RawPaths = Schema["paths"];

export function isValidPath(value: string): value is ValidPath {
  const paths = Object.keys(schema.paths);
  return paths.includes(value);
}
export const apiPaths: RawPaths = schema.paths;`;
  const allowed = `
type AllowedMethods = keyof (RawPaths[keyof RawPaths]);
const allowedMethodsSet = new Set<AllowedMethods>();
for (const path in schema.paths) {
  if (!isValidPath(path)) { throw new TypeError(\`Invalid path: \${path}\`); }
  const methods = Object.keys(schema.paths[path]);
  for (const method of methods) {
    if (method === 'get' || method === 'post' || method === 'put' || method === 'delete' || method === 'patch' || method === 'head' || method === 'options') {
      allowedMethodsSet.add(method as AllowedMethods);
    }
  }
}
export const allowedMethods: AllowedMethods[] = [...allowedMethodsSet];
export function isAllowedMethod(maybeMethod: string): maybeMethod is AllowedMethods {
  const methods: readonly string[] = allowedMethods;
  return methods.includes(maybeMethod);
}`;
  const tail = `
export type PathReturnTypes = {
  [P in ValidPath]: {
    "get": Paths[P]["get"]["responses"][200]["content"]["application/json"];
  }
};`;
  return [header, allowed, tail].join('\n');
}

export function generateRuntimeSchemaChecks(): string {
  return runtimeTypeDerivations();
}
