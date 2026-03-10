/**
 * Validate generated canonical URLs against the OWA sitemap reference map.
 *
 * Uses binary search against the sorted `teacherPaths` array from the
 * reference map to determine whether a generated canonical URL points to
 * a real page on the live site.
 *
 * @remarks
 * The sitemap is a superset validation layer — a URL absent from the
 * sitemap is definitely wrong, but presence in the sitemap does not
 * guarantee the URL is reachable from the API. See ADR-132 for known
 * sitemap coverage gaps.
 *
 * @see sitemap-scanner-types.ts for the reference map schema
 * @see ADR-132 for the sitemap scanner design
 */

import { readFileSync } from 'node:fs';
import { ok, err, type Result } from '@oaknational/result';
import type { SitemapScanOutput } from '../../sitemap-scanner-types.js';

/** Result of validating a single URL against the reference map. */
export type UrlValidationResult =
  | { readonly valid: true }
  | { readonly valid: false; readonly reason: string };

/** Summary of validating a batch of generated URLs. */
export interface ValidationSummary {
  readonly total: number;
  readonly validCount: number;
  readonly invalidCount: number;
  readonly invalidUrls: readonly string[];
}

/** Typed error for `loadSitemapReference` with discriminated `kind` field. */
export type SitemapRefError =
  | { readonly kind: 'file_not_found'; readonly path: string; readonly cause: string }
  | { readonly kind: 'invalid_json'; readonly path: string; readonly cause: string }
  | { readonly kind: 'schema_mismatch'; readonly path: string }
  | { readonly kind: 'unsorted_paths'; readonly path: string };

/**
 * Binary search for a target in a sorted readonly array.
 *
 * Uses direct string comparison (`<`, `>`, `===`) to match the default
 * unicode sort order produced by `Array.prototype.sort()`. Do NOT use
 * `localeCompare` — locale-sensitive collation may diverge from unicode
 * byte order, causing silent false positives/negatives.
 *
 * @returns `true` if target is found, `false` otherwise.
 */
function binarySearch(sorted: readonly string[], target: string): boolean {
  let lo = 0;
  let hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const entry = sorted[mid];
    if (entry === undefined) {
      return false;
    }
    if (entry === target) {
      return true;
    }
    if (entry < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return false;
}

/**
 * Validate a single URL path against a sorted array of known teacher paths.
 *
 * @param path - The URL path to validate (relative, e.g. `/teachers/lessons/foo`)
 * @param teacherPaths - Sorted array of all known teacher paths from the sitemap
 * @returns Validation result indicating whether the path was found
 */
export function validateUrl(path: string, teacherPaths: readonly string[]): UrlValidationResult {
  if (teacherPaths.length === 0) {
    return { valid: false, reason: 'Reference paths array is empty — cannot validate' };
  }
  if (binarySearch(teacherPaths, path)) {
    return { valid: true };
  }
  return { valid: false, reason: `Path not found in sitemap reference: ${path}` };
}

/**
 * Validate a batch of generated URL paths against the sitemap reference.
 *
 * @param urls - Array of generated URL paths to validate
 * @param teacherPaths - Sorted array of all known teacher paths
 * @returns Summary with counts and list of invalid URLs
 */
export function validateGeneratedUrls(
  urls: readonly string[],
  teacherPaths: readonly string[],
): ValidationSummary {
  const invalidUrls: string[] = [];
  let validCount = 0;

  for (const url of urls) {
    const result = validateUrl(url, teacherPaths);
    if (result.valid) {
      validCount++;
    } else {
      invalidUrls.push(url);
    }
  }

  return {
    total: urls.length,
    validCount,
    invalidCount: invalidUrls.length,
    invalidUrls,
  };
}

/**
 * Type guard validating all fields consumed by `runSitemapValidation`.
 *
 * Checks every field actually destructured downstream, not just
 * `teacherPaths`. This prevents runtime crashes from partial JSON
 * at the external data boundary (ADR-034).
 */
function isSitemapScanOutput(value: unknown): value is SitemapScanOutput {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  return (
    'teacherPaths' in value &&
    Array.isArray(value.teacherPaths) &&
    'generatedAt' in value &&
    typeof value.generatedAt === 'string' &&
    'sequenceSlugs' in value &&
    Array.isArray(value.sequenceSlugs) &&
    'programmeSlugs' in value &&
    Array.isArray(value.programmeSlugs) &&
    'lessonSlugs' in value &&
    Array.isArray(value.lessonSlugs)
  );
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
    return err({ kind: 'file_not_found', path: refPath, cause: String(e) });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return err({ kind: 'invalid_json', path: refPath, cause: String(e) });
  }

  if (!isSitemapScanOutput(parsed)) {
    return err({ kind: 'schema_mismatch', path: refPath });
  }

  // Binary search requires sorted input — verify the invariant.
  // An unsorted teacherPaths array would cause silent false results.
  const paths = parsed.teacherPaths;
  for (let i = 1; i < paths.length; i++) {
    const prev = paths[i - 1];
    const curr = paths[i];
    if (prev !== undefined && curr !== undefined && prev > curr) {
      return err({ kind: 'unsorted_paths', path: refPath });
    }
  }

  return ok(parsed);
}

/** Full validation report from `runSitemapValidation`. */
export interface SitemapValidationReport {
  readonly generatedAt: string;
  readonly sequenceValidation: ValidationSummary;
  readonly programmeValidation: ValidationSummary;
}

/**
 * Run end-to-end sitemap validation: load the reference map, construct
 * URLs from the slug data using the generator's URL patterns, and
 * validate them against `teacherPaths`.
 *
 * @param refPath - Path to `canonical-url-map.json`
 * @returns Ok with a validation report, or Err if the reference file
 *   cannot be loaded
 */
export function runSitemapValidation(
  refPath: string,
): Result<SitemapValidationReport, SitemapRefError> {
  const loaded = loadSitemapReference(refPath);
  if (!loaded.ok) {
    return loaded;
  }

  const { teacherPaths, sequenceSlugs, programmeSlugs, generatedAt } = loaded.value;

  const sequenceUrls = sequenceSlugs.map((slug) => `/teachers/curriculum/${slug}/units`);
  const programmeUrls = programmeSlugs.map((slug) => `/teachers/programmes/${slug}/units`);

  return ok({
    generatedAt,
    sequenceValidation: validateGeneratedUrls(sequenceUrls, teacherPaths),
    programmeValidation: validateGeneratedUrls(programmeUrls, teacherPaths),
  });
}
