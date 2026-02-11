/**
 * Transforms Zod v3 output from openapi-zod-client to Zod v4.
 *
 * This is the SINGLE source of truth for all Zod v3→v4 API transformations.
 * All deprecated types, methods, and dead code are handled here.
 *
 * Transformations performed:
 * - Import path: kept as `"zod"` (consuming packages have `"zod": "^4"`)
 * - Type in imports: `ZodSchema` → `ZodType`
 * - Standalone type usage: `ZodSchema` → `ZodType`
 * - `.passthrough()` removed: enforces strict validation (unknown keys rejected)
 * - Zodios import removal: completely removed @zodios/core dependency
 * - Zodios dead code removal: `export const api`, `createApiClient`
 *
 * Strict schema enforcement:
 * - `.passthrough()` is REMOVED to ensure unknown keys cause validation errors
 * - Combined with `strictObjects: true` in generator options, this ensures
 *   schemas use `.strict()` only - fail fast, never silently ignore keys
 */

/**
 * Transforms a generated code string from Zod v3 to Zod v4.
 *
 * @param zodV3Output - The raw output string from openapi-zod-client (uses Zod v3)
 * @returns Fully Zod v4 compliant code string
 *
 * @example
 * ```typescript
 * const zodV3Code = 'import { z, type ZodSchema } from "zod";';
 * const zodV4Code = transformZodV3ToV4(zodV3Code);
 * // zodV4Code === 'import { z, type ZodType } from "zod";'
 * ```
 */
export function transformZodV3ToV4(zodV3Output: string): string {
  let result = zodV3Output;

  // 1. Transform deprecated ZodSchema type in imports (import path stays as "zod")
  // Handle: import { z, type ZodSchema } from "zod"; → import { z, type ZodType } from "zod";
  result = result.replace(
    /import\s*\{\s*z\s*,\s*type\s+ZodSchema\s*\}\s*from\s*['"]zod['"]/g,
    'import { z, type ZodType } from "zod"',
  );

  // 2. Transform standalone ZodSchema usage to ZodType (not in imports)
  result = result.replace(/\bZodSchema\b/g, 'ZodType');

  // 3. Remove .passthrough() - we want strict validation, not loose parsing
  // With strictObjects: true, openapi-zod-client produces .strict() but may also add
  // .passthrough() for nested objects with additionalProperties not explicitly false.
  // The combination .strict().passthrough() is contradictory - we want only .strict().
  // Note: .passthrough() is Zod v3 syntax; in v4 it's .loose() but we remove it entirely.
  result = result.replace(/\.passthrough\(\)/g, '');

  // 4. Remove entire Zodios import (we don't use @zodios/core types to avoid Zod v3 conflicts)
  result = result.replace(
    /import\s*\{\s*makeApi\s*,\s*Zodios\s*,\s*type\s+ZodiosOptions\s*\}\s*from\s*["']@zodios\/core["'];?\n?/g,
    '',
  );
  // Also remove any remaining makeApi-only import
  result = result.replace(/import\s*\{\s*makeApi\s*\}\s*from\s*["']@zodios\/core["'];?\n?/g, '');
  // Replace makeApi([...]) with plain array
  result = result.replace(/\bmakeApi\s*\(/g, '(');

  // 5. Remove dead Zodios exports
  result = result.replace(/export const api = new Zodios\(endpoints\);?\n?/g, '');
  result = result.replace(
    /export function createApiClient\(baseUrl: string, options\?: ZodiosOptions\) \{[\s\S]*?return new Zodios\(baseUrl, endpoints, options\);\s*\}\n?/g,
    '',
  );

  return result;
}
