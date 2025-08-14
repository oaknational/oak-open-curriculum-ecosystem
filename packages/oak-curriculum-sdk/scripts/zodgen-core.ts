import path from 'node:path';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { OpenAPIObject } from 'openapi3-ts';
import { generateZodClientFromOpenAPI } from 'openapi-zod-client';

// Small helper type guards to keep complexity low and avoid assertions
function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function hasStringProp(o: Record<string, unknown>, key: string): boolean {
  return typeof o[key] === 'string';
}

function isOpenAPIInfo(value: unknown): value is { title: string; version: string } {
  if (!isNonNullObject(value)) return false;
  return hasStringProp(value, 'title') && hasStringProp(value, 'version');
}

// Type guard: validate we have a minimal OpenAPIObject shape without using assertions
function isOpenAPIObject(doc: unknown): doc is OpenAPIObject {
  if (!isNonNullObject(doc)) return false;
  const o = doc;
  if (!hasStringProp(o, 'openapi')) return false;
  if (!isNonNullObject(o.paths)) return false;
  if (!isOpenAPIInfo(o.info)) return false;
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
