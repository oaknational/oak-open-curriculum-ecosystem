/**
 * Validate sitemap reference URL construction patterns against the OWA sitemap map.
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

import { ok, type Result } from '@oaknational/result';
import { loadSitemapReference, type SitemapRefError } from './sitemap-reference.js';
import { binarySearchSortedPaths } from './teacher-path-lookups.js';

export { loadSitemapReference, type SitemapRefError } from './sitemap-reference.js';

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
  if (binarySearchSortedPaths(teacherPaths, path)) {
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
      continue;
    }

    invalidUrls.push(url);
  }

  return {
    total: urls.length,
    validCount,
    invalidCount: invalidUrls.length,
    invalidUrls,
  };
}

/** Full validation report from `runSitemapValidation`. */
export interface SitemapValidationReport {
  readonly generatedAt: string;
  readonly sequenceValidation: ValidationSummary;
  readonly programmeValidation: ValidationSummary;
}

/**
 * Run sitemap reference integrity validation: load the reference map,
 * construct URLs from reference slugs using generator URL patterns, and
 * validate those URLs against reference `teacherPaths`.
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
