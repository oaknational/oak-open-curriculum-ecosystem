import path from 'node:path';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { OpenAPIObject } from 'openapi3-ts/oas30';
import { isPlainObject, getOwnString, getOwnValue } from '../src/types/helpers.js';
import { generateZodClientFromOpenAPI } from 'openapi-zod-client';

// Small helper type guards to keep complexity low and avoid assertions
function isOpenAPIInfo(value: unknown): value is { title: string; version: string } {
  if (!isPlainObject(value)) return false;
  const title = getOwnString(value, 'title');
  const version = getOwnString(value, 'version');
  return typeof title === 'string' && typeof version === 'string';
}

// Type guard: validate we have a minimal OpenAPIObject shape without using assertions
function isOpenAPIObject(doc: unknown): doc is OpenAPIObject {
  if (!isPlainObject(doc)) return false;
  const openapi = getOwnString(doc, 'openapi');
  if (typeof openapi !== 'string') return false;
  const paths = getOwnValue(doc, 'paths');
  if (!isPlainObject(paths)) return false;
  const info = getOwnValue(doc, 'info');
  if (!isOpenAPIInfo(info)) return false;
  return true;
}

export async function generateZodSchemasArtifacts(
  openApiDoc: unknown,
  outDir: string,
): Promise<void> {
  if (!isOpenAPIObject(openApiDoc)) {
    throw new TypeError('Invalid OpenAPI document passed to generateZodSchemasArtifacts');
  }

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Resolve ozc built-in schemas-only template from node_modules
  const require = createRequire(import.meta.url);
  const ozcPkgDir = path.dirname(require.resolve('openapi-zod-client/package.json'));
  const templatePath = path.join(ozcPkgDir, 'src/templates/schemas-only.hbs');
  const outFile = path.join(outDir, 'schemas.ts');

  const output = await generateZodClientFromOpenAPI({
    openApiDoc,
    templatePath,
    distPath: outFile,
    // Ensure we export all component schemas and corresponding types
    options: {
      shouldExportAllSchemas: true,
      shouldExportAllTypes: true,
      groupStrategy: 'none',
      withAlias: false,
    },
  });

  // When distPath is provided, ozc writes the file. Some versions also return the string; persist if returned.
  if (typeof output === 'string') {
    writeFileSync(outFile, output);
  }
}

/**
 * Generates Zod endpoint definitions with parameter schemas from an OpenAPI document.
 * Uses the default template to generate complete endpoint definitions including request parameters.
 * @param openApiDoc - The OpenAPI document to generate from
 * @param outDir - The output directory for generated files
 * @throws {TypeError} If the OpenAPI document is invalid
 */
export async function generateZodEndpointsArtifacts(
  openApiDoc: unknown,
  outDir: string,
): Promise<void> {
  if (!isOpenAPIObject(openApiDoc)) {
    throw new TypeError('Invalid OpenAPI document passed to generateZodEndpointsArtifacts');
  }

  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Resolve ozc built-in default template from node_modules
  const require = createRequire(import.meta.url);
  const ozcPkgDir = path.dirname(require.resolve('openapi-zod-client/package.json'));
  const templatePath = path.join(ozcPkgDir, 'src/templates/default.hbs');
  const outFile = path.join(outDir, 'endpoints.ts');

  const output = await generateZodClientFromOpenAPI({
    openApiDoc,
    templatePath,
    distPath: outFile,
    // Configure for endpoint generation with parameter schemas
    options: {
      shouldExportAllSchemas: true,
      shouldExportAllTypes: true,
      groupStrategy: 'none',
      withAlias: false,
    },
  });

  // When distPath is provided, ozc writes the file. Some versions also return the string; persist if returned.
  if (typeof output === 'string') {
    writeFileSync(outFile, output);
  }

  // Post-process the generated file to export the endpoints array
  // This allows us to programmatically access endpoint definitions
  const generatedContent = existsSync(outFile) ? readFileSync(outFile, 'utf-8') : '';
  if (
    typeof generatedContent === 'string' &&
    generatedContent.includes('const endpoints = makeApi')
  ) {
    const modifiedContent = generatedContent.replace(
      'const endpoints = makeApi',
      'export const endpoints = makeApi',
    );
    writeFileSync(outFile, modifiedContent);
  }
}
