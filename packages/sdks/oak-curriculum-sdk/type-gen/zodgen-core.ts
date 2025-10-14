import path from 'node:path';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { generateZodClientFromOpenAPI } from 'openapi-zod-client';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

// Small helper type guards to keep complexity low and avoid assertions
/**
 * Generates Zod endpoint definitions with parameter schemas from an OpenAPI document.
 * Uses the default template to generate complete endpoint definitions including request parameters.
 * @param rawSchema - The OpenAPI document to generate from (unknown input validated internally)
 * @param outDir - The output directory for generated files
 * @throws {TypeError} If the OpenAPI document is invalid
 */
export async function generateZodSchemas(openApiDoc: OpenAPIObject, outDir: string): Promise<void> {
  if (!existsSync(outDir)) {
    mkdirSync(outDir, { recursive: true });
  }

  // Resolve ozc built-in default template from node_modules
  const require = createRequire(import.meta.url);
  const ozcPkgDir = path.dirname(require.resolve('openapi-zod-client/package.json'));
  const templatePath = path.join(ozcPkgDir, 'src/templates/default.hbs');
  const outFile = path.join(outDir, 'curriculumZodSchemas.ts');

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
  console.log('✅ Zod schemas generated');

  // Modify the generated file to export the schemas
  console.log('🔍 Modifying file to export the endpoints');
  const withTypedImport = output.replace(
    'import { z } from "zod";',
    'import { z, type ZodSchema } from "zod";',
  );
  const withExportedEndpoints = withTypedImport.replace(
    /const endpoints = makeApi/g,
    'export const endpoints = makeApi',
  );

  const schemasPattern = /export const schemas = {[\s\S]*?};/;
  const modifiedContent = withExportedEndpoints.replace(schemasPattern, (substring) => {
    const body = substring.replace('export const schemas = ', '').replace(';', '');
    return [
      'export type CurriculumSchemaCollection = Record<string, ZodSchema>;',
      'const renameInlineSchema = (original: string) => {\n  if (original === "changelog_changelog_200") {\n    return "ChangelogResponseSchema";\n  }\n  if (original === "changelog_latest_200") {\n    return "ChangelogLatestResponseSchema";\n  }\n  return original.replace(/[^A-Za-z0-9_]/g, "_");\n};',
      'const rawCurriculumSchemas = ' + body + ' as const satisfies CurriculumSchemaCollection;',
      'function buildCurriculumSchemas(endpoints: ReturnType<typeof makeApi>): CurriculumSchemaCollection {\n  const baseSchemas = sanitizeSchemaKeys(rawCurriculumSchemas, { rename: renameInlineSchema });\n  const changelogEndpoint = endpoints.find((candidate) => candidate.method === "get" && candidate.path === "/changelog");\n  const latestEndpoint = endpoints.find((candidate) => candidate.method === "get" && candidate.path === "/changelog/latest");\n  if (!changelogEndpoint && !latestEndpoint) {\n    return baseSchemas;\n  }\n  const additionalSchemas: CurriculumSchemaCollection = {};\n  if (changelogEndpoint) {\n    additionalSchemas["changelog_changelog_200"] = changelogEndpoint.response;\n  }\n  if (latestEndpoint) {\n    additionalSchemas["changelog_latest_200"] = latestEndpoint.response;\n  }\n  return {\n    ...baseSchemas,\n    ...additionalSchemas,\n  };\n}',
    ].join('\n\n');
  });

  const schemaMetadata = `const curriculumSchemaCollection = buildCurriculumSchemas(endpoints);
const curriculumSchemaNames = Object.keys(curriculumSchemaCollection);
const curriculumSchemaValues: readonly z.ZodTypeAny[] = Object.values(curriculumSchemaCollection);

export const curriculumSchemas = curriculumSchemaCollection;

/**
 * Registry map keyed by generated curriculum schema names.
 * @public
 */
export type CurriculumSchemaRegistry = typeof curriculumSchemas;

/**
 * Valid curriculum schema names derived from the OpenAPI specification.
 * @public
 */
export type CurriculumSchemaName = keyof CurriculumSchemaRegistry;

/**
 * Concrete Zod schema definition for a curriculum schema name.
 * @public
 */
export type CurriculumSchemaDefinition<Name extends CurriculumSchemaName = CurriculumSchemaName> = CurriculumSchemaRegistry[Name];

export function isCurriculumSchemaName(value: unknown): value is CurriculumSchemaName {
  return typeof value === 'string' && curriculumSchemaNames.includes(value);
}

export function isCurriculumSchema(value: unknown): value is CurriculumSchemaDefinition {
  if (!(value instanceof z.ZodType)) {
    return false;
  }
  return curriculumSchemaValues.includes(value);
}`;

  const withCurriculumSchemas = modifiedContent.replace(
    'export const api = new Zodios(endpoints);',
    `${schemaMetadata}\n\nexport const api = new Zodios(endpoints);`,
  );

  const sanitizedContent = withCurriculumSchemas.replace(
    'import { z, type ZodSchema } from "zod";',
    'import { z, type ZodSchema } from "zod";\n\nfunction sanitizeSchemaKeys<T extends Record<string, ZodSchema>>(schemas: T, options?: { readonly rename?: (original: string) => string }): T {\n  const rename = options?.rename ?? ((value: string) => value.replace(/[^A-Za-z0-9_]/g, "_"));\n  const entries = Object.entries(schemas).map(([key, value]) => {\n    const sanitized = rename(key);\n    return [sanitized, value] as const;\n  });\n  return Object.fromEntries(entries) as T;\n}\n',
  );

  console.log('📝 Writing to file: ', outFile);

  writeFileSync(outFile, sanitizedContent);
}
