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

const SCHEMA_URL = 'https://open-api.thenational.academy/api/v0/swagger.json';
const CACHE_PATH = resolve('packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json');

async function main() {
  let liveText;
  try {
    const response = await fetch(SCHEMA_URL, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      console.log(
        `::notice::Schema drift check skipped — upstream returned HTTP ${String(response.status)}.`,
      );
      return;
    }
    const liveJson = await response.json();
    liveText = JSON.stringify(liveJson, undefined, 2);
  } catch (error) {
    console.log(
      `::notice::Schema drift check skipped — failed to fetch upstream schema: ${String(error)}`,
    );
    return;
  }

  let cachedText;
  try {
    cachedText = await readFile(CACHE_PATH, 'utf8');
  } catch {
    console.log(
      '::warning file=packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json::Schema cache file not found.',
    );
    return;
  }

  if (cachedText.trimEnd() === liveText.trimEnd()) {
    console.log('Schema cache is up to date with the live upstream spec.');
    return;
  }

  // Extract versions for the summary
  try {
    const liveVersion = JSON.parse(liveText).info?.version ?? 'unknown';
    const cachedVersion = JSON.parse(cachedText).info?.version ?? 'unknown';

    const versionNote =
      liveVersion === cachedVersion
        ? `Both are version ${liveVersion} but content differs (upstream may have fixed descriptions or parameters without a version bump).`
        : `Cached: ${cachedVersion}, live: ${liveVersion}.`;

    console.log(
      `::warning file=packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json::Schema cache has drifted from the live upstream spec. ${versionNote} Run \`pnpm sdk-codegen\` with OAK_API_KEY set to refresh.`,
    );
  } catch {
    console.log(
      '::warning file=packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json::Schema cache differs from live upstream spec. Run `pnpm sdk-codegen` with OAK_API_KEY set to refresh.',
    );
  }
}

try {
  await main();
} catch (error) {
  console.log(`::notice::Schema drift check failed unexpectedly: ${String(error)}`);
}
