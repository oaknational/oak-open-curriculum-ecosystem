#!/usr/bin/env node

/**
 * Bulk schema generation script.
 *
 * @remarks
 * Generates Zod schemas for Oak curriculum bulk download data.
 * Run as part of `pnpm sdk-codegen` to keep bulk schemas in sync.
 *
 * Output: src/types/generated/bulk/
 *
 * @see typegen/bulk/generate-bulk-schemas.ts
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateBulkSchemas } from './typegen/bulk/index.js';
import { createCodegenLogger } from './create-codegen-logger.js';

const logger = createCodegenLogger('bulkgen');

const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(thisDirectory, '..');
const outPathFromRoot = 'src/types/generated/bulk';
const outDirectory = path.resolve(rootDirectory, outPathFromRoot);

logger.info('Generating bulk download Zod schemas...');

generateBulkSchemas(outDirectory, logger);

logger.info('Bulk schema generation complete!');
