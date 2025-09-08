#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateZodSchemasArtifacts, generateZodEndpointsArtifacts } from './zodgen-core.js';
// Import the generated runtime OpenAPI schema object
import { schemaBase as schema } from '../src/types/generated/api-schema/api-schema-base';

const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(thisDirectory, '..');
const outPathFromRoot = 'src/types/generated/zod';
const outDirectory = path.resolve(rootDirectory, outPathFromRoot);

void (async () => {
  console.log('🔨 Generating Zod schemas from generated OpenAPI runtime schema...');

  // Generate response schemas using schemas-only template
  await generateZodSchemasArtifacts(schema, outDirectory);
  console.log('✅ Response schema generation complete!');

  // Generate endpoint definitions with parameter schemas using default template
  await generateZodEndpointsArtifacts(schema, outDirectory);
  console.log('✅ Endpoint schema generation complete!');

  console.log('✅ All Zod schema generation complete!');
})().catch((error: unknown) => {
  console.error('❌ Zod schema generation failed:', error);
  process.exit(1);
});
