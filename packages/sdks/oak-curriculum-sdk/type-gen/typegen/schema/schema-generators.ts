/**
 * Schema generation functions
 * Pure functions for generating schema files
 */

import type { OpenAPI3 } from 'openapi-typescript';

/**
 * Generate JSON schema file content
 * @param schema - The OpenAPI schema object
 * @returns Formatted JSON string (pure OpenAPI without tool metadata)
 */
export function generateJsonContent(schema: OpenAPI3): string {
  // Return the schema as-is, without any tool metadata
  return JSON.stringify(schema, undefined, 2);
}

/**
 * Generate TypeScript schema file content
 * @param jsonSchema - The JSON schema as a string
 * @returns TypeScript file content with schema export
 */
export function generateTsSchemaContent(jsonSchema: string): string {
  return `/**
 * The API schema.
 *
 * This is a runtime object that can be used to access the API definition programmatically.
 */

export const schema = ${jsonSchema} as const;

export type Schema = typeof schema;
`;
}

/**
 * Generate base TypeScript schema file content (without tools)
 * @param schema - The OpenAPI schema object
 * @returns TypeScript file content with base schema export
 */
export function generateBaseSchemaContent(schema: OpenAPI3): string {
  // We serialize directly without creating an intermediate copy
  // since we're just re-serializing the same data
  const jsonSchema = JSON.stringify(schema, undefined, 2);

  return `/**
 * The base API schema.
 *
 * This is the original OpenAPI schema without any tool enrichments.
 */

export const schemaBase = ${jsonSchema} as const;

export type SchemaBase = typeof schemaBase;
`;
}
