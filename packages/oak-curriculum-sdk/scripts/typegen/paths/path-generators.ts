/**
 * Path generation functions
 * Pure functions for generating path-related TypeScript code
 */

import type { OpenAPI3 } from 'openapi-typescript';

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
import type { SchemaBase as Schema } from "./api-schema-base";
import { schemaBase as schema } from "./api-schema-base";

`;
}

/**
 * Generate PATHS constant from schema
 * @param schema - OpenAPI schema object
 * @returns TypeScript code for PATHS constant
 */
export function generatePathsConstant(schema: Pick<OpenAPI3, 'paths'>): string {
  const paths = Object.keys(schema.paths ?? {})
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
export function generateRuntimeSchemaChecks(): string {
  return `
/**
 * Types derived from the runtime schema object.
*/
type RawPaths = Schema["paths"];

export function isValidPath(value: string): value is ValidPath {
  const paths = Object.keys(schema.paths);
  return paths.includes(value);
}
export const apiPaths: RawPaths = schema.paths;

// A union type of the allowed methods for all paths
type AllowedMethods = keyof (RawPaths[keyof RawPaths]);

const allowedMethodsSet = new Set<AllowedMethods>();
for (const path in schema.paths) {
  if (!isValidPath(path)) {
    throw new TypeError(\`Invalid path: \${path}\`);
  }
  const methods = Object.keys(schema.paths[path]);
  for (const method of methods) {
    // TypeScript has already determined what AllowedMethods can be
    // We just need to add it with proper type assertion since we know it's valid
    if (method === 'get' || method === 'post' || method === 'put' || method === 'delete' || method === 'patch' || method === 'head' || method === 'options') {
      allowedMethodsSet.add(method as AllowedMethods);
    }
  }
}

// The full set of allowed methods for all paths.
export const allowedMethods: AllowedMethods[] = [...allowedMethodsSet];
export function isAllowedMethod(
  maybeMethod: string
): maybeMethod is AllowedMethods {
  const methods: readonly string[] = allowedMethods;
  return methods.includes(maybeMethod);
}

/**
 * For each path, and each method within that path,
 * map to the return type of a 200 response.
 * 
 * This works because the raw schema type and the OpenAPI-TS type use the path as the key.
 */
export type PathReturnTypes = {
  [P in ValidPath]: {
    "get": Paths[P]["get"]["responses"][200]["content"]["application/json"];
  }
};`;
}
