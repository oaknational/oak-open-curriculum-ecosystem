#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const APPLICATION_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)*$/u;

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
