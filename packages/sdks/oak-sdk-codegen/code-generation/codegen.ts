#!/usr/bin/env node

/**
 * This script generates the types for the API schema.
 *
 * It generates the following files:
 * - api-schema-original.json - The schema as returned from the API (pure, undecorated)
 * - api-schema-sdk.json - The SDK-decorated schema (e.g., oakUrl plus upstream canonicalUrl)
 * - api-paths-types.ts - The OpenAPI-TS types for the SDK schema, for use with OpenAPI-Fetch
 * - path-parameters.ts - The tuples, types and type guards for the path parameters, for use in dynamically constructing API requests
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { config as dotenvConfig } from 'dotenv';

import { generateSchemaArtifacts } from './codegen-core.js';
import { readSchemaCacheOrNull, writeSchemaCacheIfChanged } from './schema-cache.js';
import { createOpenCurriculumSchema, saveSchemaToFile } from './schema-separation-core.js';
import { validateOpenApiDocument } from './schema-validator.js';
import { generateWidgetConstants, generateSubjectHierarchy } from './typegen/index.js';
import { runSitemapValidation } from './typegen/routing/validate-canonical-urls.js';
import { normalizeError } from '@oaknational/logger';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { createCodegenLogger } from './create-codegen-logger.js';

const logger = createCodegenLogger('codegen');

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
const forceCi = args.includes('--ci') || process.env.SDK_CODEGEN_MODE === 'ci';
const isCiEnv = process.env.CI === 'true';
const isCiMode = forceCi || (isCiEnv && !isVercel);

// In offline/CI mode we read the cached original schema
const schemaCacheFilePath = path.resolve(rootDirectory, 'schema-cache/api-schema-original.json');

interface LoadedSchema {
  readonly original: OpenAPIObject;
  readonly validated: OpenAPIObject;
  readonly sdk: OpenAPIObject;
}

async function readCachedSchemaOrThrow(): Promise<OpenAPIObject> {
  if (!existsSync(schemaCacheFilePath)) {
    throw new Error(
      `CI/offline code-generation requires a cached SDK schema at ${schemaCacheFilePath}. ` +
        `Run "pnpm -F @oaknational/curriculum-sdk code-generation" locally to refresh ` +
        `the cache and commit the result.`,
    );
  }
  logger.info('Using cached original OpenAPI schema', { path: schemaCacheFilePath });
  const raw = await readFile(schemaCacheFilePath, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  return validateOpenApiDocument(parsed);
}

async function fetchSchemaOnlineOrNull(url: string, apiKey: string): Promise<object | null> {
  logger.info('Fetching OpenAPI schema', { url });
  try {
    const headers = new Headers();
    headers.set('Accept', 'application/json');
    headers.set('Authorization', `Bearer ${apiKey}`);
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const status = String(response.status);
      const statusText = response.statusText;
      logger.error(`Error fetching API schema: HTTP ${status} ${statusText}`, { url });
      return null;
    }
    const parsedJson = await response.json();
    if (parsedJson === null || typeof parsedJson !== 'object') {
      logger.error('Schema response was not an object');
      return null;
    }
    return parsedJson;
  } catch (error: unknown) {
    logger.error(`Error fetching API schema from ${url}`, normalizeError(error));
    return null;
  }
}

async function fetchValidatedSchema(
  apiSchemaUrl: string,
  apiKey: string,
): Promise<OpenAPIObject | null> {
  const raw = await fetchSchemaOnlineOrNull(apiSchemaUrl, apiKey);
  if (!raw) {
    return null;
  }
  return validateOpenApiDocument(raw);
}

async function loadSchema(): Promise<LoadedSchema> {
  if (isCiMode) {
    const cached = await readCachedSchemaOrThrow();
    return createOpenCurriculumSchema(cached);
  }

  const apiSchemaUrl = 'https://open-api.thenational.academy/api/v0/swagger.json';
  const apiKey = process.env.OAK_API_KEY;
  if (apiKey) {
    const live = await fetchValidatedSchema(apiSchemaUrl, apiKey);
    if (live) {
      await writeSchemaCacheIfChanged(schemaCacheFilePath, live);
      logger.info('Schema fetched successfully');
      return createOpenCurriculumSchema(live);
    }
  }

  const cached = await readSchemaCacheOrNull(schemaCacheFilePath);
  if (cached) {
    const validated = validateOpenApiDocument(cached);
    return createOpenCurriculumSchema(validated);
  }

  const validated = await readCachedSchemaOrThrow();
  return createOpenCurriculumSchema(validated);
}
logger.info('Generating type artifacts...');

const { original: originalSchema, validated: validatedSchema, sdk: sdkSchema } = await loadSchema();

// Save the original schema
const originalSchemaPath = path.resolve(outDirectory, 'api-schema-original.json');
saveSchemaToFile(originalSchema, originalSchemaPath);
logger.info('Original schema saved', { path: path.relative(process.cwd(), originalSchemaPath) });

logger.info('Creating SDK schema with oakUrl and upstream canonicalUrl fields...');

// Use the SDK schema for generation
await generateSchemaArtifacts(validatedSchema, sdkSchema, outDirectory);

logger.info('Generating widget constants...');
generateWidgetConstants(logger);

logger.info('Generating subject hierarchy...');
generateSubjectHierarchy(logger);

// Post-generation: run sitemap reference integrity validation.
// Invalid URLs emit warnings (not errors) — this is intentionally a soft phase
// while we build confidence in the validation layer. See the integration plan
// WS2.2 for the decision to start warn-only before making it a hard gate.
const sitemapRefPath = path.resolve(rootDirectory, 'reference/canonical-url-map.json');
const validation = runSitemapValidation(sitemapRefPath);
if (!validation.ok) {
  const refError = validation.error;
  if (refError.kind === 'invalid_json') {
    logger.warn('Sitemap reference validation skipped — reference file has invalid JSON', {
      path: refError.path,
      cause: refError.cause,
    });
  } else if (refError.kind === 'unsorted_paths') {
    logger.warn('Sitemap reference validation skipped — reference file has unsorted teacherPaths', {
      path: refError.path,
    });
  } else if (refError.kind === 'schema_mismatch') {
    logger.warn('Sitemap reference validation skipped — reference file schema mismatch', {
      path: refError.path,
    });
  } else {
    logger.info(
      'Sitemap reference validation skipped — reference file not found. ' +
        'Run `pnpm -F @oaknational/sdk-codegen scan:sitemap` in an online environment to enable validation.',
      {
        path: refError.path,
      },
    );
  }
} else {
  const { sequenceValidation, programmeValidation, generatedAt } = validation.value;
  logger.info('Sitemap reference URL validation complete', {
    referenceAge: generatedAt,
    sequences: `${String(sequenceValidation.validCount)}/${String(sequenceValidation.total)} valid`,
    programmes: `${String(programmeValidation.validCount)}/${String(programmeValidation.total)} valid`,
  });
  if (sequenceValidation.invalidCount > 0) {
    logger.warn('Invalid sequence URLs detected', {
      count: sequenceValidation.invalidCount,
      urls: sequenceValidation.invalidUrls.slice(0, 10),
    });
  }
  if (programmeValidation.invalidCount > 0) {
    logger.warn('Invalid programme URLs detected', {
      count: programmeValidation.invalidCount,
      urls: programmeValidation.invalidUrls.slice(0, 10),
    });
  }
}

logger.info('Type generation complete!');
logger.info('MCP tools generated from schema!');
