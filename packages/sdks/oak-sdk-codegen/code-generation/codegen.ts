#!/usr/bin/env node

/**
 * This script generates the types for the API schema.
 *
 * It generates the schema artefacts at the head of the pipeline:
 * - api-schema-original.json - The schema as returned from the API (pure, undecorated,
 *   every upstream path present)
 * - api-schema-sdk.json - The SDK-decorated schema (e.g., oakUrl plus upstream
 *   canonicalUrl), minus DEFERRED_PATHS (see ./excluded-paths.ts)
 * - api-paths-types.ts - The OpenAPI-TS types for the SDK schema, for use with OpenAPI-Fetch
 * - path-parameters.ts - The tuples, types and type guards for the path parameters, for use
 *   in dynamically constructing API requests
 *
 * api-schema-sdk.json is the input to every downstream generator (OpenAPI-TS types, Zod
 * schemas, MCP tools, parameter and response maps), so each inherits the DEFERRED_PATHS
 * exclusion. api-schema-original.json — here and in the committed schema-cache/ copy —
 * stays verbatim upstream truth, so the schema-drift check and the refresh runbook keep
 * comparing like with like. ./excluded-paths.ts declares both exclusion sets with their
 * scope and lifetime; read it before treating a schema-vs-generated-surface gap as drift.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { generateSchemaArtifacts } from './codegen-core.js';
import { writeSchemaCacheIfChanged } from './schema-cache.js';
import { createOpenCurriculumSchema } from './schema-separation-core.js';
import { validateOpenApiDocument } from './schema-validator.js';
import { generateWidgetConstants, generateSubjectHierarchy } from './typegen/index.js';
import { runSitemapValidation } from './typegen/routing/validate-canonical-urls.js';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import { createCodegenLogger } from './create-codegen-logger.js';
import { resolveSchemaSource } from './resolve-schema-source.js';
import { nodeFileSystem } from '../src/io/node-file-system.js';

const logger = createCodegenLogger('codegen');

const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(thisDirectory, '..');
const outPathFromRoot = 'src/types/generated/api-schema';
const outDirectory = path.resolve(rootDirectory, outPathFromRoot);

// Determine the schema source: the committed cache is the source for every
// build environment (hermetic, deterministic, no network); online refresh is
// opt-in via --online or SDK_CODEGEN_MODE=online. See resolve-schema-source.ts.
const schemaSource = resolveSchemaSource({
  args: process.argv.slice(2),
  sdkCodegenMode: process.env.SDK_CODEGEN_MODE,
});

// The committed cache of the original schema is the default build input
const schemaCacheFilePath = path.resolve(rootDirectory, 'schema-cache/api-schema-original.json');

interface LoadedSchema {
  readonly original: OpenAPIObject;
  readonly sdk: OpenAPIObject;
}

async function readCachedSchemaOrThrow(): Promise<OpenAPIObject> {
  if (!existsSync(schemaCacheFilePath)) {
    throw new Error(
      `Code generation reads the cached SDK schema by default, but none was found at ${schemaCacheFilePath}. ` +
        `Run "pnpm sdk-codegen:refresh" to fetch the cache ` +
        `from upstream and rebuild, then commit the result.`,
    );
  }
  logger.info('Using cached original OpenAPI schema', { path: schemaCacheFilePath });
  const raw = await readFile(schemaCacheFilePath, 'utf8');
  const parsed: unknown = JSON.parse(raw);
  return validateOpenApiDocument(parsed);
}

async function fetchSchemaOnline(url: string): Promise<object> {
  logger.info('Fetching OpenAPI schema', { url });
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) {
    const status = String(response.status);
    const statusText = response.statusText;
    throw new Error(`Failed to fetch OpenAPI schema: HTTP ${status} ${statusText} from ${url}`);
  }
  const parsedJson: unknown = await response.json();
  if (parsedJson === null || typeof parsedJson !== 'object') {
    throw new Error('OpenAPI schema response was not an object');
  }
  return parsedJson;
}

async function fetchValidatedSchema(apiSchemaUrl: string): Promise<OpenAPIObject> {
  const raw = await fetchSchemaOnline(apiSchemaUrl);
  return validateOpenApiDocument(raw);
}

async function loadSchema(): Promise<LoadedSchema> {
  if (schemaSource === 'cached') {
    const cached = await readCachedSchemaOrThrow();
    return createOpenCurriculumSchema(cached);
  }

  const apiSchemaUrl = 'https://open-api.thenational.academy/api/v0/swagger.json';
  const live = await fetchValidatedSchema(apiSchemaUrl);
  await writeSchemaCacheIfChanged(schemaCacheFilePath, live, logger, nodeFileSystem);
  logger.info('Schema fetched successfully');
  return createOpenCurriculumSchema(live);
}
logger.info('Generating type artifacts...');

const { original: originalSchema, sdk: sdkSchema } = await loadSchema();

logger.info('Creating SDK schema with oakUrl and upstream canonicalUrl fields...');

// api-schema-original.json is written once, inside generateSchemaArtifacts, from the
// unfiltered original; the sdk document (minus DEFERRED_PATHS) drives everything else.
await generateSchemaArtifacts(originalSchema, sdkSchema, outDirectory, nodeFileSystem);

logger.info('Generating widget constants...');
generateWidgetConstants(logger);

logger.info('Generating subject hierarchy...');
generateSubjectHierarchy(logger);

// Post-generation: run sitemap reference integrity validation.
// Invalid URLs emit warnings (not errors) — this is intentionally a soft phase
// while we build confidence in the validation layer. See the integration plan
// WS2.2 for the decision to start warn-only before making it a hard gate.
const sitemapRefPath = path.resolve(rootDirectory, 'reference/canonical-url-map.json');
const validation = await runSitemapValidation(sitemapRefPath, nodeFileSystem);
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
