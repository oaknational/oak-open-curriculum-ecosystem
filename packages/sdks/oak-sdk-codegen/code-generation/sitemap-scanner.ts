#!/usr/bin/env node

/**
 * Sitemap scanner for Oak teacher-facing canonical URL validation.
 *
 * @remarks
 * Fetches the OWA sitemap index, discovers teacher-facing sub-sitemaps,
 * extracts all teacher URL paths, categorises them by route type, and
 * writes a reference map to `reference/canonical-url-map.json`.
 *
 * The reference map provides a **superset** of all valid teacher-facing
 * URLs on the live site. Canonical URLs constructed from the API can be
 * validated against this list — any URL not present is instantly rejected.
 *
 * Usage:
 *   pnpm -F \@oaknational/sdk-codegen scan:sitemap            # Scan and write reference map
 *   pnpm -F \@oaknational/sdk-codegen scan:sitemap -- --validate  # Exit non-zero if patterns missing
 *
 * @see ADR-047 Canonical URL Generation at Codegen Time
 * @see ADR-132 Sitemap Scanner for Canonical URL Validation
 */

import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { ok, err, type Result } from '@oaknational/result';
import { createCodegenLogger } from './create-codegen-logger.js';
import { extractLocs, categoriseTeacherPaths, validateScanResult } from './sitemap-scanner-core.js';
import type { SitemapScanOutput } from './sitemap-scanner-types.js';

const logger = createCodegenLogger('sitemap-scanner');

const SITEMAP_INDEX_URL = 'https://www.thenational.academy/sitemap.xml';
const BASE_URL = 'https://www.thenational.academy';
const FETCH_TIMEOUT_MS = 15_000;

const thisDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(thisDirectory, '..');
const referenceDirectory = path.resolve(rootDirectory, 'reference');
const outPath = path.resolve(referenceDirectory, 'canonical-url-map.json');

/**
 * Fetch text content with exponential backoff and content-type validation.
 *
 * @param url - URL to fetch
 * @param maxAttempts - Maximum number of attempts before returning an error
 * @returns Result containing response body text or an Error
 */
async function fetchText(url: string, maxAttempts = 3): Promise<Result<string, Error>> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (attempt > 0) {
      const baseDelay = 250;
      const delayMs = baseDelay * Math.pow(2, attempt) + Math.random() * baseDelay;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    try {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });

      if (!response.ok) {
        lastError = new Error(`HTTP ${String(response.status)} ${response.statusText}`);
        continue;
      }

      const contentType = response.headers.get('content-type') ?? '';
      const text = await response.text();

      if (!contentType.includes('xml') && !text.trimStart().startsWith('<?xml')) {
        return err(new Error(`Expected XML content, got content-type: ${contentType}`));
      }

      return ok(text);
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  return err(lastError ?? new Error('Fetch failed with no error details'));
}

/**
 * Discover teacher-facing sub-sitemaps from the sitemap index.
 *
 * @param indexUrl - URL of the sitemap index
 * @returns Result containing teacher sub-sitemap URLs or an Error
 */
async function discoverTeacherSitemaps(indexUrl: string): Promise<Result<string[], Error>> {
  logger.info('Scanning sitemap index', { url: indexUrl });
  const rootXmlResult = await fetchText(indexUrl);
  if (!rootXmlResult.ok) {
    return rootXmlResult;
  }
  const allLocs = extractLocs(rootXmlResult.value);
  return ok(allLocs.filter((url) => url.includes('/teachers/')));
}

/**
 * Fetch all teacher URL paths from the discovered sub-sitemaps.
 *
 * @param sitemapUrls - Sub-sitemap URLs to fetch
 * @param base - Base URL to strip from absolute URLs to produce paths
 * @returns Paths and the count of failed sitemap fetches
 */
async function fetchTeacherPaths(
  sitemapUrls: readonly string[],
  base: string,
): Promise<{ paths: string[]; failedCount: number }> {
  const teacherUrls = new Set<string>();
  let failedCount = 0;

  for (const sitemapUrl of sitemapUrls) {
    const result = await fetchText(sitemapUrl);
    if (!result.ok) {
      failedCount += 1;
      logger.warn('Failed to read sitemap', { url: sitemapUrl, error: result.error.message });
      continue;
    }
    for (const loc of extractLocs(result.value)) {
      if (loc.includes('/teachers/')) {
        teacherUrls.add(loc);
      }
    }
  }

  const paths = [...teacherUrls].map((url) =>
    url.startsWith(base) ? url.slice(base.length) : url,
  );

  return { paths, failedCount };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const validateMode = args.includes('--validate');

  const sitemapsResult = await discoverTeacherSitemaps(SITEMAP_INDEX_URL);
  if (!sitemapsResult.ok) {
    logger.error('Failed to discover sitemaps', { error: sitemapsResult.error.message });
    process.exit(1);
  }

  const teacherSitemaps = sitemapsResult.value;
  logger.info('Found teacher sub-sitemaps', { count: teacherSitemaps.length });

  const { paths, failedCount } = await fetchTeacherPaths(teacherSitemaps, BASE_URL);
  logger.info('Extracted teacher paths', { count: paths.length, failedSitemaps: failedCount });

  if (failedCount > 0 && failedCount > teacherSitemaps.length * 0.2) {
    logger.error('Too many sitemap fetches failed — reference data would be incomplete', {
      failed: failedCount,
      total: teacherSitemaps.length,
    });
    process.exit(1);
  }

  const categorisation = categoriseTeacherPaths(paths);

  const output: SitemapScanOutput = {
    generatedAt: new Date().toISOString(),
    base: BASE_URL,
    ...categorisation,
  };

  await mkdir(referenceDirectory, { recursive: true });
  await writeFile(outPath, JSON.stringify(output, null, 2), 'utf8');
  logger.info('Wrote reference map', { path: path.relative(process.cwd(), outPath) });
  logger.info('Totals', output.totals);

  if (validateMode) {
    const errors = validateScanResult(categorisation);
    if (errors.length > 0) {
      logger.error('Validation failed');
      for (const error of errors) {
        logger.error(error);
      }
      process.exit(1);
    }
    logger.info('Validation passed — canonical URL patterns present in sitemap');
  }
}

main().catch((error: unknown) => {
  logger.error('Sitemap scan failed', error);
  process.exit(1);
});
