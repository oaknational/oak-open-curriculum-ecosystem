import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import type { OpenAPIObject } from 'openapi3-ts/oas31';

import { validateOpenApiDocument } from './schema-validator.js';

/**
 * Minimal structural logger contract for {@link writeSchemaCacheIfChanged}.
 *
 * Intentionally narrower than `@oaknational/logger`'s `Logger` type so
 * that test fakes do not need to implement the full logger surface.
 * Production callers pass the shared codegen logger (which trivially
 * satisfies this contract); tests pass a spy-backed object satisfying
 * just `warn`.
 */
export interface SchemaCacheLogger {
  warn(message: string, context?: Record<string, unknown>): void;
}

function isOpenAPIObject(value: unknown): value is OpenAPIObject {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return 'openapi' in value && 'info' in value && 'paths' in value;
}

export async function readSchemaCacheOrNull(cachePath: string): Promise<OpenAPIObject | null> {
  if (!existsSync(cachePath)) {
    return null;
  }
  try {
    const raw = await readFile(cachePath, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (!isOpenAPIObject(parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Writes the schema to the cache if the content has changed.
 *
 * Compares the full serialised content, not just the version string.
 * The upstream API can fix descriptions, add parameters, or change
 * metadata without bumping the version — a version-only check misses
 * those changes and leaves the cache stale.
 *
 * @remarks **Trust-boundary attestation (CodeQL `js/http-to-file-access`
 * #76/#77).** The schema crosses a network trust boundary upstream of
 * this function. A structural validator (`validateOpenApiDocument` in
 * `schema-validator.ts`) is invoked here as defence-in-depth, adjacent
 * to the file-system write — even though the same validator already
 * runs at the upstream fetch site (`fetchValidatedSchema` →
 * `codegen.ts:83`) and on the read path (`codegen.ts:61`). Three
 * independent attestations are intentional: the write site is the
 * boundary CodeQL examines, and the validator presence here makes
 * that attestation legible at the boundary itself.
 *
 * On validation failure: emit a structured warning via the injected
 * logger and return `false` (cache untouched). The caller's downstream
 * codegen will still throw on the actually-fetched-and-rejected schema
 * with the canonical `validateOpenApiDocument` error message; the
 * warn-and-skip shape preserves that loud failure mode while
 * preventing this site from masking the upstream error with its own
 * `TypeError`.
 *
 * @param schema - Untyped input from the trust boundary; validated
 *   structurally before any file-system write. Production callers pass
 *   `OpenAPIObject` from `fetchValidatedSchema`; tests can pass
 *   intentionally malformed input to exercise the rejection path.
 * @param log - Logger used to surface validation rejections. See
 *   {@link SchemaCacheLogger} for the structural contract.
 *
 * @returns true if the cache was updated, false if unchanged or if
 *   validation rejected the input schema.
 */
export async function writeSchemaCacheIfChanged(
  cachePath: string,
  schema: unknown,
  log: SchemaCacheLogger,
): Promise<boolean> {
  let validated: OpenAPIObject;
  try {
    validated = validateOpenApiDocument(schema);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log.warn('schema-cache: write skipped, schema failed structural validation', {
      reason: message,
    });
    return false;
  }

  const newContent = JSON.stringify(validated, undefined, 2);
  const currentCachedSchema = await readSchemaCacheOrNull(cachePath);
  if (currentCachedSchema === null) {
    await writeFile(cachePath, newContent);
    return true;
  }
  const currentContent = JSON.stringify(currentCachedSchema, undefined, 2);
  if (currentContent === newContent) {
    return false;
  }
  await writeFile(cachePath, newContent);
  return true;
}
