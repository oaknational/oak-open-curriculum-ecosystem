/**
 * Bulk schema generator for Oak curriculum bulk download data.
 *
 * @remarks
 * This generator produces Zod schemas for bulk download files that COMPOSE
 * with the existing API schemas generated from the OpenAPI spec. This follows
 * the schema-first principle: types flow from schemas at type-gen time.
 *
 * The bulk download format is ~90% identical to API responses. We generate
 * schemas that:
 * 1. Reference existing API schemas where identical
 * 2. Extend API schemas with bulk-specific fields (transcripts, lessonSlug)
 * 3. Handle bulk-specific transformations (NULL sentinel → null)
 *
 * @see ../../../docs/architecture/schema-first-execution.md
 */

import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';

import {
  HEADER_TEMPLATE,
  NULL_SENTINEL_TEMPLATE,
  VOCABULARY_TEMPLATE,
  CONTENT_GUIDANCE_TEMPLATE,
} from './schema-templates.js';

import {
  LESSON_TEMPLATE,
  BULK_FILE_TEMPLATE,
  getDeltaDocumentationTemplate,
  INDEX_TEMPLATE,
} from './schema-templates-part2.js';

import { UNIT_TEMPLATE } from './schema-templates-part3.js';

/**
 * Generate the bulk schemas TypeScript file content.
 *
 * @returns Generated TypeScript code as a string
 */
function generateBulkSchemasContent(): string {
  return [
    HEADER_TEMPLATE,
    NULL_SENTINEL_TEMPLATE,
    VOCABULARY_TEMPLATE,
    CONTENT_GUIDANCE_TEMPLATE,
    UNIT_TEMPLATE,
    LESSON_TEMPLATE,
    BULK_FILE_TEMPLATE,
    getDeltaDocumentationTemplate(),
  ].join('\n');
}

/**
 * Generate bulk download Zod schemas to the output directory.
 *
 * @param outDir - Output directory for generated files
 */
export function generateBulkSchemas(outDir: string): void {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  const schemasFile = path.join(outDir, 'bulk-schemas.ts');
  const indexFile = path.join(outDir, 'index.ts');

  const schemasContent = generateBulkSchemasContent();

  writeFileSync(schemasFile, schemasContent);
  console.log(`📝 Generated bulk schemas: ${schemasFile}`);

  writeFileSync(indexFile, INDEX_TEMPLATE);
  console.log(`📝 Generated bulk index: ${indexFile}`);
}
