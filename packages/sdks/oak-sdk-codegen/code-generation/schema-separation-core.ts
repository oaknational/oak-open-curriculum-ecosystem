/**
 * Schema Separation Core Functions
 *
 * Pure functions for separating the original API schema from the SDK-enhanced schema.
 * This ensures we preserve the canonical API schema as the source of truth while
 * creating our own SDK-specific version with additional fields.
 */

import fs from 'node:fs';
import path from 'node:path';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { assertSchemaHasComponentsSchemas } from './schema-validator.js';
import { decorateOakUrls } from './schema-separation-decorators.js';
import { add404ResponsesWhereExpected } from './schema-enhancement-404.js';

export interface SeparatedSchema {
  readonly original: OpenAPIObject;
  readonly validated: OpenAPIObject;
  readonly sdk: OpenAPIObject;
}

export function createOpenCurriculumSchema(validated: OpenAPIObject): SeparatedSchema {
  assertSchemaHasComponentsSchemas(validated);
  const original = structuredClone(validated);
  const decorated = decorateOakUrls(validated);
  const sdk = add404ResponsesWhereExpected(decorated);
  return { original, validated, sdk };
}

/**
 * Decide whether to fetch a clean original schema (when downloaded schema appears decorated)
 */
// shouldUseOriginalSchema removed: upstream schema is always treated as pure; SDK schema is always decorated

/**
 * Saves a schema to a file
 * @param schema - The schema to save
 * @param filePath - The file path to save to
 */
export function saveSchemaToFile(schema: OpenAPIObject, filePath: string): void {
  // Ensure the directory exists
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });

  const content = JSON.stringify(schema, undefined, 2);
  fs.writeFileSync(filePath, content, 'utf-8');
}
