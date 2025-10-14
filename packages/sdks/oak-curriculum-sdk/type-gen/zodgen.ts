#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateZodSchemas } from './zodgen-core.js';
import fs from 'node:fs';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(thisDirectory, '..');
const outPathFromRoot = 'src/types/generated/zod';
const outDirectory = path.resolve(rootDirectory, outPathFromRoot);

void (async () => {
  console.log('🔨 Generating Zod schemas from SDK OpenAPI schema...');

  // Load the SDK schema (which already has canonicalUrl fields)
  const sdkSchemaPath = path.resolve(
    rootDirectory,
    'src/types/generated/api-schema/api-schema-sdk.json',
  );
  const sdkSchema = JSON.parse(fs.readFileSync(sdkSchemaPath, 'utf8')) as OpenAPIObject;
  console.log('📖 Loaded SDK schema with canonicalUrl fields');

  // Generate endpoint definitions with parameter schemas using default template
  await generateZodSchemas(sdkSchema, outDirectory);
  console.log('✅ Endpoint schema generation complete!');

  console.log('✅ All Zod schema generation complete!');
})().catch((error: unknown) => {
  console.error('❌ Zod schema generation failed:', error);
  process.exit(1);
});
