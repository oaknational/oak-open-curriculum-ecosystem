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
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { config as dotenvConfig } from 'dotenv';

import { generateSchemaArtifacts } from './typegen-core.js';
import type { OpenAPI3 } from 'openapi-typescript';
import { isPlainObject, getOwnString, getOwnValue } from '../src/types/helpers.js';

// Load environment variables from repo root .env (or .env.e2e) if not set
function findRepoRoot(startDir: string): string {
  let current = startDir;
  for (;;) {
    const workspace = path.join(current, 'pnpm-workspace.yaml');
    const gitDir = path.join(current, '.git');
    if (existsSync(workspace) || existsSync(gitDir)) return current;
    const parent = path.dirname(current);
    if (parent === current) return current;
    current = parent;
  }
}

if (!process.env.OAK_API_KEY) {
  const repoRoot = findRepoRoot(process.cwd());
  const envE2EPath = path.join(repoRoot, '.env.e2e');
  const envPath = path.join(repoRoot, '.env');
  const chosen = existsSync(envE2EPath) ? envE2EPath : envPath;
  dotenvConfig({ path: chosen });
}

const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(thisDirectory, '..');
const outPathFromRoot = 'src/types/generated/api-schema';
const outDirectory = path.resolve(rootDirectory, outPathFromRoot);

// Determine mode: online (default) vs CI/offline
const args = process.argv.slice(2);
const isCiMode =
  args.includes('--ci') || process.env.SDK_TYPEGEN_MODE === 'ci' || process.env.CI === 'true';

// Load schema
let maybeSchema: unknown;

if (isCiMode) {
  // Strict offline: use committed schema file only
  const cachedSchemaPath = path.resolve(rootDirectory, outPathFromRoot, 'api-schema.json');
  if (!existsSync(cachedSchemaPath)) {
    throw new Error(
      `CI/offline type-gen requires a cached schema at ${cachedSchemaPath}. ` +
        `Run "pnpm -F @oaknational/oak-curriculum-sdk type-gen" locally to refresh the cache and commit the result.`,
    );
  }
  console.log('🧰 Using cached OpenAPI schema (CI/offline):', cachedSchemaPath);
  const raw = await readFile(cachedSchemaPath, 'utf8');
  try {
    maybeSchema = JSON.parse(raw);
  } catch (err: unknown) {
    let errMessage = '';
    if (err instanceof Error) {
      errMessage = err.message;
    } else {
      errMessage = String(err);
    }
    throw new Error(
      `Cached schema at ${cachedSchemaPath} is not valid JSON. ` +
        `Re-generate locally and commit. Original error: ${errMessage}`,
    );
  }
} else {
  // Online: fetch fresh schema from API
  const apiSchemaUrl = 'https://open-api.thenational.academy/api/v0/swagger.json';
  const apiKey = process.env.OAK_API_KEY;

  let response: Response;

  console.log('🔄 Fetching OpenAPI schema from:', apiSchemaUrl);

  try {
    const headers = new Headers();
    headers.set('Accept', 'application/json');

    if (!apiKey) {
      throw new TypeError('API key not found');
    }

    headers.set('Authorization', `Bearer ${apiKey}`);

    response = await fetch(apiSchemaUrl, { headers });

    if (!response.ok) {
      throw new Error(`HTTP ${String(response.status)}: ${response.statusText}`);
    }

    maybeSchema = await response.json();
  } catch (error: unknown) {
    console.error(`❌ Error fetching API schema from ${apiSchemaUrl}:`, error);
    throw error;
  }

  if (maybeSchema === undefined) {
    throw new Error('Failed to fetch API schema');
  }

  console.log('✅ Schema fetched successfully');
}
console.log('🔨 Generating type artifacts...');

function isOpenAPI3Schema(value: unknown): value is OpenAPI3 {
  if (!isPlainObject(value)) return false;
  const ver = getOwnString(value, 'openapi');
  if (!ver?.startsWith('3.')) return false;
  const paths = getOwnValue(value, 'paths');
  if (!isPlainObject(paths)) return false;
  const info = getOwnValue(value, 'info');
  if (!isPlainObject(info)) return false;
  const title = getOwnString(info, 'title');
  const version = getOwnString(info, 'version');
  return typeof title === 'string' && typeof version === 'string';
}

if (!isOpenAPI3Schema(maybeSchema)) {
  throw new Error('Schema is not a valid OpenAPI 3.x schema');
}

const schema = maybeSchema;

// Generate all artifacts including MCP tools
// schema is now fully typed as OpenAPI3
await generateSchemaArtifacts(schema, outDirectory, {
  generateMcpTools: true,
});

console.log('✅ Type generation complete!');
console.log('✅ MCP tools generated from schema!');
