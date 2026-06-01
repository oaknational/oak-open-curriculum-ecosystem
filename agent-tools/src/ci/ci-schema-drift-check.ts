/**
 * Advisory CI check: compares the committed OpenAPI schema cache against
 * the live upstream spec. Emits a GitHub Actions warning annotation if
 * they differ. Always exits 0 — this is informational, not blocking.
 *
 * Requires OAK_API_KEY in the environment.
 *
 * @packageDocumentation
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { isJsonObject } from '../collaboration-state/json.js';
import { resolveRepoRoot } from '../core/repo-root.js';

const SCHEMA_URL = 'https://open-api.thenational.academy/api/v0/swagger.json';
const CACHE_PATH = resolve(
  resolveRepoRoot(import.meta.url),
  'packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json',
);
const CACHE_FILE_ANNOTATION =
  'file=packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json';

function writeLine(message: string): void {
  process.stdout.write(`${message}\n`);
}

function extractVersion(schemaText: string): string {
  try {
    const parsed: unknown = JSON.parse(schemaText);
    if (isJsonObject(parsed) && 'info' in parsed) {
      const info: unknown = parsed['info'];
      if (isJsonObject(info) && 'version' in info) {
        const version: unknown = info['version'];
        return typeof version === 'string' ? version : 'unknown';
      }
    }
  } catch {
    // fall through
  }
  return 'unknown';
}

function buildDriftAnnotation(liveText: string, cachedText: string): string {
  const liveVersion = extractVersion(liveText);
  const cachedVersion = extractVersion(cachedText);

  const versionNote =
    liveVersion === cachedVersion
      ? `Both are version ${liveVersion} but content differs (upstream may have fixed descriptions or parameters without a version bump).`
      : `Cached: ${cachedVersion}, live: ${liveVersion}.`;

  return `::warning ${CACHE_FILE_ANNOTATION}::Schema cache has drifted from the live upstream spec. ${versionNote} Run \`pnpm sdk-codegen\` with OAK_API_KEY set to refresh.`;
}

async function fetchLiveSchema(): Promise<string | null> {
  const response = await fetch(SCHEMA_URL, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    writeLine(
      `::notice::Schema drift check skipped — upstream returned HTTP ${String(response.status)}.`,
    );
    return null;
  }

  const liveJson: unknown = await response.json();
  return JSON.stringify(liveJson, undefined, 2);
}

async function readCachedSchema(): Promise<string | null> {
  try {
    return await readFile(CACHE_PATH, 'utf8');
  } catch {
    writeLine(`::warning ${CACHE_FILE_ANNOTATION}::Schema cache file not found.`);
    return null;
  }
}

async function main(): Promise<void> {
  let liveText: string | null;

  try {
    liveText = await fetchLiveSchema();
  } catch (error) {
    writeLine(
      `::notice::Schema drift check skipped — failed to fetch upstream schema: ${String(error)}`,
    );
    return;
  }

  if (liveText === null) {
    return;
  }

  const cachedText = await readCachedSchema();

  if (cachedText === null) {
    return;
  }

  if (cachedText.trimEnd() === liveText.trimEnd()) {
    writeLine('Schema cache is up to date with the live upstream spec.');
    return;
  }

  writeLine(buildDriftAnnotation(liveText, cachedText));
}

try {
  await main();
} catch (error) {
  process.stdout.write(`::notice::Schema drift check failed unexpectedly: ${String(error)}\n`);
}
