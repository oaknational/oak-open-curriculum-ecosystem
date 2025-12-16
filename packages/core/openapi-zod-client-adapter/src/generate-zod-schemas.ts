/**
 * Wrapper for openapi-zod-client's generateZodClientFromOpenAPI.
 *
 * This module wraps the upstream generator and transforms output to Zod v4.
 * All Zod v3 artefacts are contained within this boundary and never escape.
 *
 * **Strict Mode**: Generated schemas use `.strict()` to enforce that unknown
 * properties cause validation errors, following the "fail fast" principle.
 * Unknown keys are never silently ignored.
 *
 * @packageDocumentation
 */

import path from 'node:path';
import { createRequire } from 'node:module';
import { generateZodClientFromOpenAPI } from 'openapi-zod-client';
import type { OpenAPIObject, PathsObject } from 'openapi3-ts/oas31';
import { transformZodV3ToV4 } from './zod-v3-to-v4-transform.js';

/**
 * Configuration options for generating Zod schemas from OpenAPI.
 */
export interface GenerateZodSchemasOptions {
  /** The OpenAPI document to generate schemas from */
  readonly openApiDoc: OpenAPIObject;
  /** The output file path (used by openapi-zod-client for relative imports) */
  readonly distPath: string;
}

/**
 * Result of generating Zod schemas, with output already transformed to Zod v4.
 */
export interface GenerateZodSchemasResult {
  /** The generated code string, using Zod v4 imports */
  readonly output: string;
}

/**
 * Generates Zod schemas from an OpenAPI document, returning Zod v4 output.
 *
 * This function wraps openapi-zod-client and transforms its Zod v3 output
 * to use Zod v4 imports before returning.
 *
 * @param options - Configuration for schema generation
 * @returns The generated code with Zod v4 imports
 *
 * @example
 * ```typescript
 * import { generateZodSchemasFromOpenAPI } from '@oaknational/openapi-zod-client-adapter';
 *
 * const result = await generateZodSchemasFromOpenAPI({
 *   openApiDoc: myOpenApiSpec,
 *   distPath: './generated/schemas.ts',
 * });
 *
 * // result.output contains Zod v4 code
 * ```
 */
export async function generateZodSchemasFromOpenAPI(
  options: GenerateZodSchemasOptions,
): Promise<GenerateZodSchemasResult> {
  const { openApiDoc, distPath } = options;

  // Resolve openapi-zod-client's built-in default template from node_modules
  const require = createRequire(import.meta.url);
  const ozcPkgDir = path.dirname(require.resolve('openapi-zod-client/package.json'));
  const templatePath = path.join(ozcPkgDir, 'src/templates/default.hbs');

  // openapi-zod-client uses an outdated PathsObject definition
  const openApiDocWithPaths: Parameters<typeof generateZodClientFromOpenAPI>[0]['openApiDoc'] =
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- openapi-zod-client uses an outdated PathsObject definition
    openApiDoc as OpenAPIObject & { paths: PathsObject };

  // Call openapi-zod-client - this generates Zod v3 code with strict schemas
  const zodV3Output = await generateZodClientFromOpenAPI({
    openApiDoc: openApiDocWithPaths,
    templatePath,
    distPath,
    options: {
      shouldExportAllSchemas: true,
      shouldExportAllTypes: true,
      groupStrategy: 'none',
      withAlias: false,
      // Enforce strict object validation: unknown properties cause errors (fail fast)
      strictObjects: true,
      // Disable .passthrough() - we want strict validation, not loose parsing
      additionalPropertiesDefaultValue: false,
    },
  });

  // Transform Zod v3 output to Zod v4
  const zodV4Output = transformZodV3ToV4(zodV3Output);

  return { output: zodV4Output };
}
