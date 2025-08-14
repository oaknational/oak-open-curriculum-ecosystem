/**
 * Schema generation functions
 * Pure functions for generating schema files
 */

import type { OpenAPI3 } from 'openapi-typescript';

/**
 * Generate JSON schema file content
 * @param schema - The OpenAPI schema object
 * @returns Formatted JSON string
 */
export function generateJsonContent(schema: OpenAPI3): string {
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
