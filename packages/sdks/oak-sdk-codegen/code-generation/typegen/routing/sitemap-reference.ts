import { readFileSync } from 'node:fs';
import { err, ok, type Result } from '@oaknational/result';
import type { SitemapScanOutput } from '../../sitemap-scanner-types.js';

/** Typed error for loading `canonical-url-map.json`. */
export type SitemapRefError =
  | { readonly kind: 'file_not_found'; readonly path: string; readonly cause: string }
  | { readonly kind: 'invalid_json'; readonly path: string; readonly cause: string }
  | { readonly kind: 'schema_mismatch'; readonly path: string }
  | { readonly kind: 'unsorted_paths'; readonly path: string };

function hasStringArray(field: unknown): field is readonly string[] {
  return Array.isArray(field) && Array.from(field).every((item) => typeof item === 'string');
}

function isSitemapScanOutput(value: unknown): value is SitemapScanOutput {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  return (
    'teacherPaths' in value &&
    hasStringArray(value.teacherPaths) &&
    'generatedAt' in value &&
    typeof value.generatedAt === 'string' &&
    'sequenceSlugs' in value &&
    hasStringArray(value.sequenceSlugs) &&
    'programmeSlugs' in value &&
    hasStringArray(value.programmeSlugs) &&
    'lessonSlugs' in value &&
    hasStringArray(value.lessonSlugs)
  );
}

function hasSortedTeacherPaths(paths: readonly string[]): boolean {
  for (let i = 1; i < paths.length; i++) {
    const previous = paths[i - 1];
    const current = paths[i];

    if (previous !== undefined && current !== undefined && previous > current) {
      return false;
    }
  }

  return true;
}

/**
 * Load and validate the sitemap reference map from disk.
 *
 * @param refPath - Absolute path to `canonical-url-map.json`
 * @returns Ok with the parsed output, or Err with a typed `SitemapRefError`
 */
export function loadSitemapReference(refPath: string): Result<SitemapScanOutput, SitemapRefError> {
  let raw: string;
  try {
    raw = readFileSync(refPath, 'utf-8');
  } catch (e) {
    return err({
      kind: 'file_not_found',
      path: refPath,
      cause: e instanceof Error ? e.message : String(e),
    });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return err({
      kind: 'invalid_json',
      path: refPath,
      cause: e instanceof Error ? e.message : String(e),
    });
  }

  if (!isSitemapScanOutput(parsed)) {
    return err({ kind: 'schema_mismatch', path: refPath });
  }

  if (!hasSortedTeacherPaths(parsed.teacherPaths)) {
    return err({ kind: 'unsorted_paths', path: refPath });
  }

  return ok(parsed);
}
