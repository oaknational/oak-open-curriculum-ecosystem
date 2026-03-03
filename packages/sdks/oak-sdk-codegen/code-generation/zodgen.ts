#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { generateZodSchemas } from './zodgen-core.js';
import fs from 'node:fs';
import { validateOpenApiDocument } from './schema-validator.js';
import { createCodegenLogger } from './create-codegen-logger.js';

const logger = createCodegenLogger('zodgen');

const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(thisDirectory, '..');
const outPathFromRoot = 'src/types/generated/zod';
const outDirectory = path.resolve(rootDirectory, outPathFromRoot);

void (async () => {
  logger.info('Generating Zod schemas from SDK OpenAPI schema...');

  const sdkSchemaPath = path.resolve(
    rootDirectory,
    'src/types/generated/api-schema/api-schema-sdk.json',
  );
  const maybeSdkSchema: unknown = JSON.parse(fs.readFileSync(sdkSchemaPath, 'utf8'));
  const sdkSchema = validateOpenApiDocument(maybeSdkSchema);

  logger.info('Loaded SDK schema with canonicalUrl fields');

  await generateZodSchemas(sdkSchema, outDirectory, logger);
  logger.info('Endpoint schema generation complete!');

  logger.info('All Zod schema generation complete!');
})().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(`Zod schema generation failed: ${message}`, error);
  process.exit(1);
});
