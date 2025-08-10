#!/usr/bin/env node

/**
 * This script generates the types for the API schema.
 *
 * It generates the following files:
 * - api-schema.json - A copy of the OpenAPI schema
 * - api-schema.ts - The OpenAPI schema as an exported runtime object
 * - api-paths-types.ts - The OpenAPI-TS types for the API schema, for use with OpenAPI-Fetch
 * - path-parameters.ts - The tuples, types and type guards for the path parameters, for use in dynamically constructing API requests
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config as dotenvConfig } from 'dotenv';
import type { OpenAPI3 } from 'openapi-typescript';

import { generateSchemaArtifacts } from './typegen-core.js';

// Load environment variables from root .env
dotenvConfig({ path: path.resolve(process.cwd(), '../../.env') });

const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(thisDirectory, '..');
const outPathFromRoot = 'src/types/generated/api-schema';
const outDirectory = path.resolve(rootDirectory, outPathFromRoot);

// API configuration
const apiSchemaUrl = 'https://open-api.thenational.academy/api/v0/swagger.json';
const apiKey = process.env.OAK_API_KEY;

// Download and save the JSON schema
let response: Response;
let maybeSchema: unknown;

console.log('🔄 Fetching OpenAPI schema from:', apiSchemaUrl);

try {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  // Add API key if available
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  response = await fetch(apiSchemaUrl, { headers });

  if (!response.ok) {
    throw new Error(`HTTP ${String(response.status)}: ${response.statusText}`);
  }

  maybeSchema = await response.json();
} catch (error) {
  console.error(`❌ Error fetching API schema from ${apiSchemaUrl}:`, error);
  throw error;
}

if (maybeSchema === undefined) {
  throw new Error('Failed to fetch API schema');
}

console.log('✅ Schema fetched successfully');
console.log('🔨 Generating type artifacts...');

const schema = maybeSchema as OpenAPI3;
await generateSchemaArtifacts(schema, outDirectory);

console.log('✅ Type generation complete!');
