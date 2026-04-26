#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @see ../packages/core/build-metadata/src/semver.ts — canonical
 * implementation. This script runs as a `pnpm build` pre-step inside
 * `oak-search-cli`'s build (`"build": "node ../../scripts/validate-root-application-version.mjs && tsup"`),
 * which executes inside `turbo run build` at a point where
 * `@oaknational/build-metadata`'s `dist/` may or may not be populated
 * depending on the turbo task graph. To preserve the
 * no-pre-build-needed contract, the regex is intentionally inlined
 * rather than imported. Keep this copy byte-equivalent to the
 * canonical {@link SEMVER_PATTERN}; the parity test at
 * `packages/core/build-metadata/tests/semver-parity.test.ts` is the
 * anti-drift gate.
 */
const APPLICATION_VERSION_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function trimToUndefined(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const rootPackageJsonPath = path.join(repoRoot, 'package.json');
const packageJson = JSON.parse(readFileSync(rootPackageJsonPath, 'utf8'));

const override = trimToUndefined(process.env.APP_VERSION_OVERRIDE);
const version = override ?? trimToUndefined(packageJson.version);

if (!version) {
  fail(
    'Application version resolution failed. ' +
      'Set APP_VERSION_OVERRIDE or restore the root package.json version.',
  );
}

if (!APPLICATION_VERSION_PATTERN.test(version)) {
  fail(`Invalid application version "${version}". ` + 'Expected a semantic version such as 1.5.0.');
}

process.stdout.write(`Validated application version: ${version}\n`);
