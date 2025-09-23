#!/usr/bin/env node

/**
 * This script generates the types for the API schema.
 *
 * It generates the following files:
 * - api-schema-original.json - The schema as returned from the API (pure, undecorated)
 * - api-schema-sdk.json - The SDK-decorated schema (e.g., canonicalUrl fields)
 * - api-paths-types.ts - The OpenAPI-TS types for the SDK schema, for use with OpenAPI-Fetch
 * - path-parameters.ts - The tuples, types and type guards for the path parameters, for use in dynamically constructing API requests
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { config as dotenvConfig } from 'dotenv';

import { generateSchemaArtifacts } from './typegen-core.js';
import { readSchemaCacheOrNull, writeSchemaCacheIfChanged } from './schema-cache.js';
import { isOpenAPI3Schema } from './typegen-helpers.js';
import { createSdkSchema, saveSchemaToFile } from './schema-separation-core.js';

// Load environment variables from repo root .env (or .env.e2e) if not set
function findRepoRoot(startDir: string): string {
  let current = startDir;
  for (;;) {
    const workspace = path.join(current, 'pnpm-workspace.yaml');
    const gitDir = path.join(current, '.git');
    if (existsSync(workspace) || existsSync(gitDir)) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === '/') {
      throw new Error('Could not find repo root. Iterated to `/`');
    }
    if (parent === current) {
      return current;
    }
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
// Treat Vercel as an online environment (preview/prod) regardless of CI var
const args = process.argv.slice(2);
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
const forceCi = args.includes('--ci') || process.env.SDK_TYPEGEN_MODE === 'ci';
const isCiEnv = process.env.CI === 'true';
const isCiMode = forceCi || (isCiEnv && !isVercel);

// Load schema
let maybeSchema: unknown;

// In offline/CI mode we read the cached original schema
const schemaCacheFile = path.resolve(rootDirectory, 'schema-cache/api-schema-original.json');

async function readCachedSchemaOrThrow(): Promise<unknown> {
  if (!existsSync(schemaCacheFile)) {
    throw new Error(
      `CI/offline type-gen requires a cached SDK schema at ${schemaCacheFile}. ` +
        `Run "pnpm -F @oaknational/oak-curriculum-sdk type-gen" locally to refresh ` +
        `the cache and commit the result.`,
    );
  }
  console.log('🧰 Using cached original OpenAPI schema:', schemaCacheFile);
  const raw = await readFile(schemaCacheFile, 'utf8');
  try {
    const parsed: unknown = JSON.parse(raw);
    return parsed;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Cached original OpenAPI schema at ${schemaCacheFile} is not valid JSON. Re-generate locally and commit. ` +
        `Original error: ${msg}`,
    );
  }
}

async function fetchSchemaOnlineOrNull(url: string, apiKey: string): Promise<object | null> {
  console.log('🔄 Fetching OpenAPI schema from:', url);
  try {
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.set('Authorization', `Bearer ${apiKey}`);
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const status = String(response.status);
      const statusText = response.statusText;
      console.error(`❌ Error fetching API schema from ${url}: HTTP ${status} ${statusText}`);
      return null;
    }
    const parsedJson = await response.json();
    if (parsedJson === null || typeof parsedJson !== 'object') {
      console.error('❌ Schema response was not an object');
      return null;
    }
    return parsedJson;
  } catch (error: unknown) {
    console.error(`❌ Error fetching API schema from ${url}:`, error);
    return null;
  }
}

if (isCiMode) {
  // Strict offline in true CI (but not on Vercel, which is treated as online)
  maybeSchema = await readCachedSchemaOrThrow();
} else {
  // Online: fetch fresh schema from API or use cache when necessary
  const apiSchemaUrl = 'https://open-api.thenational.academy/api/v0/swagger.json';
  const apiKey = process.env.OAK_API_KEY;

  if (!apiKey) {
    console.warn('⚠️  OAK_API_KEY not found; attempting to use cached SDK schema');
    maybeSchema = await readCachedSchemaOrThrow();
  } else {
    const online = await fetchSchemaOnlineOrNull(apiSchemaUrl, apiKey);
    if (online) {
      // Update schema cache if version changed or missing
      await writeSchemaCacheIfChanged(schemaCacheFile, online);
      maybeSchema = online;
    } else {
      // Fallback order: schema cache file, then committed generated copy
      const cached = await readSchemaCacheOrNull(schemaCacheFile);
      maybeSchema = cached ?? (await readCachedSchemaOrThrow());
    }
  }

  if (maybeSchema === undefined) {
    throw new Error('Failed to fetch API schema');
  }

  console.log('✅ Schema fetched successfully');
}

console.log('🔨 Generating type artifacts...');

if (!isOpenAPI3Schema(maybeSchema)) {
  throw new Error('Schema is not a valid OpenAPI 3.x schema');
}

const downloadedSchema = maybeSchema;

// Save the original schema
const originalSchemaPath = path.resolve(outDirectory, 'api-schema-original.json');
saveSchemaToFile(downloadedSchema, originalSchemaPath);
console.log(`💾 Original schema saved to: ${path.relative(process.cwd(), originalSchemaPath)}`);

// Create the SDK schema with our decorations
console.log('🎨 Creating SDK schema with canonicalUrl fields...');
const sdkSchema = createSdkSchema(downloadedSchema);

// Use the SDK schema for generation
await generateSchemaArtifacts(downloadedSchema, sdkSchema, outDirectory, {
  generateMcpTools: true,
});

console.log('✅ Type generation complete!');
console.log('✅ MCP tools generated from schema!');
