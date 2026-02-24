#!/usr/bin/env node

/**
 * Bulk schema generation script.
 *
 * @remarks
 * Generates Zod schemas for Oak curriculum bulk download data.
 * Run as part of `pnpm type-gen` to keep bulk schemas in sync.
 *
 * Output: src/types/generated/bulk/
 *
 * @see typegen/bulk/generate-bulk-schemas.ts
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateBulkSchemas } from './typegen/bulk/index.js';

const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(thisDirectory, '..');
const outPathFromRoot = 'src/types/generated/bulk';
const outDirectory = path.resolve(rootDirectory, outPathFromRoot);

console.log('🔨 Generating bulk download Zod schemas...');

generateBulkSchemas(outDirectory);

console.log('✅ Bulk schema generation complete!');
